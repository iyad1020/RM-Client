/**
 * Maps Redmine issue journals → activity_feed events.
 * Pure helpers (no DB) so they can be unit-tested.
 */

const SKIP_DETAIL_NAMES = new Set(["watcher_id", "watcher"]);
const SKIP_DETAIL_PROPERTIES = new Set(["relation", "watcher"]);

const FIELD_LABELS = {
  status_id: "Статус",
  assigned_to_id: "Исполнитель",
  assigned_to: "Исполнитель",
  priority_id: "Приоритет",
  tracker_id: "Трекер",
  done_ratio: "% готовности",
  start_date: "Дата начала",
  due_date: "Срок",
  estimated_hours: "Оценка",
  subject: "Тема",
  description: "Описание",
};

const KIND_SUMMARY = {
  comment: "оставил(а) комментарий",
  status: "изменил(а) статус",
  assignee: "изменил(а) исполнителя",
  assigned: "назначил(а) вас исполнителем",
  due_date: "изменил(а) срок",
  priority: "изменил(а) приоритет",
  tracker: "изменил(а) трекер",
  progress: "изменил(а) прогресс или оценку",
  dates: "изменил(а) дату начала",
  attachment: "изменил(а) вложения",
  content: "изменил(а) тему или описание",
  custom_field: "изменил(а) доп. поле",
  other: "изменил(а) параметры задачи",
};

const GROUP_KINDS = {
  comment: ["comment"],
  params: [
    "status",
    "assignee",
    "due_date",
    "priority",
    "tracker",
    "progress",
    "dates",
    "content",
    "custom_field",
    "other",
  ],
  assigned: ["assigned"],
  attachment: ["attachment"],
};

function kindsForGroups(groups) {
  const set = new Set();
  (groups || []).forEach((group) => {
    (GROUP_KINDS[group] || []).forEach((kind) => set.add(kind));
  });
  return Array.from(set);
}

function kindFromDetail(detail, currentUserId) {
  const property = String(detail?.property || "").toLowerCase();
  const name = String(detail?.name || "");
  if (SKIP_DETAIL_PROPERTIES.has(property)) return null;
  if (SKIP_DETAIL_NAMES.has(name)) return null;
  if (property === "attachment") return "attachment";
  if (name === "status_id") return "status";
  if (name === "assigned_to_id" || name === "assigned_to") {
    if (currentUserId != null && Number(detail.new_value) === Number(currentUserId)) {
      return "assigned";
    }
    return "assignee";
  }
  if (name === "due_date") return "due_date";
  if (name === "priority_id") return "priority";
  if (name === "tracker_id") return "tracker";
  if (name === "done_ratio" || name === "estimated_hours") return "progress";
  if (name === "start_date") return "dates";
  if (name === "subject" || name === "description") return "content";
  if (property === "cf" || /^cf_/i.test(name)) return "custom_field";
  return "other";
}

function resolveLookup(map, value, emptyLabel = "—") {
  if (value === "" || value == null) return emptyLabel;
  const key = String(value);
  if (map && (map[key] != null || map[Number(key)] != null)) {
    const hit = map[key] ?? map[Number(key)];
    return typeof hit === "object" ? hit.name || key : String(hit);
  }
  return key;
}

function formatDateRu(value) {
  if (value === "" || value == null) return "—";
  const raw = String(value).slice(0, 10);
  const m = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return String(value);
  return `${m[3]}.${m[2]}.${m[1]}`;
}

function humanizeDetail(detail, lookups = {}) {
  const property = String(detail?.property || "").toLowerCase();
  const fieldName = String(detail?.name || "");

  if (property === "attachment") {
    const filename = detail.new_value || detail.old_value || "файл";
    if (detail.old_value && (detail.new_value === "" || detail.new_value == null)) {
      return `Файл удалён: ${filename}`;
    }
    return `Файл добавлен: ${filename}`;
  }

  if (fieldName === "description") {
    return "Описание изменено";
  }

  const name = FIELD_LABELS[fieldName] || fieldName || detail.property || "Поле";
  let oldVal = detail.old_value;
  let newVal = detail.new_value;

  if (fieldName === "status_id") {
    oldVal = resolveLookup(lookups.statuses, oldVal, "не задано");
    newVal = resolveLookup(lookups.statuses, newVal, "не задано");
  } else if (fieldName === "assigned_to_id" || fieldName === "assigned_to") {
    oldVal = resolveLookup(lookups.users, oldVal, "не назначен");
    newVal = resolveLookup(lookups.users, newVal, "не назначен");
  } else if (fieldName === "priority_id") {
    oldVal = resolveLookup(lookups.priorities, oldVal, "не задано");
    newVal = resolveLookup(lookups.priorities, newVal, "не задано");
  } else if (fieldName === "tracker_id") {
    oldVal = resolveLookup(lookups.trackers, oldVal, "не задано");
    newVal = resolveLookup(lookups.trackers, newVal, "не задано");
  } else if (fieldName === "done_ratio") {
    oldVal = oldVal === "" || oldVal == null ? "0%" : `${oldVal}%`;
    newVal = newVal === "" || newVal == null ? "0%" : `${newVal}%`;
  } else if (fieldName === "start_date" || fieldName === "due_date") {
    oldVal = formatDateRu(oldVal);
    newVal = formatDateRu(newVal);
  } else if (/^cf_/i.test(fieldName) || property === "cf") {
    const label = FIELD_LABELS[fieldName] || fieldName.replace(/^cf_/i, "Доп. поле #") || "Доп. поле";
    return `${label}: ${oldVal ?? "—"} → ${newVal ?? "—"}`;
  }

  const oldText = oldVal === "" || oldVal == null ? "—" : oldVal;
  const newText = newVal === "" || newVal == null ? "—" : newVal;
  return `${name}: ${oldText} → ${newText}`;
}

function excerptNotes(notes, maxLen = 280) {
  const text = String(notes || "")
    .replace(/\r\n/g, "\n")
    .trim();
  if (!text) return "";
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen - 1)}…`;
}

function buildLookupsFromMaps({ statusMap, priorities, trackers, users } = {}) {
  const statuses = {};
  Object.entries(statusMap || {}).forEach(([id, status]) => {
    statuses[id] = status?.name || status;
  });
  return {
    statuses,
    priorities: priorities || {},
    trackers: trackers || {},
    users: users || {},
  };
}

/**
 * Convert one Redmine journal into zero or more activity events.
 */
function eventsFromJournal(journal, context = {}) {
  const {
    issueId,
    issueSubject = "",
    projectName = "",
    currentUserId,
    sinceIso = null,
    lookups = {},
  } = context;

  const journalId = Number(journal?.id);
  if (!Number.isFinite(journalId)) return [];

  const actorId = journal?.user?.id != null ? Number(journal.user.id) : null;
  if (currentUserId != null && actorId === Number(currentUserId)) return [];

  const createdOn = journal.created_on || null;
  if (sinceIso && createdOn && String(createdOn) < String(sinceIso)) return [];

  const actorName = journal?.user?.name || "Пользователь";
  const base = {
    issue_id: Number(issueId),
    journal_id: journalId,
    actor_name: actorName,
    actor_id: actorId,
    issue_subject: issueSubject || "",
    project_name: projectName || "",
    created_on: createdOn || new Date().toISOString(),
  };

  const events = [];
  const notes = String(journal.notes || "").trim();
  if (notes) {
    events.push({
      ...base,
      kind: "comment",
      summary: KIND_SUMMARY.comment,
      detail_text: excerptNotes(notes),
    });
  }

  const details = Array.isArray(journal.details) ? journal.details : [];
  details.forEach((detail) => {
    const kind = kindFromDetail(detail, currentUserId);
    if (!kind) return;
    events.push({
      ...base,
      kind,
      summary: KIND_SUMMARY[kind] || KIND_SUMMARY.other,
      detail_text: humanizeDetail(detail, lookups),
    });
  });

  return events;
}

/**
 * Events for journals that are new relative to existingJournalIds.
 */
function eventsFromNewJournals(journals, existingJournalIds, context) {
  const known = existingJournalIds instanceof Set ? existingJournalIds : new Set(existingJournalIds || []);
  const out = [];
  (journals || []).forEach((journal) => {
    if (known.has(Number(journal.id))) return;
    out.push(...eventsFromJournal(journal, context));
  });
  return out;
}

function assignedEventForNewIssue(issue, currentUserId, sinceIso = null) {
  const issueId = Number(issue?.id);
  const userId = Number(currentUserId);
  if (!Number.isFinite(issueId) || !Number.isFinite(userId)) return null;
  const assigneeId = Number(issue.assigned_to?.id);
  if (assigneeId !== userId) return null;
  const authorId = Number(issue.author?.id);
  if (authorId === userId) return null;
  const createdOn = issue.created_on || issue.updated_on || new Date().toISOString();
  if (sinceIso && createdOn && String(createdOn) < String(sinceIso)) return null;
  return {
    issue_id: issueId,
    journal_id: null,
    kind: "assigned",
    actor_name: issue.author?.name || "Пользователь",
    actor_id: Number.isFinite(authorId) ? authorId : null,
    issue_subject: issue.subject || "",
    project_name: issue.project?.name || "",
    summary: KIND_SUMMARY.assigned,
    detail_text: "",
    created_on: issue.created_on || issue.updated_on || new Date().toISOString(),
  };
}

module.exports = {
  GROUP_KINDS,
  KIND_SUMMARY,
  kindsForGroups,
  kindFromDetail,
  humanizeDetail,
  excerptNotes,
  buildLookupsFromMaps,
  eventsFromJournal,
  eventsFromNewJournals,
  assignedEventForNewIssue,
};
