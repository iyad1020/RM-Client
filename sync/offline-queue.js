const db = require("../db/database");
const redmine = require("./redmine-client");
const syncEngine = require("./sync-engine");
const { resolveDescriptionAttachmentUrls, descriptionHasUploadPlaceholders, notesHaveImageTokens, resolveNotesImageMarkup } = require("./description-html");

function isNetworkError(error) {
  if (error?.name === "AbortError") return true;
  const message = String(error?.message || error || "").toLowerCase();
  return (
    message.includes("fetch failed") ||
    message.includes("network") ||
    message.includes("econnrefused") ||
    message.includes("enotfound") ||
    message.includes("timeout") ||
    message.includes("сеть")
  );
}

let flushRunning = false;
let onQueueFlushed = null;

function setQueueFlushedHandler(handler) {
  onQueueFlushed = typeof handler === "function" ? handler : null;
}

function noteAffectedIssue(issueIds, rawId) {
  const id = Number(rawId);
  if (Number.isFinite(id) && id > 0) issueIds.add(id);
}

function findJournalForNotes(journals, notes) {
  const needle = String(notes || "").trim();
  const list = Array.isArray(journals) ? journals.slice() : [];
  list.sort((a, b) => Number(b.id) - Number(a.id));
  if (needle) {
    const exact = list.find((journal) => String(journal?.notes || "").trim() === needle);
    if (exact) return exact;
    const contains = list.find((journal) => String(journal?.notes || "").includes(needle.slice(0, 80)));
    if (contains) return contains;
  }
  return list.find((journal) => String(journal?.notes || "").trim()) || null;
}

async function finalizeNotesImages(redmineUrl, apiKey, payload, remote) {
  const notes = payload?.issueData?.notes;
  const files = payload?.files || [];
  if (!notes || !files.length || !notesHaveImageTokens(notes)) return remote;

  const resolved = resolveNotesImageMarkup(notes, remote?.attachments || []);
  if (!resolved || resolved === notes) return remote;

  const journal = findJournalForNotes(remote?.journals, notes);
  if (!journal?.id) return remote;

  try {
    await redmine.updateJournal(redmineUrl, apiKey, journal.id, resolved);
    return true;
  } catch {
    return false;
  }
}

async function finalizeUpdateIssueAfterUpload(redmineUrl, apiKey, payload) {
  const issueId = payload.issueId;
  if (!issueId) return null;

  const uploadDescription = payload.issueData?.description;
  const files = payload.files || [];
  const localDescription = db.getIssueById(issueId)?.description;
  const notes = payload.issueData?.notes;

  // Комментарий / патч без описания — после аплоада картинок поправить notes под Visual editor.
  if (uploadDescription === undefined) {
    if (notes && files.length && notesHaveImageTokens(notes)) {
      const remote = await redmine.fetchIssueDetail(redmineUrl, apiKey, issueId);
      await finalizeNotesImages(redmineUrl, apiKey, payload, remote);
    }
    return { mode: "refresh" };
  }

  const remote = await redmine.fetchIssueDetail(redmineUrl, apiKey, issueId);
  let descriptionToSave = remote.description || uploadDescription;

  if (files.length && descriptionHasUploadPlaceholders(uploadDescription)) {
    const resolved = resolveDescriptionAttachmentUrls(uploadDescription, remote.attachments || []);
    if (resolved && resolved !== uploadDescription && !descriptionHasUploadPlaceholders(resolved)) {
      await redmine.updateIssue(redmineUrl, apiKey, issueId, { description: resolved });
      const refreshed = await redmine.fetchIssueDetail(redmineUrl, apiKey, issueId);
      return { mode: "save", detail: { ...refreshed, description: resolved } };
    }
    // Плейсхолдеры не резолвятся — оставляем локальный HTML (data URL), вложения с сервера.
    return {
      mode: "save",
      detail: {
        ...remote,
        description: localDescription != null ? localDescription : uploadDescription,
      },
    };
  }

  return { mode: "save", detail: { ...remote, description: descriptionToSave } };
}

async function flushOfflineQueue(redmineUrl, apiKey) {
  if (flushRunning) {
    return { processed: 0, failed: 0, skipped: true, issueIds: [] };
  }

  flushRunning = true;
  const affectedIssueIds = new Set();
  let processed = 0;
  let failed = 0;
  try {
    const items = db.getOfflineQueue();
    if (!items.length) return { processed: 0, failed: 0, issueIds: [] };

    for (const item of items) {
      const payload = JSON.parse(item.payload_json);
      try {
        if (item.type === "update_issue") {
          await redmine.updateIssueWithUploads(
            redmineUrl,
            apiKey,
            payload.issueId,
            payload.issueData,
            payload.files || [],
          );
          const final = await finalizeUpdateIssueAfterUpload(redmineUrl, apiKey, payload);
          db.removeOfflineItem(item.id);
          if (final?.mode === "save" && final.detail) {
            db.saveIssueDetail(final.detail);
          } else if (payload.issueId) {
            await syncEngine.refreshIssueDetail(redmineUrl, apiKey, payload.issueId);
          }
          noteAffectedIssue(affectedIssueIds, payload.issueId);
          processed += 1;
          continue;
        } else if (item.type === "create_issue") {
          const created = await redmine.createIssueWithUploads(
            redmineUrl,
            apiKey,
            payload.issueData,
            payload.files || [],
          );
          if (created.issueId) {
            await syncEngine.ensureIssueDetail(redmineUrl, apiKey, created.issueId);
            noteAffectedIssue(affectedIssueIds, created.issueId);
            if (payload.issueData?.parent_issue_id) {
              await syncEngine.refreshIssueDetail(redmineUrl, apiKey, payload.issueData.parent_issue_id);
              noteAffectedIssue(affectedIssueIds, payload.issueData.parent_issue_id);
            }
          }
        } else if (item.type === "create_time_entry") {
          if (!String(payload.entryData?.comments || "").trim()) {
            throw new Error("Укажите комментарий к трудозатратам.");
          }
          const created = await redmine.createTimeEntry(redmineUrl, apiKey, payload.entryData);
          if (created.timeEntry) {
            const local = payload.localId ? db.getTimeEntryById(payload.localId) : null;
            const extras = local
              ? {
                  started_at: local.started_at,
                  ended_at: local.ended_at,
                  entry_kind: local.entry_kind,
                  entry_source: local.entry_source,
                }
              : {};
            if (payload.localId) db.deleteLocalTimeEntry(payload.localId);
            db.upsertTimeEntry(created.timeEntry, extras);
            const issueId = payload.entryData?.issue_id || created.timeEntry.issue?.id;
            if (issueId) {
              await syncEngine.refreshIssueDetail(redmineUrl, apiKey, issueId).catch(() => {});
              noteAffectedIssue(affectedIssueIds, issueId);
            }
          }
        } else if (item.type === "update_time_entry") {
          if (!String(payload.entryData?.comments || "").trim()) {
            throw new Error("Укажите комментарий к трудозатратам.");
          }
          const updated = await redmine.updateTimeEntry(
            redmineUrl,
            apiKey,
            payload.entryId,
            payload.entryData,
          );
          if (updated.timeEntry) {
            db.upsertTimeEntry(updated.timeEntry);
          } else {
            db.markTimeEntrySyncStatus(payload.entryId, "synced", null);
          }
          const issueId = payload.entryData?.issue_id || updated.timeEntry?.issue?.id;
          if (issueId) {
            await syncEngine.refreshIssueDetail(redmineUrl, apiKey, issueId).catch(() => {});
            noteAffectedIssue(affectedIssueIds, issueId);
          }
        } else if (item.type === "delete_time_entry") {
          await redmine.deleteTimeEntry(redmineUrl, apiKey, payload.entryId);
          db.deleteLocalTimeEntry(payload.entryId);
          if (payload.issueId) {
            await syncEngine.refreshIssueDetail(redmineUrl, apiKey, payload.issueId).catch(() => {});
            noteAffectedIssue(affectedIssueIds, payload.issueId);
          }
        } else if (item.type === "delete_attachment") {
          await redmine.deleteAttachment(redmineUrl, apiKey, payload.attachmentId);
          db.removeAttachment(payload.attachmentId);
          if (payload.issueId) {
            await syncEngine.refreshIssueDetail(redmineUrl, apiKey, payload.issueId).catch(() => {});
            noteAffectedIssue(affectedIssueIds, payload.issueId);
          }
        }
        db.removeOfflineItem(item.id);
        processed += 1;
      } catch (error) {
        if (isNetworkError(error)) {
          db.markOfflineAttempt(item.id, error.message);
          if (item.type === "create_time_entry" && payload?.localId) {
            db.markTimeEntrySyncStatus(payload.localId, "error", error.message);
          }
          if (item.type === "update_time_entry" && payload?.entryId) {
            db.markTimeEntrySyncStatus(payload.entryId, "error", error.message);
          }
          failed += 1;
          break;
        }

        // Non-network error: permanent failure — rollback optimistic local state, drop from queue.
        if (item.type === "update_issue") {
          if (payload.issueId) {
            await syncEngine.refreshIssueDetail(redmineUrl, apiKey, payload.issueId).catch(() => {});
            noteAffectedIssue(affectedIssueIds, payload.issueId);
          }
          db.addSyncFailure({
            entityType: "issue",
            entityLabel: `#${payload.issueId}`,
            message: `Не удалось сохранить изменения задачи #${payload.issueId}: ${error.message}`,
          });
        } else if (item.type === "create_issue") {
          db.addSyncFailure({
            entityType: "issue",
            entityLabel: payload.issueData?.subject || "",
            message: `Не удалось создать задачу «${payload.issueData?.subject || ""}»: ${error.message}`,
          });
        } else if (item.type === "create_time_entry") {
          if (payload.localId) db.deleteLocalTimeEntry(payload.localId);
          if (payload.entryData?.issue_id && payload.entryData?.hours) {
            db.addIssueSpentHours(payload.entryData.issue_id, -Number(payload.entryData.hours));
          }
          db.addSyncFailure({
            entityType: "time_entry",
            entityLabel: `#${payload.entryData?.issue_id || ""}`,
            message: `Не удалось сохранить трудозатрату по задаче #${payload.entryData?.issue_id || ""}: ${error.message}`,
          });
        } else if (item.type === "update_time_entry") {
          const prev = payload.previousEntryData;
          if (prev) {
            db.updateLocalTimeEntry(payload.entryId, { ...prev, sync_status: "synced", sync_error: null });
            const hoursDelta = Number(payload.entryData.hours) - Number(prev.hours);
            if (payload.issueId && hoursDelta) db.addIssueSpentHours(payload.issueId, -hoursDelta);
          }
          db.addSyncFailure({
            entityType: "time_entry",
            entityLabel: `#${payload.issueId || ""}`,
            message: `Не удалось изменить трудозатрату по задаче #${payload.issueId || ""}: ${error.message}`,
          });
        } else if (item.type === "delete_time_entry") {
          if (payload.restoreEntry) {
            db.upsertTimeEntry(payload.restoreEntry);
            if (payload.issueId && payload.restoreEntry.hours) {
              db.addIssueSpentHours(payload.issueId, Number(payload.restoreEntry.hours));
            }
          }
          db.addSyncFailure({
            entityType: "time_entry",
            entityLabel: `#${payload.issueId || ""}`,
            message: `Не удалось удалить трудозатрату по задаче #${payload.issueId || ""}: ${error.message}`,
          });
        } else if (item.type === "delete_attachment") {
          if (payload.restoreAttachment && payload.issueId) {
            // Best-effort restore via detail refresh; row may already be gone locally.
            await syncEngine.refreshIssueDetail(redmineUrl, apiKey, payload.issueId).catch(() => {});
            noteAffectedIssue(affectedIssueIds, payload.issueId);
          }
          db.addSyncFailure({
            entityType: "attachment",
            entityLabel: payload.filename || `#${payload.attachmentId}`,
            message: `Не удалось удалить вложение «${payload.filename || payload.attachmentId}»: ${error.message}`,
          });
        }

        db.removeOfflineItem(item.id);
        failed += 1;
      }
    }

    return { processed, failed, issueIds: [...affectedIssueIds] };
  } finally {
    flushRunning = false;
    if (typeof onQueueFlushed === "function" && (processed > 0 || failed > 0 || affectedIssueIds.size)) {
      try {
        onQueueFlushed({
          processed,
          failed,
          issueIds: [...affectedIssueIds],
        });
      } catch (error) {
        console.error("onQueueFlushed failed:", error.message);
      }
    }
  }
}

async function updateIssueWithOffline(redmineUrl, apiKey, issueId, issueData, files = [], options = {}) {
  // Всегда мгновенно локально (в т.ч. с вложениями) — сеть фоном, как у трудозатрат.
  const localPatch = options.localPatch || issueData;
  db.applyIssueUpdatePatch(issueId, localPatch || {});
  db.enqueueOfflineItem("update_issue", {
    issueId,
    issueData,
    localIssueData: options.localPatch || undefined,
    files: files || [],
  });
  flushOfflineQueue(redmineUrl, apiKey).catch(() => {});
  return { ok: true, offline: true, queued: true };
}

async function createIssueWithOffline(redmineUrl, apiKey, issueData, files = []) {
  try {
    const created = await redmine.createIssueWithUploads(redmineUrl, apiKey, issueData, files);
    if (created.issueId) {
      await syncEngine.ensureIssueDetail(redmineUrl, apiKey, created.issueId);
      if (issueData.parent_issue_id) {
        await syncEngine.refreshIssueDetail(redmineUrl, apiKey, issueData.parent_issue_id);
      }
    }
    return { ok: true, offline: false, issueId: created.issueId };
  } catch (error) {
    if (isNetworkError(error)) {
      db.enqueueOfflineItem("create_issue", { issueData, files });
      return { ok: true, offline: true, queued: true, issueId: null };
    }
    throw error;
  }
}

async function createTimeEntryWithOffline(redmineUrl, apiKey, entryData, options = {}) {
  if (!String(entryData?.comments || "").trim()) {
    throw new Error("Укажите комментарий к трудозатратам.");
  }
  const localEntry = db.insertLocalTimeEntry(entryData);
  if (entryData.issue_id && entryData.hours) {
    db.addIssueSpentHours(entryData.issue_id, entryData.hours);
  }
  db.enqueueOfflineItem("create_time_entry", { entryData, localId: localEntry.id });
  if (!options.skipFlush) {
    flushOfflineQueue(redmineUrl, apiKey).catch(() => {});
  }
  return { ok: true, offline: true, queued: true, timeEntry: localEntry };
}

async function updateTimeEntryWithOffline(redmineUrl, apiKey, entryId, entryData) {
  const existing = db.getTimeEntryById(entryId);
  if (!existing) throw new Error("Запись трудозатрат не найдена.");

  if (
    Object.prototype.hasOwnProperty.call(entryData, "comments") &&
    !String(entryData.comments || "").trim()
  ) {
    throw new Error("Укажите комментарий к трудозатратам.");
  }

  const isLocalish =
    existing.sync_status === "pending" ||
    existing.sync_status === "error" ||
    existing.sync_status === "draft" ||
    Number(entryId) < 0;

  const hoursDelta = Number(entryData.hours) - Number(existing.hours);
  const mergedEntryData = {
    issue_id: existing.issue_id,
    hours: Number(entryData.hours),
    spent_on: entryData.spent_on || existing.spent_on,
    comments: entryData.comments,
    customer_name: entryData.customer_name,
    activity_id: entryData.activity_id,
  };

  if (isLocalish) {
    db.removeOfflineItemsForTimeEntry(entryId);
    const updated = db.updateLocalTimeEntry(entryId, {
      ...mergedEntryData,
      activity_name: entryData.activity_name || existing.activity_name,
      sync_status: "pending",
      sync_error: null,
    });
    if (existing.issue_id && hoursDelta) {
      db.addIssueSpentHours(existing.issue_id, hoursDelta);
    }
    db.enqueueOfflineItem("create_time_entry", {
      entryData: {
        issue_id: updated.issue_id,
        hours: updated.hours,
        spent_on: updated.spent_on,
        comments: updated.comments,
        customer_name: updated.customer_name,
        activity_id: updated.activity_id,
        activity_name: updated.activity_name,
      },
      localId: updated.id,
    });
    flushOfflineQueue(redmineUrl, apiKey).catch(() => {});
    return { ok: true, offline: true, queued: true, timeEntry: updated };
  }

  const currentUser = db.getReferenceData("current_user");
  const roles = db.getReferenceData("roles") || [];
  if (!redmine.canEditTimeEntry(existing, currentUser, roles)) {
    throw new Error("Недостаточно прав для редактирования этой записи трудозатрат.");
  }

  const previousEntryData = {
    hours: existing.hours,
    spent_on: existing.spent_on,
    comments: existing.comments,
    customer_name: existing.customer_name,
    activity_id: existing.activity_id,
    activity_name: existing.activity_name,
  };

  db.updateLocalTimeEntry(entryId, {
    ...mergedEntryData,
    activity_name: entryData.activity_name || existing.activity_name,
    sync_status: "pending",
    sync_error: null,
  });
  if (existing.issue_id && hoursDelta) {
    db.addIssueSpentHours(existing.issue_id, hoursDelta);
  }

  try {
    const updated = await redmine.updateTimeEntry(redmineUrl, apiKey, entryId, mergedEntryData);
    if (updated.timeEntry) db.upsertTimeEntry(updated.timeEntry);
    else db.markTimeEntrySyncStatus(entryId, "synced", null);
    if (existing.issue_id) {
      await syncEngine.refreshIssueDetail(redmineUrl, apiKey, existing.issue_id).catch(() => {});
    }
    return { ok: true, offline: false, timeEntry: db.getTimeEntryById(entryId) };
  } catch (error) {
    if (isNetworkError(error)) {
      db.enqueueOfflineItem("update_time_entry", {
        entryId,
        entryData: mergedEntryData,
        issueId: existing.issue_id,
        previousEntryData,
      });
      return { ok: true, offline: true, queued: true, timeEntry: db.getTimeEntryById(entryId) };
    }
    db.markTimeEntrySyncStatus(entryId, "error", error.message);
    throw error;
  }
}

async function deleteTimeEntryWithOffline(redmineUrl, apiKey, entryId) {
  const existing = db.getTimeEntryById(entryId);
  if (!existing) throw new Error("Запись трудозатрат не найдена.");

  const isLocalish =
    existing.sync_status === "pending" ||
    existing.sync_status === "error" ||
    existing.sync_status === "draft" ||
    Number(entryId) < 0;

  if (isLocalish) {
    db.discardLocalTimeEntry(entryId);
    return { ok: true, offline: false, discarded: true };
  }

  const currentUser = db.getReferenceData("current_user");
  const roles = db.getReferenceData("roles") || [];
  if (!redmine.canEditTimeEntry(existing, currentUser, roles)) {
    throw new Error("Недостаточно прав для удаления этой записи трудозатрат.");
  }

  try {
    await redmine.deleteTimeEntry(redmineUrl, apiKey, entryId);
    if (existing.issue_id && existing.hours) {
      db.addIssueSpentHours(existing.issue_id, -Number(existing.hours));
    }
    db.deleteLocalTimeEntry(entryId);
    if (existing.issue_id) {
      await syncEngine.refreshIssueDetail(redmineUrl, apiKey, existing.issue_id).catch(() => {});
    }
    return { ok: true, offline: false };
  } catch (error) {
    if (isNetworkError(error)) {
      if (existing.issue_id && existing.hours) {
        db.addIssueSpentHours(existing.issue_id, -Number(existing.hours));
      }
      db.deleteLocalTimeEntry(entryId);
      db.enqueueOfflineItem("delete_time_entry", {
        entryId,
        issueId: existing.issue_id,
        restoreEntry: existing,
      });
      return { ok: true, offline: true, queued: true };
    }
    throw error;
  }
}

async function deleteAttachmentWithOffline(redmineUrl, apiKey, attachmentId, issueId) {
  const existing = db.getAttachmentById(attachmentId);
  const filename = existing?.filename || String(attachmentId);
  // Optimistic local remove for instant UI.
  db.removeAttachment(attachmentId);
  db.enqueueOfflineItem("delete_attachment", {
    attachmentId,
    issueId: issueId || existing?.issue_id || null,
    filename,
    restoreAttachment: existing || null,
  });
  flushOfflineQueue(redmineUrl, apiKey).catch(() => {});
  return { ok: true, offline: true, queued: true, filename };
}

module.exports = {
  flushOfflineQueue,
  setQueueFlushedHandler,
  updateIssueWithOffline,
  createIssueWithOffline,
  createTimeEntryWithOffline,
  updateTimeEntryWithOffline,
  deleteTimeEntryWithOffline,
  deleteAttachmentWithOffline,
  isNetworkError,
};
