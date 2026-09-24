const PAGE_SIZE = 100;
const MAX_PAGES = 50;
const REQUEST_TIMEOUT_MS = 20000;
const CUSTOMER_NAME_FIELD_ID = 20;

function normalizeRedmineUrl(url) {
  const trimmed = String(url || "").trim();
  return trimmed.endsWith("/") ? trimmed.slice(0, -1) : trimmed;
}

function buildTimeEntryPayload(entryData) {
  const payload = { ...entryData };
  const customFields = Array.isArray(payload.custom_fields) ? [...payload.custom_fields] : [];
  if (payload.customer_name !== undefined) {
    customFields.push({ id: CUSTOMER_NAME_FIELD_ID, value: payload.customer_name || "" });
    delete payload.customer_name;
  }
  if (customFields.length) payload.custom_fields = customFields;
  return payload;
}

function normalizeTimeEntry(entry) {
  if (!entry) return entry;
  const cf = (entry.custom_fields || []).find((f) => Number(f.id) === CUSTOMER_NAME_FIELD_ID);
  if (cf) return { ...entry, customer_name: cf.value || "" };
  return entry;
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (error) {
    if (error?.name === "AbortError") {
      const timeoutError = new Error("Превышено время ожидания ответа Redmine (timeout).");
      timeoutError.name = "AbortError";
      throw timeoutError;
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

async function redmineRequest(redmineUrl, apiKey, endpointPath, params = {}) {
  const baseUrl = normalizeRedmineUrl(redmineUrl);
  const key = String(apiKey || "").trim();
  if (!baseUrl || !key) {
    throw new Error("Заполните URL и API key.");
  }

  const url = new URL(`${baseUrl}${endpointPath}`);
  Object.entries(params).forEach(([name, value]) => {
    if (value === undefined || value === null || value === "") return;
    url.searchParams.set(name, String(value));
  });
  url.searchParams.set("key", key);

  const response = await fetchWithTimeout(url.toString(), { headers: { Accept: "application/json" } });
  if (!response.ok) {
    throw new Error(`Redmine API: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

async function fetchAllPages(redmineUrl, apiKey, endpointPath, rootField, params = {}) {
  const collected = [];
  let offset = 0;

  for (let page = 0; page < MAX_PAGES; page += 1) {
    const payload = await redmineRequest(redmineUrl, apiKey, endpointPath, {
      ...params,
      limit: PAGE_SIZE,
      offset,
    });

    const chunk = payload[rootField] || [];
    collected.push(...chunk);
    if (chunk.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }

  return collected;
}

async function testConnection(redmineUrl, apiKey) {
  const baseUrl = normalizeRedmineUrl(redmineUrl);
  const token = String(apiKey || "").trim();
  if (!baseUrl || !token) {
    return { ok: false, message: "Заполните URL и API key." };
  }

  try {
    const data = await redmineRequest(baseUrl, token, "/users/current.json");
    const user = data?.user || {};
    const displayName = [user.firstname, user.lastname].filter(Boolean).join(" ").trim() || user.login || "пользователь";
    return { ok: true, message: `Подключено как ${displayName}.`, user };
  } catch (error) {
    return { ok: false, message: error.message };
  }
}

async function loadReferenceData(redmineUrl, apiKey) {
  const safeLoad = async (loader, fallbackValue) => {
    try {
      return await loader();
    } catch {
      return fallbackValue;
    }
  };

  const [projects, users, issueStatuses, trackers, priorities, currentUser, activities, roles] = await Promise.all([
    safeLoad(() => fetchAllPages(redmineUrl, apiKey, "/projects.json", "projects", { status: 1 }), []),
    safeLoad(() => fetchAllPages(redmineUrl, apiKey, "/users.json", "users", { status: 1 }), []),
    safeLoad(
      () => redmineRequest(redmineUrl, apiKey, "/issue_statuses.json").then((d) => d.issue_statuses || []),
      [],
    ),
    safeLoad(() => redmineRequest(redmineUrl, apiKey, "/trackers.json").then((d) => d.trackers || []), []),
    safeLoad(
      () =>
        redmineRequest(redmineUrl, apiKey, "/enumerations/issue_priorities.json").then(
          (d) => d.issue_priorities || [],
        ),
      [],
    ),
    safeLoad(
      () =>
        redmineRequest(redmineUrl, apiKey, "/users/current.json", { include: "memberships" }).then(
          (d) => d.user || null,
        ),
      null,
    ),
    safeLoad(
      () =>
        redmineRequest(redmineUrl, apiKey, "/enumerations/time_entry_activities.json").then(
          (d) => d.time_entry_activities || [],
        ),
      [],
    ),
    safeLoad(() => loadRolesWithPermissions(redmineUrl, apiKey), []),
  ]);

  const normalizedUsers = [...users];
  if (currentUser && !normalizedUsers.some((user) => Number(user.id) === Number(currentUser.id))) {
    normalizedUsers.push(currentUser);
  }

  return { projects, users: normalizedUsers, issueStatuses, trackers, priorities, currentUser, activities, roles };
}

async function loadRolesWithPermissions(redmineUrl, apiKey) {
  const data = await redmineRequest(redmineUrl, apiKey, "/roles.json");
  const roles = data.roles || [];
  const detailed = await Promise.all(
    roles.map(async (role) => {
      try {
        const full = await redmineRequest(redmineUrl, apiKey, `/roles/${role.id}.json`);
        return full.role || role;
      } catch {
        return role;
      }
    }),
  );
  return detailed;
}

async function fetchIssueDetail(redmineUrl, apiKey, issueId) {
  const data = await redmineRequest(redmineUrl, apiKey, `/issues/${issueId}.json`, {
    include: "journals,children,relations,attachments,watchers,allowed_statuses",
  });
  return data.issue;
}

function filterCustomFieldsForIssueForm(catalog, projectId, trackerId) {
  const pid = Number(projectId);
  const tid = Number(trackerId);
  return (catalog || [])
    .filter((cf) => {
      const customized = String(cf.customized_type || cf.type || "issue").toLowerCase();
      // Catalog mixes issue / timeentry / project / user fields.
      if (customized && customized !== "issue" && !customized.includes("issue")) return false;
      const projects = cf.projects || [];
      const trackers = cf.trackers || [];
      const projectOk =
        !Number.isFinite(pid) ||
        !projects.length ||
        projects.some((p) => Number(p.id ?? p) === pid);
      const trackerOk =
        !Number.isFinite(tid) ||
        !trackers.length ||
        trackers.some((t) => Number(t.id ?? t) === tid);
      return projectOk && trackerOk;
    })
    .map((cf) => ({
      id: cf.id,
      name: cf.name,
      field_format: cf.field_format,
      possible_values: cf.possible_values || [],
      is_required: Boolean(cf.is_required),
      multiple: Boolean(cf.multiple),
    }));
}

/** Global custom field catalog — works without «add issue» permission. */
async function fetchCustomFieldsCatalog(redmineUrl, apiKey) {
  const data = await redmineRequest(redmineUrl, apiKey, "/custom_fields.json");
  return data.custom_fields || [];
}

function normalizeIssueFormField(cf, catalogEntry) {
  const cat = catalogEntry || {};
  const id = Number(cf?.id ?? cat.id);
  return {
    id,
    name: cf?.name || cat.name || `#${cf?.id ?? cat.id}`,
    field_format: cf?.field_format || cat.field_format || "string",
    possible_values: (cf?.possible_values && cf.possible_values.length
      ? cf.possible_values
      : cat.possible_values) || [],
    // /issues/new.json usually omits is_required — take it from the catalog / `required`.
    is_required: Boolean(cat.is_required ?? cat.required ?? cf?.is_required ?? cf?.required),
    multiple: Boolean(cat.multiple ?? cf?.multiple),
  };
}

/** Parse required custom field ids from Redmine HTML new-issue form. */
function parseRequiredCustomFieldIdsFromNewIssueHtml(html) {
  const ids = new Set();
  const source = String(html || "");
  if (!source) return ids;

  const labelRe =
    /<label\b([^>]*)>([\s\S]*?)<\/label>/gi;
  let match;
  while ((match = labelRe.exec(source))) {
    const attrs = match[1] || "";
    const body = match[2] || "";
    const forMatch = /\bfor\s*=\s*["']issue_custom_field_values_(\d+)["']/i.exec(attrs);
    const idFromFor = forMatch ? Number(forMatch[1]) : NaN;
    const idFromBody = (() => {
      const m = /custom_field_values[\[_](\d+)/i.exec(body);
      return m ? Number(m[1]) : NaN;
    })();
    const id = Number.isFinite(idFromFor) ? idFromFor : idFromBody;
    if (!Number.isFinite(id)) continue;
    const required =
      /\brequired\b/i.test(attrs) ||
      /\brequired\b/i.test(body) ||
      /<span[^>]*class=["'][^"']*\brequired\b/i.test(body) ||
      /\*\s*</.test(body) ||
      />\s*\*\s*</.test(body);
    if (required) ids.add(id);
  }

  // Parent wrappers: <p class="required">…custom_field_values[12]…
  const blockRe =
    /<(?:p|div|li)\b[^>]*\bclass=["'][^"']*\brequired\b[^"']*["'][^>]*>[\s\S]*?custom_field_values[\[_](\d+)/gi;
  while ((match = blockRe.exec(source))) {
    const id = Number(match[1]);
    if (Number.isFinite(id)) ids.add(id);
  }

  return ids;
}

async function redmineRequestText(redmineUrl, apiKey, endpointPath, params = {}) {
  const baseUrl = normalizeRedmineUrl(redmineUrl);
  const key = String(apiKey || "").trim();
  if (!baseUrl || !key) {
    throw new Error("Заполните URL и API key.");
  }
  const url = new URL(`${baseUrl}${endpointPath}`);
  Object.entries(params).forEach(([name, value]) => {
    if (value === undefined || value === null || value === "") return;
    url.searchParams.set(name, String(value));
  });
  url.searchParams.set("key", key);
  const response = await fetchWithTimeout(url.toString(), {
    headers: { Accept: "text/html,application/xhtml+xml" },
  });
  if (!response.ok) {
    throw new Error(`Redmine API: ${response.status} ${response.statusText}`);
  }
  return response.text();
}

async function fetchRequiredCustomFieldIdsFromNewIssueHtml(redmineUrl, apiKey, projectId, trackerId) {
  const params = {};
  if (projectId != null && projectId !== "") params.project_id = Number(projectId);
  if (trackerId != null && trackerId !== "") params.tracker_id = Number(trackerId);
  const html = await redmineRequestText(redmineUrl, apiKey, "/issues/new", params);
  return parseRequiredCustomFieldIdsFromNewIssueHtml(html);
}

async function fetchIssueCustomFieldsFromProjectSample(redmineUrl, apiKey, projectId) {
  if (projectId == null || projectId === "") return [];
  const data = await redmineRequest(redmineUrl, apiKey, "/issues.json", {
    project_id: Number(projectId),
    status_id: "*",
    limit: 1,
    sort: "updated_on:desc",
    subproject_id: "!*",
  });
  const summary = (data.issues || [])[0];
  if (!summary?.id) return [];
  const detail = await fetchIssueDetail(redmineUrl, apiKey, summary.id);
  return detail.custom_fields || [];
}

/** When /issues/new.json and catalog are forbidden — infer defs from an existing issue. */
function inferFormFieldsFromIssueCustomFields(cfs) {
  return (cfs || [])
    .map((cf) => {
      const id = Number(cf?.id);
      const name = String(cf?.name || "").trim() || `#${id}`;
      const multiple = Boolean(cf?.multiple) || Array.isArray(cf?.value);
      // Without catalog we lack enums/formats; string inputs are the safe create UX.
      // FIO is required on this Redmine for issue create (confirmed via business form).
      const isRequired = /фио\s*заказчик/i.test(name);
      return {
        id,
        name,
        field_format: "string",
        possible_values: [],
        is_required: isRequired,
        multiple: false,
        inferred_from_issue: true,
      };
    })
    .filter((cf) => Number.isFinite(cf.id));
}

/** Custom field definitions for project + tracker (Redmine issue form). */
async function fetchIssueFormFields(redmineUrl, apiKey, projectId, trackerId) {
  const params = {};
  if (projectId != null && projectId !== "") params.project_id = Number(projectId);
  if (trackerId != null && trackerId !== "") params.tracker_id = Number(trackerId);

  let fromNew = [];
  try {
    const data = await redmineRequest(redmineUrl, apiKey, "/issues/new.json", params);
    fromNew = data.issue?.custom_fields || [];
  } catch (error) {
    if (!String(error.message || "").includes("403")) throw error;
  }

  let catalogAll = [];
  try {
    catalogAll = await fetchCustomFieldsCatalog(redmineUrl, apiKey);
  } catch {
    catalogAll = [];
  }
  const catalogFiltered = filterCustomFieldsForIssueForm(catalogAll, projectId, trackerId);
  const catalogById = new Map((catalogAll || []).map((cf) => [Number(cf.id), cf]));

  // HTML /issues/new with API key often returns the login page — only try when JSON worked
  // or catalog exists (otherwise it's wasted latency and a layout jerk in the UI).
  let requiredFromHtml = new Set();
  if (fromNew.length || catalogFiltered.length) {
    const needsRequiredHint =
      fromNew.some((cf) => !(cf?.is_required || cf?.required)) ||
      !catalogFiltered.some((cf) => cf.is_required);
    if (needsRequiredHint && projectId != null && projectId !== "") {
      try {
        requiredFromHtml = await fetchRequiredCustomFieldIdsFromNewIssueHtml(
          redmineUrl,
          apiKey,
          projectId,
          trackerId,
        );
      } catch {
        requiredFromHtml = new Set();
      }
    }
  }

  const enrich = (cf, cat) => {
    const base = normalizeIssueFormField(cf || cat, cat || null);
    const id = Number(base.id);
    return {
      ...base,
      is_required: Boolean(base.is_required || requiredFromHtml.has(id)),
    };
  };

  if (fromNew.length) {
    return fromNew
      .map((cf) => enrich(cf, catalogById.get(Number(cf.id))))
      .filter((cf) => Number.isFinite(cf.id));
  }

  if (catalogFiltered.length) {
    return catalogFiltered.map((cat) => enrich(cat, cat));
  }

  // Both /issues/new.json and /custom_fields.json forbidden (common for non-admin keys).
  try {
    const sample = await fetchIssueCustomFieldsFromProjectSample(redmineUrl, apiKey, projectId);
    return inferFormFieldsFromIssueCustomFields(sample);
  } catch {
    return [];
  }
}

async function fetchProjectIssues(redmineUrl, apiKey, projectId, updatedSince = null) {
  const params = {
    project_id: projectId,
    status_id: "*",
    sort: "updated_on:asc",
    // Без этого Redmine подмешивает задачи подпроектов, даже если их не включали в синк.
    subproject_id: "!*",
  };
  if (updatedSince) {
    params.updated_on = `>=${updatedSince}`;
  }
  return fetchAllPages(redmineUrl, apiKey, "/issues.json", "issues", params);
}

/** Issues where current user is a watcher (summary only). */
async function fetchWatchedIssues(redmineUrl, apiKey) {
  return fetchAllPages(redmineUrl, apiKey, "/issues.json", "issues", {
    watcher_id: "me",
    status_id: "*",
    sort: "updated_on:desc",
  });
}

async function fetchTimeEntries(redmineUrl, apiKey, params = {}) {
  const entries = await fetchAllPages(redmineUrl, apiKey, "/time_entries.json", "time_entries", params);
  return entries.map(normalizeTimeEntry);
}

async function updateIssue(redmineUrl, apiKey, issueId, issueData) {
  const baseUrl = normalizeRedmineUrl(redmineUrl);
  const key = String(apiKey || "").trim();
  if (!baseUrl || !key) {
    throw new Error("Заполните URL и API key.");
  }
  const url = new URL(`${baseUrl}/issues/${issueId}.json`);
  url.searchParams.set("key", key);

  const body = { issue: issueData };
  console.log("[redmine:update-issue] PUT", url.pathname, JSON.stringify(body));

  const response = await fetchWithTimeout(url.toString(), {
    method: "PUT",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const details = await readRedmineError(response);
    throw new Error(
      `Redmine API update: ${response.status} ${response.statusText}${details ? ` — ${details}` : ""}`,
    );
  }
  return { ok: true };
}

async function updateJournal(redmineUrl, apiKey, journalId, notes) {
  const baseUrl = normalizeRedmineUrl(redmineUrl);
  const key = String(apiKey || "").trim();
  const id = Number(journalId);
  if (!baseUrl || !key) throw new Error("Заполните URL и API key.");
  if (!Number.isFinite(id) || id <= 0) throw new Error("Некорректный id журнала.");

  const url = new URL(`${baseUrl}/journals/${id}.json`);
  url.searchParams.set("key", key);
  const response = await fetchWithTimeout(url.toString(), {
    method: "PUT",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ journal: { notes: String(notes || "") } }),
  });
  if (!response.ok) {
    const details = await readRedmineError(response);
    throw new Error(
      `Redmine API journal: ${response.status} ${response.statusText}${details ? ` — ${details}` : ""}`,
    );
  }
  return { ok: true };
}

async function readRedmineError(response) {
  try {
    const data = await response.json();
    if (Array.isArray(data?.errors)) return data.errors.join("; ");
    if (data?.errors && typeof data.errors === "object") {
      return Object.entries(data.errors)
        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
        .join("; ");
    }
    if (data?.error) return String(data.error);
  } catch {
    // ignore parse errors
  }
  return "";
}

async function createIssue(redmineUrl, apiKey, issueData) {
  const baseUrl = normalizeRedmineUrl(redmineUrl);
  const key = String(apiKey || "").trim();
  if (!baseUrl || !key) {
    throw new Error("Заполните URL и API key.");
  }
  const url = new URL(`${baseUrl}/issues.json`);
  url.searchParams.set("key", key);

  const response = await fetchWithTimeout(url.toString(), {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ issue: issueData }),
  });

  if (!response.ok) {
    const details = await readRedmineError(response);
    throw new Error(
      `Redmine API create: ${response.status} ${response.statusText}${details ? ` — ${details}` : ""}`,
    );
  }

  const data = await response.json();
  return { ok: true, issueId: data?.issue?.id || null };
}

async function uploadAttachment(redmineUrl, apiKey, file) {
  const baseUrl = normalizeRedmineUrl(redmineUrl);
  const key = String(apiKey || "").trim();
  if (!baseUrl || !key) {
    throw new Error("Заполните URL и API key.");
  }
  const rawFilename = String(file.filename || "attachment.bin").trim() || "attachment.bin";
  const url = new URL(`${baseUrl}/uploads.json`);
  url.searchParams.set("key", key);
  url.searchParams.set("filename", rawFilename);

  const body = Buffer.from(file.dataBase64 || "", "base64");
  if (!body.length) {
    throw new Error(`Файл «${rawFilename}» пустой или повреждён.`);
  }

  const response = await fetchWithTimeout(url.toString(), {
    method: "POST",
    headers: {
      Accept: "application/json",
      // Redmine rejects uploads unless Content-Type is exactly application/octet-stream.
      "Content-Type": "application/octet-stream",
    },
    body,
  });

  if (!response.ok) {
    const details = await readRedmineError(response);
    throw new Error(`Upload failed: ${response.status} ${response.statusText}${details ? ` — ${details}` : ""}`);
  }

  const data = await response.json();
  return {
    token: data?.upload?.token,
    filename: rawFilename,
    content_type: file.contentType || "application/octet-stream",
  };
}

async function buildUploadsPayload(redmineUrl, apiKey, files = []) {
  const uploads = [];
  for (const file of files) {
    const uploaded = await uploadAttachment(redmineUrl, apiKey, file);
    if (uploaded.token) {
      uploads.push(uploaded);
    }
  }
  return uploads;
}

async function createIssueWithUploads(redmineUrl, apiKey, issueData, files = []) {
  const uploads = await buildUploadsPayload(redmineUrl, apiKey, files);
  const payload = { ...issueData };
  if (uploads.length) {
    payload.uploads = uploads;
  }
  return createIssue(redmineUrl, apiKey, payload);
}

async function updateIssueWithUploads(redmineUrl, apiKey, issueId, issueData, files = []) {
  const uploads = await buildUploadsPayload(redmineUrl, apiKey, files);
  const payload = { ...(issueData || {}) };
  // watcher_user_ids works on create only — updates need /issues/:id/watchers.
  const watcherIds = Array.isArray(payload.watcher_user_ids) ? payload.watcher_user_ids : undefined;
  delete payload.watcher_user_ids;
  if (uploads.length) {
    payload.uploads = uploads;
  }

  const hasIssueFields = Object.keys(payload).length > 0;
  if (hasIssueFields) {
    await updateIssue(redmineUrl, apiKey, issueId, payload);
  }
  if (watcherIds !== undefined) {
    await syncIssueWatchers(redmineUrl, apiKey, issueId, watcherIds);
  }
  return { ok: true };
}

async function addIssueWatcher(redmineUrl, apiKey, issueId, userId) {
  const baseUrl = normalizeRedmineUrl(redmineUrl);
  const key = String(apiKey || "").trim();
  if (!baseUrl || !key) {
    throw new Error("Заполните URL и API key.");
  }
  const id = Number(userId);
  if (!Number.isFinite(id) || id <= 0) {
    throw new Error("Некорректный id наблюдателя.");
  }

  const url = new URL(`${baseUrl}/issues/${issueId}/watchers.json`);
  url.searchParams.set("key", key);
  console.log("[redmine:add-watcher] POST", url.pathname, JSON.stringify({ user_id: id }));

  const response = await fetchWithTimeout(url.toString(), {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: id }),
  });

  // 422 often means "already a watcher" — treat as success.
  if (!response.ok && response.status !== 422) {
    const details = await readRedmineError(response);
    throw new Error(
      `Redmine API add watcher: ${response.status} ${response.statusText}${details ? ` — ${details}` : ""}`,
    );
  }
  return { ok: true };
}

async function removeIssueWatcher(redmineUrl, apiKey, issueId, userId) {
  const baseUrl = normalizeRedmineUrl(redmineUrl);
  const key = String(apiKey || "").trim();
  if (!baseUrl || !key) {
    throw new Error("Заполните URL и API key.");
  }
  const id = Number(userId);
  if (!Number.isFinite(id) || id <= 0) {
    throw new Error("Некорректный id наблюдателя.");
  }

  const url = new URL(`${baseUrl}/issues/${issueId}/watchers/${id}.json`);
  url.searchParams.set("key", key);
  console.log("[redmine:remove-watcher] DELETE", url.pathname);

  const response = await fetchWithTimeout(url.toString(), {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });

  // 404 = already removed.
  if (!response.ok && response.status !== 404) {
    const details = await readRedmineError(response);
    throw new Error(
      `Redmine API remove watcher: ${response.status} ${response.statusText}${details ? ` — ${details}` : ""}`,
    );
  }
  return { ok: true };
}

/** Replace watchers on an existing issue via dedicated REST endpoints (Redmine ≥ 2.3). */
async function syncIssueWatchers(redmineUrl, apiKey, issueId, desiredIds, currentIds = null) {
  const desired = Array.from(
    new Set((desiredIds || []).map(Number).filter((id) => Number.isFinite(id) && id > 0)),
  );

  let current = Array.isArray(currentIds)
    ? currentIds.map(Number).filter((id) => Number.isFinite(id) && id > 0)
    : null;

  if (!current) {
    const detail = await fetchIssueDetail(redmineUrl, apiKey, issueId);
    current = (detail.watchers || []).map((w) => Number(w.id)).filter((id) => Number.isFinite(id) && id > 0);
  }

  const desiredSet = new Set(desired);
  const currentSet = new Set(current);

  for (const id of desiredSet) {
    if (!currentSet.has(id)) {
      await addIssueWatcher(redmineUrl, apiKey, issueId, id);
    }
  }
  for (const id of currentSet) {
    if (!desiredSet.has(id)) {
      await removeIssueWatcher(redmineUrl, apiKey, issueId, id);
    }
  }
  return { ok: true };
}

async function fetchProjectMembers(redmineUrl, apiKey, projectId) {
  const memberships = await fetchAllPages(
    redmineUrl,
    apiKey,
    `/projects/${projectId}/memberships.json`,
    "memberships",
    { include: "user" },
  );
  const users = [];
  const seen = new Set();
  memberships.forEach((m) => {
    const user = m?.user;
    if (!user?.id || seen.has(Number(user.id))) return;
    seen.add(Number(user.id));
    users.push({ id: user.id, name: user.name || user.login || `ID ${user.id}` });
  });
  return users;
}

async function createTimeEntry(redmineUrl, apiKey, entryData) {
  const baseUrl = normalizeRedmineUrl(redmineUrl);
  const key = String(apiKey || "").trim();
  if (!baseUrl || !key) {
    throw new Error("Заполните URL и API key.");
  }
  const url = new URL(`${baseUrl}/time_entries.json`);
  url.searchParams.set("key", key);

  const response = await fetchWithTimeout(url.toString(), {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ time_entry: buildTimeEntryPayload(entryData) }),
  });

  if (!response.ok) {
    const details = await readRedmineError(response);
    throw new Error(
      `Redmine API time entry: ${response.status} ${response.statusText}${details ? ` — ${details}` : ""}`,
    );
  }

  const data = await response.json();
  return { ok: true, timeEntry: normalizeTimeEntry(data?.time_entry) };
}

async function updateTimeEntry(redmineUrl, apiKey, entryId, entryData) {
  const baseUrl = normalizeRedmineUrl(redmineUrl);
  const key = String(apiKey || "").trim();
  if (!baseUrl || !key) {
    throw new Error("Заполните URL и API key.");
  }
  const url = new URL(`${baseUrl}/time_entries/${entryId}.json`);
  url.searchParams.set("key", key);

  const response = await fetchWithTimeout(url.toString(), {
    method: "PUT",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ time_entry: buildTimeEntryPayload(entryData) }),
  });

  if (!response.ok) {
    const details = await readRedmineError(response);
    throw new Error(
      `Redmine API time entry update: ${response.status} ${response.statusText}${details ? ` — ${details}` : ""}`,
    );
  }

  // Some Redmine versions return 204 with empty body.
  let timeEntry = null;
  const text = await response.text();
  if (text) {
    try {
      timeEntry = normalizeTimeEntry(JSON.parse(text)?.time_entry || null);
    } catch {
      timeEntry = null;
    }
  }
  if (!timeEntry) {
    const fetched = await redmineRequest(redmineUrl, apiKey, `/time_entries/${entryId}.json`);
    timeEntry = normalizeTimeEntry(fetched.time_entry || null);
  }
  return { ok: true, timeEntry };
}

async function deleteTimeEntry(redmineUrl, apiKey, entryId) {
  const baseUrl = normalizeRedmineUrl(redmineUrl);
  const key = String(apiKey || "").trim();
  if (!baseUrl || !key) {
    throw new Error("Заполните URL и API key.");
  }
  const url = new URL(`${baseUrl}/time_entries/${entryId}.json`);
  url.searchParams.set("key", key);

  const response = await fetchWithTimeout(url.toString(), {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Redmine API time entry delete: ${response.status} ${response.statusText}`);
  }
  return { ok: true };
}

async function deleteAttachment(redmineUrl, apiKey, attachmentId) {
  const baseUrl = normalizeRedmineUrl(redmineUrl);
  const key = String(apiKey || "").trim();
  if (!baseUrl || !key) {
    throw new Error("Заполните URL и API key.");
  }
  const id = Number(attachmentId);
  if (!Number.isFinite(id) || id <= 0) {
    throw new Error("Некорректный id вложения.");
  }
  const url = new URL(`${baseUrl}/attachments/${id}.json`);
  url.searchParams.set("key", key);

  const response = await fetchWithTimeout(url.toString(), {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });

  if (!response.ok && response.status !== 404) {
    const details = await readRedmineError(response);
    throw new Error(
      `Не удалось удалить вложение: ${response.status} ${response.statusText}${details ? ` — ${details}` : ""}`,
    );
  }
  return { ok: true };
}

/** Mirrors Redmine TimeEntry#editable_by? using cached roles + memberships. */
function canEditTimeEntry(entry, currentUser, roles = []) {
  if (!entry) return false;
  const syncStatus = entry.sync_status || "synced";
  if (syncStatus === "pending" || syncStatus === "error" || Number(entry.id) < 0) return true;
  if (currentUser?.admin) return true;

  const memberships = currentUser?.memberships || [];
  const membership = memberships.find((m) => Number(m.project?.id) === Number(entry.project_id));
  if (!membership) return false;

  const roleIds = new Set((membership.roles || []).map((r) => Number(r.id)));
  const permissions = new Set();
  (roles || []).forEach((role) => {
    if (!roleIds.has(Number(role.id))) return;
    (role.permissions || []).forEach((p) => permissions.add(p));
  });

  const isOwn = Number(entry.user_id) === Number(currentUser?.id);
  return permissions.has("edit_time_entries") || (isOwn && permissions.has("edit_own_time_entries"));
}

module.exports = {
  normalizeRedmineUrl,
  fetchWithTimeout,
  redmineRequest,
  fetchAllPages,
  testConnection,
  loadReferenceData,
  loadRolesWithPermissions,
  fetchIssueDetail,
  fetchIssueFormFields,
  filterCustomFieldsForIssueForm,
  normalizeIssueFormField,
  parseRequiredCustomFieldIdsFromNewIssueHtml,
  inferFormFieldsFromIssueCustomFields,
  fetchProjectIssues,
  fetchWatchedIssues,
  fetchTimeEntries,
  updateIssue,
  updateIssueWithUploads,
  addIssueWatcher,
  removeIssueWatcher,
  syncIssueWatchers,
  createIssue,
  createIssueWithUploads,
  createTimeEntry,
  updateTimeEntry,
  deleteTimeEntry,
  deleteAttachment,
  updateJournal,
  canEditTimeEntry,
  fetchProjectMembers,
};
