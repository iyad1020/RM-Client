const path = require("path");
const fs = require("fs");
const Database = require("better-sqlite3");

const SCHEMA_VERSION = 11;

let dbInstance = null;

function getDbPath(userDataPath) {
  return path.join(userDataPath, "cache.db");
}

function runMigrations(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS app_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reference_data (
      type TEXT PRIMARY KEY,
      data_json TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sync_projects (
      project_id INTEGER PRIMARY KEY,
      project_name TEXT NOT NULL,
      enabled INTEGER NOT NULL DEFAULT 1,
      last_sync_at TEXT,
      issue_count INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS issues (
      id INTEGER PRIMARY KEY,
      project_id INTEGER,
      project_name TEXT,
      tracker_id INTEGER,
      tracker_name TEXT,
      status_id INTEGER,
      status_name TEXT,
      status_is_closed INTEGER NOT NULL DEFAULT 0,
      priority_id INTEGER,
      priority_name TEXT,
      author_id INTEGER,
      author_name TEXT,
      assigned_to_id INTEGER,
      assigned_to_name TEXT,
      subject TEXT,
      description TEXT,
      start_date TEXT,
      due_date TEXT,
      done_ratio INTEGER NOT NULL DEFAULT 0,
      estimated_hours REAL,
      spent_hours REAL,
      created_on TEXT,
      updated_on TEXT,
      is_private INTEGER NOT NULL DEFAULT 0,
      parent_id INTEGER,
      has_detail INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS issue_custom_fields (
      issue_id INTEGER NOT NULL,
      field_id INTEGER NOT NULL,
      field_name TEXT,
      field_value TEXT,
      PRIMARY KEY (issue_id, field_id)
    );

    CREATE TABLE IF NOT EXISTS journals (
      id INTEGER PRIMARY KEY,
      issue_id INTEGER NOT NULL,
      user_id INTEGER,
      user_name TEXT,
      notes TEXT,
      created_on TEXT,
      details_json TEXT
    );

    CREATE TABLE IF NOT EXISTS attachments (
      id INTEGER PRIMARY KEY,
      issue_id INTEGER NOT NULL,
      filename TEXT,
      filesize INTEGER,
      content_type TEXT,
      content_url TEXT,
      description TEXT,
      author_name TEXT,
      created_on TEXT,
      local_path TEXT,
      cached_at TEXT
    );

    CREATE TABLE IF NOT EXISTS issue_relations (
      issue_id INTEGER NOT NULL,
      id INTEGER NOT NULL,
      relation_type TEXT,
      related_issue_id INTEGER,
      related_subject TEXT,
      related_status TEXT,
      PRIMARY KEY (issue_id, id)
    );

    CREATE TABLE IF NOT EXISTS issue_children (
      issue_id INTEGER NOT NULL,
      child_id INTEGER NOT NULL,
      child_subject TEXT,
      child_status TEXT,
      PRIMARY KEY (issue_id, child_id)
    );

    CREATE TABLE IF NOT EXISTS issue_watchers (
      issue_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      user_name TEXT,
      PRIMARY KEY (issue_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS time_entries (
      id INTEGER PRIMARY KEY,
      issue_id INTEGER,
      project_id INTEGER,
      project_name TEXT,
      user_id INTEGER,
      user_name TEXT,
      hours REAL,
      spent_on TEXT,
      comments TEXT,
      activity_name TEXT,
      created_on TEXT,
      updated_on TEXT
    );

    CREATE TABLE IF NOT EXISTS offline_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      attempts INTEGER NOT NULL DEFAULT 0,
      last_error TEXT
    );

    CREATE TABLE IF NOT EXISTS watched_issues (
      issue_id INTEGER PRIMARY KEY
    );

    CREATE TABLE IF NOT EXISTS pushed_deadline_alerts (
      issue_id INTEGER NOT NULL,
      urgency TEXT NOT NULL,
      pushed_at TEXT NOT NULL,
      PRIMARY KEY (issue_id, urgency)
    );

    CREATE TABLE IF NOT EXISTS sync_failures (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_label TEXT,
      message TEXT NOT NULL,
      read_at TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_issues_project ON issues(project_id);
    CREATE INDEX IF NOT EXISTS idx_issues_updated ON issues(updated_on DESC);
    CREATE INDEX IF NOT EXISTS idx_issues_assignee ON issues(assigned_to_id);
    CREATE INDEX IF NOT EXISTS idx_issues_status ON issues(status_id);
    CREATE INDEX IF NOT EXISTS idx_journals_issue ON journals(issue_id);
    CREATE INDEX IF NOT EXISTS idx_time_entries_spent ON time_entries(spent_on DESC);
  `);

  const version = Number(db.prepare("SELECT value FROM app_meta WHERE key = 'schema_version'").get()?.value || 0);
  if (version < 2) {
    db.exec(`
      CREATE TABLE IF NOT EXISTS issue_relations_v2 (
        issue_id INTEGER NOT NULL,
        id INTEGER NOT NULL,
        relation_type TEXT,
        related_issue_id INTEGER,
        related_subject TEXT,
        related_status TEXT,
        PRIMARY KEY (issue_id, id)
      );
      INSERT OR IGNORE INTO issue_relations_v2 (issue_id, id, relation_type, related_issue_id, related_subject, related_status)
      SELECT issue_id, id, relation_type, related_issue_id, related_subject, related_status FROM issue_relations;
      DROP TABLE IF EXISTS issue_relations;
      ALTER TABLE issue_relations_v2 RENAME TO issue_relations;
    `);
  }
  if (version < 3) {
    db.exec(`
      CREATE TABLE IF NOT EXISTS watched_issues (
        issue_id INTEGER PRIMARY KEY
      );
      CREATE TABLE IF NOT EXISTS pushed_deadline_alerts (
        issue_id INTEGER NOT NULL,
        urgency TEXT NOT NULL,
        pushed_at TEXT NOT NULL,
        PRIMARY KEY (issue_id, urgency)
      );
    `);
  }
  if (version < 4) {
    db.exec(`
      ALTER TABLE time_entries ADD COLUMN activity_id INTEGER;
      ALTER TABLE time_entries ADD COLUMN sync_status TEXT NOT NULL DEFAULT 'synced';
      ALTER TABLE time_entries ADD COLUMN sync_error TEXT;
      CREATE INDEX IF NOT EXISTS idx_time_entries_sync_status ON time_entries(sync_status);
    `);
  }
  if (version < 5) {
    db.exec(`
      CREATE TABLE IF NOT EXISTS sync_failures (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        entity_label TEXT,
        message TEXT NOT NULL,
        read_at TEXT
      );
    `);
  }
  if (version < 6) {
    db.exec(`ALTER TABLE time_entries ADD COLUMN customer_name TEXT;`);
  }
  if (version < 7) {
    db.exec(`
      ALTER TABLE issues ADD COLUMN allowed_statuses_json TEXT;
      ALTER TABLE issues ADD COLUMN allowed_statuses_fetched_at TEXT;
    `);
  }
  if (version < 8) {
    db.exec(`
      ALTER TABLE time_entries ADD COLUMN started_at TEXT;
      ALTER TABLE time_entries ADD COLUMN ended_at TEXT;
      ALTER TABLE time_entries ADD COLUMN entry_kind TEXT NOT NULL DEFAULT 'work';
      ALTER TABLE time_entries ADD COLUMN entry_source TEXT NOT NULL DEFAULT 'manual';

      CREATE TABLE IF NOT EXISTS active_timer (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        issue_id INTEGER,
        project_id INTEGER,
        activity_id INTEGER,
        entry_kind TEXT NOT NULL DEFAULT 'work',
        started_at TEXT NOT NULL,
        accumulated_seconds INTEGER NOT NULL DEFAULT 0,
        is_paused INTEGER NOT NULL DEFAULT 0,
        comment_draft TEXT,
        customer_name TEXT
      );
    `);
  }
  if (version < 9) {
    db.exec(`
      ALTER TABLE time_entries ADD COLUMN is_running INTEGER NOT NULL DEFAULT 0;
    `);
  }
  if (version < 10) {
    db.exec(`
      CREATE TABLE IF NOT EXISTS activity_feed (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        issue_id INTEGER NOT NULL,
        journal_id INTEGER,
        kind TEXT NOT NULL,
        actor_name TEXT,
        actor_id INTEGER,
        issue_subject TEXT,
        project_name TEXT,
        summary TEXT NOT NULL,
        detail_text TEXT,
        created_on TEXT NOT NULL,
        seen_at TEXT
      );
      CREATE UNIQUE INDEX IF NOT EXISTS idx_activity_feed_journal_kind
        ON activity_feed(journal_id, kind)
        WHERE journal_id IS NOT NULL;
      CREATE UNIQUE INDEX IF NOT EXISTS idx_activity_feed_assigned_issue
        ON activity_feed(issue_id)
        WHERE kind = 'assigned' AND journal_id IS NULL;
      CREATE INDEX IF NOT EXISTS idx_activity_feed_created ON activity_feed(created_on DESC);
      CREATE INDEX IF NOT EXISTS idx_activity_feed_unseen ON activity_feed(seen_at);
    `);
  }
  if (version < 11) {
    try {
      db.exec(`ALTER TABLE attachments ADD COLUMN local_path TEXT`);
    } catch {
      /* column may exist */
    }
    try {
      db.exec(`ALTER TABLE attachments ADD COLUMN cached_at TEXT`);
    } catch {
      /* column may exist */
    }
    db.exec(`
      CREATE VIRTUAL TABLE IF NOT EXISTS issues_fts USING fts5(
        issue_id UNINDEXED,
        subject,
        description,
        journal_notes,
        te_comments,
        tokenize = 'unicode61'
      );
    `);
  }
  if (version < SCHEMA_VERSION) {
    db.prepare("INSERT OR REPLACE INTO app_meta (key, value) VALUES ('schema_version', ?)").run(String(SCHEMA_VERSION));
  }
}

function openDatabase(dbPath) {
  if (dbInstance) return dbInstance;
  if (!dbPath) {
    throw new Error("openDatabase(dbPath): путь к базе обязателен");
  }
  if (dbPath !== ":memory:") {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  }
  dbInstance = new Database(dbPath);
  dbInstance.pragma("journal_mode = WAL");
  dbInstance.pragma("synchronous = FULL");
  dbInstance.pragma("foreign_keys = ON");
  runMigrations(dbInstance);
  return dbInstance;
}

function getDb() {
  return dbInstance;
}

function closeDatabase() {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}

function getMeta(key, defaultValue = null) {
  const row = dbInstance.prepare("SELECT value FROM app_meta WHERE key = ?").get(key);
  return row ? row.value : defaultValue;
}

function setMeta(key, value) {
  dbInstance.prepare("INSERT OR REPLACE INTO app_meta (key, value) VALUES (?, ?)").run(key, String(value));
}

function saveReferenceData(type, data) {
  dbInstance
    .prepare("INSERT OR REPLACE INTO reference_data (type, data_json, updated_at) VALUES (?, ?, ?)")
    .run(type, JSON.stringify(data), new Date().toISOString());
}

function getReferenceData(type) {
  const row = dbInstance.prepare("SELECT data_json FROM reference_data WHERE type = ?").get(type);
  if (!row) return null;
  try {
    return JSON.parse(row.data_json);
  } catch {
    return null;
  }
}

function getAllReferenceData() {
  const rows = dbInstance.prepare("SELECT type, data_json FROM reference_data").all();
  const result = {};
  rows.forEach((row) => {
    try {
      result[row.type] = JSON.parse(row.data_json);
    } catch {
      result[row.type] = null;
    }
  });
  return result;
}

function setSyncProjects(projects) {
  const tx = dbInstance.transaction((items) => {
    dbInstance.prepare("DELETE FROM sync_projects").run();
    const stmt = dbInstance.prepare(
      "INSERT INTO sync_projects (project_id, project_name, enabled, last_sync_at, issue_count) VALUES (?, ?, ?, ?, ?)",
    );
    items.forEach((p) => {
      stmt.run(p.project_id, p.project_name, p.enabled ? 1 : 0, p.last_sync_at || null, p.issue_count || 0);
    });
  });
  tx(projects);
}

function getSyncProjects() {
  return dbInstance.prepare("SELECT * FROM sync_projects ORDER BY project_name").all();
}

function getEnabledSyncProjectIds() {
  return dbInstance
    .prepare("SELECT project_id FROM sync_projects WHERE enabled = 1")
    .all()
    .map((row) => Number(row.project_id))
    .filter((id) => Number.isFinite(id) && id > 0);
}

function updateSyncProjectState(projectId, { lastSyncAt, issueCount }) {
  dbInstance
    .prepare("UPDATE sync_projects SET last_sync_at = ?, issue_count = ? WHERE project_id = ?")
    .run(lastSyncAt || null, issueCount ?? 0, projectId);
}

/** Apply fields from a Redmine PUT payload to the local issues summary row. */
function applyIssueUpdatePatch(issueId, issueData = {}) {
  const id = Number(issueId);
  if (!Number.isFinite(id) || !issueData || typeof issueData !== "object") return false;

  const row = dbInstance.prepare("SELECT id FROM issues WHERE id = ?").get(id);
  if (!row) return false;

  const sets = [];
  const params = { id };
  const statuses = getReferenceData("issue_statuses") || [];
  const users = getReferenceData("users") || [];
  const priorities = getReferenceData("priorities") || [];

  const findById = (list, value) =>
    (list || []).find((item) => Number(item?.id) === Number(value)) || null;

  if (issueData.status_id !== undefined && issueData.status_id !== "") {
    const status = findById(statuses, issueData.status_id);
    sets.push("status_id = @status_id", "status_name = @status_name", "status_is_closed = @status_is_closed");
    params.status_id = Number(issueData.status_id);
    params.status_name = status?.name || String(issueData.status_id);
    params.status_is_closed = status?.is_closed ? 1 : 0;
    const current = dbInstance.prepare("SELECT status_id FROM issues WHERE id = ?").get(id);
    if (Number(current?.status_id) !== Number(issueData.status_id)) {
      sets.push("allowed_statuses_json = NULL", "allowed_statuses_fetched_at = NULL");
    }
  }

  if (Object.prototype.hasOwnProperty.call(issueData, "due_date")) {
    sets.push("due_date = @due_date");
    params.due_date = issueData.due_date || null;
  }

  if (Object.prototype.hasOwnProperty.call(issueData, "start_date")) {
    sets.push("start_date = @start_date");
    params.start_date = issueData.start_date || null;
  }

  if (issueData.subject !== undefined) {
    sets.push("subject = @subject");
    params.subject = String(issueData.subject || "");
  }

  if (issueData.description !== undefined) {
    sets.push("description = @description");
    params.description = String(issueData.description || "");
  }

  if (issueData.assigned_to_id !== undefined && issueData.assigned_to_id !== "") {
    const user = findById(users, issueData.assigned_to_id);
    const name =
      user?.name ||
      [user?.firstname, user?.lastname].filter(Boolean).join(" ").trim() ||
      String(issueData.assigned_to_id);
    sets.push("assigned_to_id = @assigned_to_id", "assigned_to_name = @assigned_to_name");
    params.assigned_to_id = Number(issueData.assigned_to_id);
    params.assigned_to_name = name;
  }

  if (issueData.priority_id !== undefined && issueData.priority_id !== "") {
    const priority = findById(priorities, issueData.priority_id);
    sets.push("priority_id = @priority_id", "priority_name = @priority_name");
    params.priority_id = Number(issueData.priority_id);
    params.priority_name = priority?.name || String(issueData.priority_id);
  }

  if (issueData.done_ratio !== undefined && issueData.done_ratio !== "") {
    sets.push("done_ratio = @done_ratio");
    params.done_ratio = Number(issueData.done_ratio);
  }

  if (issueData.estimated_hours !== undefined && issueData.estimated_hours !== "") {
    sets.push("estimated_hours = @estimated_hours");
    params.estimated_hours = Number(issueData.estimated_hours);
  }

  if (Array.isArray(issueData.watcher_user_ids)) {
    dbInstance.prepare("DELETE FROM issue_watchers WHERE issue_id = ?").run(id);
    const watcherStmt = dbInstance.prepare(
      "INSERT INTO issue_watchers (issue_id, user_id, user_name) VALUES (?, ?, ?)",
    );
    issueData.watcher_user_ids.forEach((rawId) => {
      const userId = Number(rawId);
      if (!Number.isFinite(userId) || userId <= 0) return;
      const user = findById(users, userId);
      const name =
        user?.name ||
        [user?.firstname, user?.lastname].filter(Boolean).join(" ").trim() ||
        `Пользователь #${userId}`;
      watcherStmt.run(id, userId, name);
    });
  }

  if (!sets.length && !Array.isArray(issueData.watcher_user_ids)) return false;

  sets.push("updated_on = @updated_on");
  params.updated_on = new Date().toISOString();

  dbInstance.prepare(`UPDATE issues SET ${sets.join(", ")} WHERE id = @id`).run(params);
  return true;
}

function resolveEstimatedHours(issue) {
  if (issue.estimated_hours !== null && issue.estimated_hours !== undefined && issue.estimated_hours !== "") {
    return issue.estimated_hours;
  }
  const cf = (issue.custom_fields || []).find((f) => Number(f.id) === 5);
  if (cf && cf.value !== undefined && cf.value !== null && cf.value !== "") {
    const num = Number(cf.value);
    return Number.isFinite(num) ? num : null;
  }
  return null;
}

function upsertIssueSummary(issue, statusMap = {}) {
  const protectedIssue = preservePendingIssueFields(issue);
  const status = protectedIssue.status || {};
  const statusMeta = statusMap[status.id] || {};
  dbInstance
    .prepare(
      `INSERT INTO issues (
        id, project_id, project_name, tracker_id, tracker_name,
        status_id, status_name, status_is_closed,
        priority_id, priority_name, author_id, author_name,
        assigned_to_id, assigned_to_name, subject, description,
        start_date, due_date, done_ratio, estimated_hours, spent_hours,
        created_on, updated_on, is_private, parent_id, has_detail
      ) VALUES (
        @id, @project_id, @project_name, @tracker_id, @tracker_name,
        @status_id, @status_name, @status_is_closed,
        @priority_id, @priority_name, @author_id, @author_name,
        @assigned_to_id, @assigned_to_name, @subject, @description,
        @start_date, @due_date, @done_ratio, @estimated_hours, @spent_hours,
        @created_on, @updated_on, @is_private, @parent_id, @has_detail
      )
      ON CONFLICT(id) DO UPDATE SET
        project_id = excluded.project_id,
        project_name = excluded.project_name,
        tracker_id = excluded.tracker_id,
        tracker_name = excluded.tracker_name,
        status_id = excluded.status_id,
        status_name = excluded.status_name,
        status_is_closed = excluded.status_is_closed,
        priority_id = excluded.priority_id,
        priority_name = excluded.priority_name,
        author_id = excluded.author_id,
        author_name = excluded.author_name,
        assigned_to_id = excluded.assigned_to_id,
        assigned_to_name = excluded.assigned_to_name,
        subject = excluded.subject,
        description = COALESCE(excluded.description, issues.description),
        start_date = excluded.start_date,
        due_date = excluded.due_date,
        done_ratio = excluded.done_ratio,
        estimated_hours = excluded.estimated_hours,
        spent_hours = excluded.spent_hours,
        created_on = excluded.created_on,
        updated_on = excluded.updated_on,
        is_private = excluded.is_private,
        parent_id = excluded.parent_id,
        has_detail = CASE WHEN excluded.has_detail = 1 THEN 1 ELSE issues.has_detail END,
        allowed_statuses_json = CASE WHEN excluded.status_id IS issues.status_id THEN issues.allowed_statuses_json ELSE NULL END,
        allowed_statuses_fetched_at = CASE WHEN excluded.status_id IS issues.status_id THEN issues.allowed_statuses_fetched_at ELSE NULL END`,
    )
    .run({
      id: protectedIssue.id,
      project_id: protectedIssue.project?.id || null,
      project_name: protectedIssue.project?.name || "",
      tracker_id: protectedIssue.tracker?.id || null,
      tracker_name: protectedIssue.tracker?.name || "",
      status_id: status.id || null,
      status_name: status.name || "",
      status_is_closed: statusMeta.is_closed ? 1 : status.is_closed ? 1 : 0,
      priority_id: protectedIssue.priority?.id || null,
      priority_name: protectedIssue.priority?.name || "",
      author_id: protectedIssue.author?.id || null,
      author_name: protectedIssue.author?.name || "",
      assigned_to_id: protectedIssue.assigned_to?.id || null,
      assigned_to_name: protectedIssue.assigned_to?.name || "",
      subject: protectedIssue.subject || "",
      description: protectedIssue.description || "",
      start_date: protectedIssue.start_date || null,
      due_date: protectedIssue.due_date || null,
      done_ratio: protectedIssue.done_ratio ?? 0,
      estimated_hours: resolveEstimatedHours(protectedIssue),
      spent_hours: protectedIssue.spent_hours ?? null,
      created_on: protectedIssue.created_on || null,
      updated_on: protectedIssue.updated_on || null,
      is_private: protectedIssue.is_private ? 1 : 0,
      parent_id: protectedIssue.parent?.id || null,
      has_detail: protectedIssue.has_detail ? 1 : 0,
    });
}

/** Field keys from pending offline update_issue payloads for this issue (excludes notes). */
function getPendingIssueUpdateFieldKeys(issueId) {
  const id = Number(issueId);
  const keys = new Set();
  if (!Number.isFinite(id) || !dbInstance) return keys;
  const items = getOfflineQueue();
  for (const item of items) {
    if (item.type !== "update_issue") continue;
    let payload;
    try {
      payload = JSON.parse(item.payload_json);
    } catch {
      continue;
    }
    if (Number(payload?.issueId) !== id) continue;
    const merged = { ...(payload.issueData || {}), ...(payload.localIssueData || {}) };
    Object.keys(merged).forEach((key) => {
      if (key === "notes" || key === "uploads") return;
      keys.add(key);
    });
  }
  return keys;
}

function preservePendingIssueFields(issue) {
  if (!issue?.id) return issue;
  const pendingKeys = getPendingIssueUpdateFieldKeys(issue.id);
  if (!pendingKeys.size) return issue;

  const existing = dbInstance.prepare("SELECT * FROM issues WHERE id = ?").get(issue.id);
  if (!existing) return issue;

  const merged = { ...issue };
  if (pendingKeys.has("description")) merged.description = existing.description;
  if (pendingKeys.has("subject")) merged.subject = existing.subject;
  if (pendingKeys.has("due_date")) merged.due_date = existing.due_date;
  if (pendingKeys.has("start_date")) merged.start_date = existing.start_date;
  if (pendingKeys.has("done_ratio")) merged.done_ratio = existing.done_ratio;
  if (pendingKeys.has("estimated_hours")) merged.estimated_hours = existing.estimated_hours;
  if (pendingKeys.has("status_id")) {
    merged.status = {
      ...(merged.status || {}),
      id: existing.status_id,
      name: existing.status_name,
      is_closed: Boolean(existing.status_is_closed),
    };
  }
  if (pendingKeys.has("priority_id")) {
    merged.priority = {
      ...(merged.priority || {}),
      id: existing.priority_id,
      name: existing.priority_name,
    };
  }
  if (pendingKeys.has("assigned_to_id")) {
    merged.assigned_to = existing.assigned_to_id
      ? { id: existing.assigned_to_id, name: existing.assigned_to_name }
      : undefined;
  }
  return merged;
}

function saveIssueDetail(issue, statusMap = {}) {
  upsertIssueSummary({ ...preservePendingIssueFields(issue), has_detail: 1 }, statusMap);

  const issueId = issue.id;

  dbInstance.prepare("DELETE FROM issue_custom_fields WHERE issue_id = ?").run(issueId);
  const cfStmt = dbInstance.prepare(
    "INSERT INTO issue_custom_fields (issue_id, field_id, field_name, field_value) VALUES (?, ?, ?, ?)",
  );
  (issue.custom_fields || []).forEach((field) => {
    const value = Array.isArray(field.value) ? field.value.join(", ") : String(field.value || "");
    cfStmt.run(issueId, field.id, field.name || "", value);
  });

  dbInstance.prepare("DELETE FROM journals WHERE issue_id = ?").run(issueId);
  const journalStmt = dbInstance.prepare(
    "INSERT INTO journals (id, issue_id, user_id, user_name, notes, created_on, details_json) VALUES (?, ?, ?, ?, ?, ?, ?)",
  );
  (issue.journals || []).forEach((journal) => {
    journalStmt.run(
      journal.id,
      issueId,
      journal.user?.id || null,
      journal.user?.name || "",
      journal.notes || "",
      journal.created_on || null,
      JSON.stringify(journal.details || []),
    );
  });

  const existingAttachmentPaths = new Map(
    dbInstance
      .prepare("SELECT id, local_path, cached_at FROM attachments WHERE issue_id = ?")
      .all(issueId)
      .filter((row) => row.local_path)
      .map((row) => [Number(row.id), { local_path: row.local_path, cached_at: row.cached_at }]),
  );

  dbInstance.prepare("DELETE FROM attachments WHERE issue_id = ?").run(issueId);
  const attStmt = dbInstance.prepare(
    "INSERT INTO attachments (id, issue_id, filename, filesize, content_type, content_url, description, author_name, created_on, local_path, cached_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
  );
  (issue.attachments || []).forEach((att) => {
    const prev = existingAttachmentPaths.get(Number(att.id));
    attStmt.run(
      att.id,
      issueId,
      att.filename || "",
      att.filesize || 0,
      att.content_type || "",
      att.content_url || "",
      att.description || "",
      att.author?.name || "",
      att.created_on || null,
      prev?.local_path || null,
      prev?.cached_at || null,
    );
  });

  rebuildIssueFtsEntry(issueId);

  dbInstance.prepare("DELETE FROM issue_children WHERE issue_id = ?").run(issueId);
  const childStmt = dbInstance.prepare(
    "INSERT INTO issue_children (issue_id, child_id, child_subject, child_status) VALUES (?, ?, ?, ?)",
  );
  (issue.children || []).forEach((child) => {
    childStmt.run(issueId, child.id, child.subject || "", child.status?.name || child.status || "");
  });

  dbInstance.prepare("DELETE FROM issue_relations WHERE issue_id = ?").run(issueId);
  const relStmt = dbInstance.prepare(
    "INSERT INTO issue_relations (id, issue_id, relation_type, related_issue_id, related_subject, related_status) VALUES (?, ?, ?, ?, ?, ?)",
  );
  (issue.relations || []).forEach((rel) => {
    const otherId = Number(rel.issue_id) === Number(issueId) ? rel.issue_to_id : rel.issue_id;
    let otherSubject = "";
    let otherStatus = "";
    if (otherId) {
      const otherRow = dbInstance.prepare("SELECT subject, status_name FROM issues WHERE id = ?").get(otherId);
      if (otherRow) {
        otherSubject = otherRow.subject || "";
        otherStatus = otherRow.status_name || "";
      }
    }
    relStmt.run(rel.id, issueId, rel.relation_type || "", otherId || null, otherSubject, otherStatus);
  });

  dbInstance.prepare("DELETE FROM issue_watchers WHERE issue_id = ?").run(issueId);
  const watcherStmt = dbInstance.prepare(
    "INSERT INTO issue_watchers (issue_id, user_id, user_name) VALUES (?, ?, ?)",
  );
  (issue.watchers || []).forEach((watcher) => {
    watcherStmt.run(issueId, watcher.id, watcher.name || "");
  });

  if (Object.prototype.hasOwnProperty.call(issue, "allowed_statuses")) {
    saveAllowedStatuses(issueId, issue.allowed_statuses, { unsupported: false });
  }
}

const ALLOWED_STATUSES_UNSUPPORTED = "__unsupported__";

function parseStoredAllowedStatuses(raw) {
  if (raw === ALLOWED_STATUSES_UNSUPPORTED) {
    return { statuses: null, unsupported: true, fetched: true };
  }
  if (raw == null || raw === "") {
    return { statuses: null, unsupported: false, fetched: false };
  }
  try {
    const parsed = JSON.parse(raw);
    return {
      statuses: Array.isArray(parsed) ? parsed : [],
      unsupported: false,
      fetched: true,
    };
  } catch {
    return { statuses: null, unsupported: false, fetched: false };
  }
}

function saveAllowedStatuses(issueId, statuses, { unsupported = false } = {}) {
  const id = Number(issueId);
  if (!Number.isFinite(id)) return;
  const json = unsupported
    ? ALLOWED_STATUSES_UNSUPPORTED
    : JSON.stringify(
        (Array.isArray(statuses) ? statuses : []).map((status) => ({
          id: Number(status.id),
          name: status.name || "",
          is_closed: Boolean(status.is_closed),
        })),
      );
  dbInstance
    .prepare(
      "UPDATE issues SET allowed_statuses_json = ?, allowed_statuses_fetched_at = ? WHERE id = ?",
    )
    .run(json, new Date().toISOString(), id);
}

function queryIssues(filters = {}) {
  const clauses = ["1=1"];
  const params = {};
  const scope = filters.scope || "all";
  const favoritesBare = Boolean(filters.favoritesBare) && scope === "favorites";

  if (filters.projectId && filters.projectId !== "all" && !(scope === "favorites" && favoritesBare)) {
    clauses.push("project_id = @projectId");
    params.projectId = Number(filters.projectId);
  } else if (filters.restrictToEnabledProjects !== false && !(scope === "favorites" && favoritesBare)) {
    // «Все проекты» = все ВКЛЮЧЁННЫЕ в синк, а не любой проект из кэша
    // (watched/detail могли подтянуть задачи из отключённых проектов).
    const enabledIds = getEnabledSyncProjectIds();
    if (enabledIds.length) {
      const placeholders = enabledIds.map((_, i) => `@enabledProject${i}`).join(", ");
      clauses.push(`project_id IN (${placeholders})`);
      enabledIds.forEach((id, i) => {
        params[`enabledProject${i}`] = id;
      });
    }
  }

  if (!favoritesBare && filters.assigneeId && filters.assigneeId !== "all") {
    // Scope «mine» already forces assigned_to = current user — ignore conflicting assignee filter.
    if (filters.scope !== "mine") {
      if (filters.assigneeId === "me" && filters.currentUserId) {
        clauses.push("assigned_to_id = @assigneeId");
        params.assigneeId = Number(filters.currentUserId);
      } else if (filters.assigneeId !== "me") {
        clauses.push("assigned_to_id = @assigneeId");
        params.assigneeId = Number(filters.assigneeId);
      }
    }
  }

  if (!favoritesBare && filters.authorId && filters.authorId !== "all") {
    // Scope «authored» already forces author = current user — ignore conflicting author filter.
    if (filters.scope !== "authored") {
      clauses.push("author_id = @authorId");
      params.authorId = Number(filters.authorId);
    }
  }

  if (!favoritesBare && Array.isArray(filters.authorIds) && filters.authorIds.length) {
    if (filters.scope !== "authored") {
      const ids = filters.authorIds.map(Number).filter((id) => Number.isFinite(id) && id > 0);
      if (ids.length) {
        const placeholders = ids.map((_, i) => `@authorIds${i}`).join(", ");
        clauses.push(`author_id IN (${placeholders})`);
        ids.forEach((id, i) => {
          params[`authorIds${i}`] = id;
        });
      }
    }
  }

  if (scope === "mine" && filters.currentUserId) {
    clauses.push("assigned_to_id = @scopeUserId");
    params.scopeUserId = Number(filters.currentUserId);
  } else if (scope === "authored" && filters.currentUserId) {
    clauses.push("author_id = @scopeUserId");
    params.scopeUserId = Number(filters.currentUserId);
  } else if (scope === "watched") {
    clauses.push("id IN (SELECT issue_id FROM watched_issues)");
  } else if (scope === "favorites") {
    const favoriteIds = Array.isArray(filters.favoriteIds)
      ? filters.favoriteIds.map(Number).filter((id) => Number.isFinite(id) && id > 0)
      : [];
    if (!favoriteIds.length) {
      clauses.push("0 = 1");
    } else {
      const placeholders = favoriteIds.map((_, i) => `@favoriteIds${i}`).join(", ");
      clauses.push(`id IN (${placeholders})`);
      favoriteIds.forEach((id, i) => {
        params[`favoriteIds${i}`] = id;
      });
    }
  }

  if (!favoritesBare && Array.isArray(filters.statusIds) && filters.statusIds.length) {
    const ids = filters.statusIds.map(Number).filter((id) => Number.isFinite(id) && id > 0);
    if (ids.length) {
      const placeholders = ids.map((_, i) => `@statusIds${i}`).join(", ");
      clauses.push(`status_id IN (${placeholders})`);
      ids.forEach((id, i) => {
        params[`statusIds${i}`] = id;
      });
    }
  } else if (!favoritesBare && filters.statusId && filters.statusId !== "all") {
    clauses.push("status_id = @statusId");
    params.statusId = Number(filters.statusId);
  } else if (!favoritesBare && filters.openOnly) {
    clauses.push("status_is_closed = 0");
  } else if (!favoritesBare && filters.openStatusIds && filters.openStatusIds.length) {
    const placeholders = filters.openStatusIds.map((id, i) => `@openStatus${i}`).join(", ");
    clauses.push(`status_id IN (${placeholders})`);
    filters.openStatusIds.forEach((id, i) => {
      params[`openStatus${i}`] = Number(id);
    });
  }

  if (!favoritesBare && Array.isArray(filters.priorityIds) && filters.priorityIds.length) {
    const ids = filters.priorityIds.map(Number).filter((id) => Number.isFinite(id) && id > 0);
    if (ids.length) {
      const placeholders = ids.map((_, i) => `@priorityIds${i}`).join(", ");
      clauses.push(`priority_id IN (${placeholders})`);
      ids.forEach((id, i) => {
        params[`priorityIds${i}`] = id;
      });
    }
  }

  if (!favoritesBare && filters.searchQuery) {
    const raw = String(filters.searchQuery).trim();
    const upperFirst = raw ? raw.charAt(0).toUpperCase() + raw.slice(1) : raw;
    const lowerFirst = raw ? raw.charAt(0).toLowerCase() + raw.slice(1) : raw;
    if (filters.searchDeep) {
      try {
        const ftsHits = dbInstance
          .prepare(
            `SELECT issue_id AS id FROM issues_fts WHERE issues_fts MATCH @ftsQuery LIMIT 500`,
          )
          .all({ ftsQuery: buildFtsQuery(raw) })
          .map((row) => Number(row.id))
          .filter((id) => Number.isFinite(id));
        if (ftsHits.length) {
          const placeholders = ftsHits.map((_, i) => `@ftsId${i}`).join(", ");
          clauses.push(
            `(CAST(id AS TEXT) LIKE @searchRaw OR subject LIKE @searchRaw OR subject LIKE @searchUpper OR subject LIKE @searchLower OR project_name LIKE @searchRaw OR project_name LIKE @searchUpper OR project_name LIKE @searchLower OR author_name LIKE @searchRaw OR author_name LIKE @searchUpper OR author_name LIKE @searchLower OR assigned_to_name LIKE @searchRaw OR assigned_to_name LIKE @searchUpper OR assigned_to_name LIKE @searchLower OR id IN (${placeholders}))`,
          );
          ftsHits.forEach((id, i) => {
            params[`ftsId${i}`] = id;
          });
        } else {
          clauses.push(
            "(CAST(id AS TEXT) LIKE @searchRaw OR subject LIKE @searchRaw OR subject LIKE @searchUpper OR subject LIKE @searchLower OR project_name LIKE @searchRaw OR project_name LIKE @searchUpper OR project_name LIKE @searchLower OR author_name LIKE @searchRaw OR author_name LIKE @searchUpper OR author_name LIKE @searchLower OR assigned_to_name LIKE @searchRaw OR assigned_to_name LIKE @searchUpper OR assigned_to_name LIKE @searchLower OR IFNULL(description,'') LIKE @searchRaw OR id IN (SELECT issue_id FROM journals WHERE IFNULL(notes,'') LIKE @searchRaw) OR id IN (SELECT issue_id FROM time_entries WHERE IFNULL(comments,'') LIKE @searchRaw))",
          );
        }
      } catch {
        clauses.push(
          "(CAST(id AS TEXT) LIKE @searchRaw OR subject LIKE @searchRaw OR subject LIKE @searchUpper OR subject LIKE @searchLower OR project_name LIKE @searchRaw OR project_name LIKE @searchUpper OR project_name LIKE @searchLower OR author_name LIKE @searchRaw OR author_name LIKE @searchUpper OR author_name LIKE @searchLower OR assigned_to_name LIKE @searchRaw OR assigned_to_name LIKE @searchUpper OR assigned_to_name LIKE @searchLower OR IFNULL(description,'') LIKE @searchRaw OR id IN (SELECT issue_id FROM journals WHERE IFNULL(notes,'') LIKE @searchRaw) OR id IN (SELECT issue_id FROM time_entries WHERE IFNULL(comments,'') LIKE @searchRaw))",
        );
      }
    } else {
      clauses.push(
        "(CAST(id AS TEXT) LIKE @searchRaw OR subject LIKE @searchRaw OR subject LIKE @searchUpper OR subject LIKE @searchLower OR project_name LIKE @searchRaw OR project_name LIKE @searchUpper OR project_name LIKE @searchLower OR author_name LIKE @searchRaw OR author_name LIKE @searchUpper OR author_name LIKE @searchLower OR assigned_to_name LIKE @searchRaw OR assigned_to_name LIKE @searchUpper OR assigned_to_name LIKE @searchLower)",
      );
    }
    params.searchRaw = `%${raw}%`;
    params.searchUpper = `%${upperFirst}%`;
    params.searchLower = `%${lowerFirst}%`;
  }

  if (!favoritesBare && filters.dueEmptyOnly) {
    clauses.push("(due_date IS NULL OR TRIM(due_date) = '')");
  } else if (!favoritesBare) {
    if (filters.dueFrom) {
      clauses.push("due_date IS NOT NULL AND TRIM(due_date) != '' AND due_date >= @dueFrom");
      params.dueFrom = String(filters.dueFrom);
    }
    if (filters.dueTo) {
      clauses.push("due_date IS NOT NULL AND TRIM(due_date) != '' AND due_date <= @dueTo");
      params.dueTo = String(filters.dueTo);
    }
  }

  if (!favoritesBare && filters.estimateMode === "has") {
    clauses.push("estimated_hours IS NOT NULL AND estimated_hours > 0");
  } else if (!favoritesBare && filters.estimateMode === "none") {
    clauses.push("(estimated_hours IS NULL OR estimated_hours = 0)");
  }

  const sql = `SELECT * FROM issues WHERE ${clauses.join(" AND ")} ORDER BY updated_on DESC`;
  return dbInstance.prepare(sql).all(params);
}

function replaceWatchedIssues(issueIds) {
  const ids = (issueIds || []).map(Number).filter((id) => Number.isFinite(id));
  const tx = dbInstance.transaction(() => {
    dbInstance.prepare("DELETE FROM watched_issues").run();
    const stmt = dbInstance.prepare("INSERT OR IGNORE INTO watched_issues (issue_id) VALUES (?)");
    ids.forEach((id) => stmt.run(id));
  });
  tx();
}

function getWatchedIssueIds() {
  return dbInstance.prepare("SELECT issue_id FROM watched_issues ORDER BY issue_id").all().map((r) => r.issue_id);
}

function issueExists(issueId) {
  const row = dbInstance.prepare("SELECT 1 AS ok FROM issues WHERE id = ?").get(Number(issueId));
  return Boolean(row);
}

function getJournalIdsForIssue(issueId) {
  return dbInstance
    .prepare("SELECT id FROM journals WHERE issue_id = ?")
    .all(Number(issueId))
    .map((row) => Number(row.id));
}

function ensureActivityFeedWatermark(iso = null) {
  const existing = getMeta("activity_feed_since");
  if (existing) return existing;
  const value = iso || new Date().toISOString();
  setMeta("activity_feed_since", value);
  return value;
}

function resetActivityFeedWatermark(iso = null) {
  const value = iso || new Date().toISOString();
  setMeta("activity_feed_since", value);
  return value;
}

function insertActivityEvent(event) {
  if (!event || !event.kind || !event.issue_id || !event.summary || !event.created_on) return { inserted: false };
  const result = dbInstance
    .prepare(
      `INSERT OR IGNORE INTO activity_feed (
        issue_id, journal_id, kind, actor_name, actor_id,
        issue_subject, project_name, summary, detail_text, created_on, seen_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)`,
    )
    .run(
      Number(event.issue_id),
      event.journal_id != null ? Number(event.journal_id) : null,
      String(event.kind),
      event.actor_name || "",
      event.actor_id != null ? Number(event.actor_id) : null,
      event.issue_subject || "",
      event.project_name || "",
      String(event.summary),
      event.detail_text || "",
      String(event.created_on),
    );
  return { inserted: result.changes > 0, id: result.lastInsertRowid || null };
}

function insertActivityEvents(events) {
  let inserted = 0;
  const tx = dbInstance.transaction((list) => {
    (list || []).forEach((event) => {
      if (insertActivityEvent(event).inserted) inserted += 1;
    });
  });
  tx(events || []);
  return inserted;
}

function queryActivityFeed({ limit = 10, offset = 0, kinds = null } = {}) {
  const lim = Math.max(1, Math.min(200, Number(limit) || 10));
  const off = Math.max(0, Number(offset) || 0);
  const params = [];
  let where = "1=1";
  if (Array.isArray(kinds)) {
    if (!kinds.length) return [];
    where += ` AND kind IN (${kinds.map(() => "?").join(", ")})`;
    params.push(...kinds.map(String));
  }
  params.push(lim, off);
  return dbInstance
    .prepare(
      `SELECT * FROM activity_feed
       WHERE ${where}
       ORDER BY created_on DESC, id DESC
       LIMIT ? OFFSET ?`,
    )
    .all(...params);
}

function countUnseenActivity() {
  return dbInstance.prepare("SELECT COUNT(*) AS cnt FROM activity_feed WHERE seen_at IS NULL").get().cnt;
}

function markActivitySeen({ ids = null, all = false } = {}) {
  const now = new Date().toISOString();
  if (all) {
    return dbInstance.prepare("UPDATE activity_feed SET seen_at = ? WHERE seen_at IS NULL").run(now).changes;
  }
  const list = (ids || []).map(Number).filter((id) => Number.isFinite(id) && id > 0);
  if (!list.length) return 0;
  const placeholders = list.map(() => "?").join(", ");
  return dbInstance
    .prepare(`UPDATE activity_feed SET seen_at = ? WHERE seen_at IS NULL AND id IN (${placeholders})`)
    .run(now, ...list).changes;
}

function pruneActivityFeed({ maxAgeDays = 90, maxRows = 500 } = {}) {
  const days = Math.max(1, Number(maxAgeDays) || 90);
  const cap = Math.max(50, Number(maxRows) || 500);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffIso = cutoff.toISOString();
  let removed = dbInstance.prepare("DELETE FROM activity_feed WHERE created_on < ?").run(cutoffIso).changes;
  const total = dbInstance.prepare("SELECT COUNT(*) AS cnt FROM activity_feed").get().cnt;
  if (total > cap) {
    const overflow = total - cap;
    removed += dbInstance
      .prepare(
        `DELETE FROM activity_feed WHERE id IN (
           SELECT id FROM activity_feed ORDER BY created_on ASC, id ASC LIMIT ?
         )`,
      )
      .run(overflow).changes;
  }
  return removed;
}

function clearActivityFeed() {
  dbInstance.prepare("DELETE FROM activity_feed").run();
}

function isoDateLocal(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDaysToIsoDate(iso, days) {
  const [y, m, d] = String(iso).split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  return isoDateLocal(dt);
}

function getDeadlineAlerts(currentUserId, { today, soonDays = 3 } = {}) {
  const userId = Number(currentUserId);
  if (!userId) return [];
  const todayStr = today || isoDateLocal();
  const days = Math.max(0, Number(soonDays) || 0);
  const soonStr = addDaysToIsoDate(todayStr, days);
  // SQLite LOWER() is ASCII-only; filter resolved/closed names in JS.
  const doneStatusRe = /решен|закрыт|resolved|closed/i;

  const rows = dbInstance
    .prepare(
      `SELECT id, subject, due_date, project_name, status_name
       FROM issues
       WHERE assigned_to_id = ?
         AND status_is_closed = 0
         AND due_date IS NOT NULL AND TRIM(due_date) != ''
         AND due_date <= ?
       ORDER BY due_date ASC, id ASC`,
    )
    .all(userId, soonStr);

  return rows
    .filter((row) => !doneStatusRe.test(row.status_name || ""))
    .map((row) => ({
      issueId: row.id,
      subject: row.subject || "",
      dueDate: row.due_date,
      projectName: row.project_name || "",
      statusName: row.status_name || "",
      urgency: row.due_date < todayStr ? "overdue" : "soon",
    }));
}

function hasBeenPushed(issueId, urgency) {
  const row = dbInstance
    .prepare("SELECT 1 AS ok FROM pushed_deadline_alerts WHERE issue_id = ? AND urgency = ?")
    .get(Number(issueId), String(urgency));
  return Boolean(row);
}

function markPushed(issueId, urgency) {
  dbInstance
    .prepare(
      `INSERT INTO pushed_deadline_alerts (issue_id, urgency, pushed_at)
       VALUES (?, ?, ?)
       ON CONFLICT(issue_id, urgency) DO UPDATE SET pushed_at = excluded.pushed_at`,
    )
    .run(Number(issueId), String(urgency), new Date().toISOString());
}

function queryProjectStatuses(projectId) {
  const pid = Number(projectId);
  if (!pid) return [];
  return dbInstance
    .prepare(
      `SELECT status_id, status_name, MAX(status_is_closed) AS status_is_closed, COUNT(*) AS issue_count
       FROM issues
       WHERE project_id = ?
       GROUP BY status_id
       ORDER BY status_id ASC`,
    )
    .all(pid)
    .map((row) => ({
      id: row.status_id,
      name: row.status_name || "",
      is_closed: Boolean(row.status_is_closed),
      issue_count: row.issue_count,
    }));
}

function getIssueById(issueId) {
  const issue = dbInstance.prepare("SELECT * FROM issues WHERE id = ?").get(issueId);
  if (!issue) return null;
  const parentRow = issue.parent_id
    ? dbInstance.prepare("SELECT id, subject, status_name FROM issues WHERE id = ?").get(issue.parent_id)
    : null;

  const allowed = parseStoredAllowedStatuses(issue.allowed_statuses_json);
  return {
    ...issue,
    allowed_statuses: allowed.statuses,
    allowed_statuses_unsupported: allowed.unsupported,
    parent: parentRow
      ? { id: parentRow.id, subject: parentRow.subject, status: { name: parentRow.status_name } }
      : issue.parent_id
        ? { id: issue.parent_id }
        : null,
    custom_fields: dbInstance.prepare("SELECT * FROM issue_custom_fields WHERE issue_id = ?").all(issueId),
    journals: dbInstance
      .prepare("SELECT * FROM journals WHERE issue_id = ? ORDER BY created_on ASC")
      .all(issueId)
      .map((j) => ({
        id: j.id,
        user: { id: j.user_id, name: j.user_name },
        notes: j.notes,
        created_on: j.created_on,
        details: JSON.parse(j.details_json || "[]"),
      })),
    attachments: dbInstance.prepare("SELECT * FROM attachments WHERE issue_id = ?").all(issueId),
    children: dbInstance
      .prepare(
        `SELECT
           c.child_id,
           c.child_subject,
           c.child_status,
           i.status_name AS issue_status_name,
           i.assigned_to_name AS issue_assigned_to_name,
           i.due_date AS issue_due_date
         FROM issue_children c
         LEFT JOIN issues i ON i.id = c.child_id
         WHERE c.issue_id = ?
         ORDER BY c.child_id ASC`,
      )
      .all(issueId)
      .map((c) => ({
        id: c.child_id,
        subject: c.child_subject,
        status: { name: c.issue_status_name || c.child_status || "" },
        assigned_to: c.issue_assigned_to_name ? { name: c.issue_assigned_to_name } : null,
        due_date: c.issue_due_date || null,
      })),
    relations: dbInstance
      .prepare("SELECT * FROM issue_relations WHERE issue_id = ?")
      .all(issueId)
      .map((r) => ({
        id: r.id,
        relation_type: r.relation_type,
        issue_to: { id: r.related_issue_id, subject: r.related_subject, status: { name: r.related_status } },
      })),
    watchers: dbInstance
      .prepare("SELECT * FROM issue_watchers WHERE issue_id = ?")
      .all(issueId)
      .map((w) => ({ id: w.user_id, name: w.user_name })),
  };
}

function getCacheStats(dbPath) {
  let dbSize = 0;
  try {
    dbSize = fs.statSync(dbPath).size;
  } catch {
    dbSize = 0;
  }
  const issuesCount = dbInstance.prepare("SELECT COUNT(*) AS cnt FROM issues").get().cnt;
  const queueCount = dbInstance.prepare("SELECT COUNT(*) AS cnt FROM offline_queue").get().cnt;
  const attachmentsCached = dbInstance
    .prepare("SELECT COUNT(*) AS cnt FROM attachments WHERE local_path IS NOT NULL AND TRIM(local_path) != ''")
    .get().cnt;
  return { dbSize, issuesCount, queueCount, attachmentsCached };
}

/** Estimate remaining download size to fully cache issue details for enabled sync projects. */
function estimateCacheDownload() {
  if (!dbInstance) {
    return {
      issueCount: 0,
      missingDetailCount: 0,
      haveBytes: 0,
      estimateBytes: 0,
      attachmentBytesMissing: 0,
    };
  }
  const projectIds = getEnabledSyncProjectIds();
  let issueCount = 0;
  let missingDetailCount = 0;
  let haveBytes = 0;
  let attachmentBytesMissing = 0;
  const AVG_DETAIL_BYTES = 12 * 1024;

  if (projectIds.length) {
    const placeholders = projectIds.map(() => "?").join(",");
    const row = dbInstance
      .prepare(
        `SELECT COUNT(*) AS cnt,
                SUM(CASE WHEN has_detail = 1 THEN 0 ELSE 1 END) AS missing,
                SUM(CASE WHEN has_detail = 1 THEN COALESCE(LENGTH(description), 0) ELSE 0 END) AS desc_bytes
         FROM issues WHERE project_id IN (${placeholders})`,
      )
      .get(...projectIds);
    issueCount = Number(row?.cnt) || 0;
    missingDetailCount = Number(row?.missing) || 0;
    haveBytes += Number(row?.desc_bytes) || 0;

    const att = dbInstance
      .prepare(
        `SELECT
           SUM(CASE WHEN a.local_path IS NOT NULL AND TRIM(a.local_path) != '' THEN COALESCE(a.filesize, 0) ELSE 0 END) AS cached_bytes,
           SUM(CASE WHEN a.local_path IS NULL OR TRIM(a.local_path) = '' THEN COALESCE(a.filesize, 0) ELSE 0 END) AS missing_bytes
         FROM attachments a
         INNER JOIN issues i ON i.id = a.issue_id
         WHERE i.project_id IN (${placeholders})`,
      )
      .get(...projectIds);
    haveBytes += Number(att?.cached_bytes) || 0;
    attachmentBytesMissing = Number(att?.missing_bytes) || 0;
  } else {
    const row = dbInstance
      .prepare(
        `SELECT COUNT(*) AS cnt,
                SUM(CASE WHEN has_detail = 1 THEN 0 ELSE 1 END) AS missing,
                SUM(CASE WHEN has_detail = 1 THEN COALESCE(LENGTH(description), 0) ELSE 0 END) AS desc_bytes
         FROM issues`,
      )
      .get();
    issueCount = Number(row?.cnt) || 0;
    missingDetailCount = Number(row?.missing) || 0;
    haveBytes += Number(row?.desc_bytes) || 0;
  }

  const estimateBytes = missingDetailCount * AVG_DETAIL_BYTES + attachmentBytesMissing;
  return {
    issueCount,
    missingDetailCount,
    haveBytes,
    estimateBytes,
    attachmentBytesMissing,
  };
}

function buildFtsQuery(raw) {
  const tokens = String(raw || "")
    .trim()
    .split(/\s+/)
    .map((t) => t.replace(/["']/g, "").trim())
    .filter(Boolean);
  if (!tokens.length) return '""';
  return tokens.map((t) => `"${t}"*`).join(" AND ");
}

function rebuildIssueFtsEntry(issueId) {
  const id = Number(issueId);
  if (!Number.isFinite(id) || !dbInstance) return;
  try {
    dbInstance.prepare("DELETE FROM issues_fts WHERE issue_id = ?").run(id);
  } catch {
    return;
  }
  const issue = dbInstance.prepare("SELECT id, subject, description FROM issues WHERE id = ?").get(id);
  if (!issue) return;
  const journalNotes = dbInstance
    .prepare("SELECT notes FROM journals WHERE issue_id = ?")
    .all(id)
    .map((j) => j.notes || "")
    .join("\n");
  const teComments = dbInstance
    .prepare("SELECT comments FROM time_entries WHERE issue_id = ?")
    .all(id)
    .map((t) => t.comments || "")
    .join("\n");
  dbInstance
    .prepare(
      "INSERT INTO issues_fts (issue_id, subject, description, journal_notes, te_comments) VALUES (?, ?, ?, ?, ?)",
    )
    .run(id, issue.subject || "", issue.description || "", journalNotes, teComments);
}

function rebuildAllIssuesFts() {
  if (!dbInstance) return { ok: false };
  try {
    dbInstance.prepare("DELETE FROM issues_fts").run();
  } catch {
    return { ok: false };
  }
  const ids = dbInstance.prepare("SELECT id FROM issues").all().map((r) => Number(r.id));
  ids.forEach((id) => rebuildIssueFtsEntry(id));
  return { ok: true, count: ids.length };
}

function setAttachmentLocalPath(attachmentId, localPath) {
  const id = Number(attachmentId);
  if (!Number.isFinite(id) || !dbInstance) return;
  dbInstance
    .prepare("UPDATE attachments SET local_path = ?, cached_at = ? WHERE id = ?")
    .run(localPath || null, localPath ? new Date().toISOString() : null, id);
}

function listCachedAttachments() {
  if (!dbInstance) return [];
  return dbInstance
    .prepare(
      "SELECT id, issue_id, filename, filesize, local_path, cached_at FROM attachments WHERE local_path IS NOT NULL AND TRIM(local_path) != ''",
    )
    .all();
}

function getClosedIssueRows() {
  if (!dbInstance) return [];
  return dbInstance
    .prepare("SELECT id, status_is_closed, updated_on FROM issues WHERE status_is_closed = 1")
    .all();
}

function deleteIssuesByIds(issueIds, { preserveIssueIds = [] } = {}) {
  const preserve = new Set((preserveIssueIds || []).map(Number));
  const ids = (issueIds || [])
    .map(Number)
    .filter((id) => Number.isFinite(id) && id > 0 && !preserve.has(id));
  if (!ids.length || !dbInstance) return { deleted: 0 };
  const tx = dbInstance.transaction(() => {
    ids.forEach((id) => {
      dbInstance.prepare("DELETE FROM issue_custom_fields WHERE issue_id = ?").run(id);
      dbInstance.prepare("DELETE FROM journals WHERE issue_id = ?").run(id);
      dbInstance.prepare("DELETE FROM attachments WHERE issue_id = ?").run(id);
      dbInstance.prepare("DELETE FROM issue_relations WHERE issue_id = ?").run(id);
      dbInstance.prepare("DELETE FROM issue_children WHERE issue_id = ?").run(id);
      dbInstance.prepare("DELETE FROM issue_watchers WHERE issue_id = ?").run(id);
      try {
        dbInstance.prepare("DELETE FROM issues_fts WHERE issue_id = ?").run(id);
      } catch {
        /* fts missing */
      }
      dbInstance.prepare("DELETE FROM issues WHERE id = ?").run(id);
    });
  });
  tx();
  return { deleted: ids.length };
}

function clearCacheData() {
  const tables = [
    "issues",
    "issue_custom_fields",
    "journals",
    "attachments",
    "issue_relations",
    "issue_children",
    "issue_watchers",
    "watched_issues",
    "pushed_deadline_alerts",
    "time_entries",
    "sync_projects",
    "reference_data",
    "activity_feed",
  ];
  const tx = dbInstance.transaction(() => {
    tables.forEach((table) => dbInstance.prepare(`DELETE FROM ${table}`).run());
    setMeta("last_incremental_sync", "");
    resetActivityFeedWatermark();
  });
  tx();
}

function clearProjectData(projectId, { preserveIssueIds = [] } = {}) {
  const id = Number(projectId);
  if (!Number.isFinite(id) || id <= 0) return { removedIssues: 0 };

  const preserve = new Set(
    (preserveIssueIds || []).map(Number).filter((issueId) => Number.isFinite(issueId) && issueId > 0),
  );

  const issueIds = dbInstance
    .prepare("SELECT id FROM issues WHERE project_id = ?")
    .all(id)
    .map((row) => Number(row.id))
    .filter((issueId) => Number.isFinite(issueId) && issueId > 0 && !preserve.has(issueId));

  const tx = dbInstance.transaction(() => {
    if (issueIds.length) {
      const placeholders = issueIds.map(() => "?").join(", ");
      dbInstance.prepare(`DELETE FROM issue_custom_fields WHERE issue_id IN (${placeholders})`).run(...issueIds);
      dbInstance.prepare(`DELETE FROM journals WHERE issue_id IN (${placeholders})`).run(...issueIds);
      dbInstance.prepare(`DELETE FROM attachments WHERE issue_id IN (${placeholders})`).run(...issueIds);
      dbInstance.prepare(`DELETE FROM issue_relations WHERE issue_id IN (${placeholders})`).run(...issueIds);
      dbInstance.prepare(`DELETE FROM issue_children WHERE issue_id IN (${placeholders})`).run(...issueIds);
      dbInstance.prepare(`DELETE FROM issue_watchers WHERE issue_id IN (${placeholders})`).run(...issueIds);
      dbInstance.prepare(`DELETE FROM watched_issues WHERE issue_id IN (${placeholders})`).run(...issueIds);
      dbInstance.prepare(`DELETE FROM activity_feed WHERE issue_id IN (${placeholders})`).run(...issueIds);
      dbInstance.prepare(`DELETE FROM pushed_deadline_alerts WHERE issue_id IN (${placeholders})`).run(...issueIds);
      dbInstance.prepare(`DELETE FROM issues WHERE id IN (${placeholders})`).run(...issueIds);
    }
    dbInstance.prepare("DELETE FROM time_entries WHERE project_id = ?").run(id);
    dbInstance
      .prepare("UPDATE sync_projects SET enabled = 0, last_sync_at = NULL, issue_count = 0 WHERE project_id = ?")
      .run(id);
  });
  tx();
  return { removedIssues: issueIds.length };
}

function enqueueOfflineItem(type, payload) {
  const result = dbInstance
    .prepare("INSERT INTO offline_queue (type, payload_json, created_at) VALUES (?, ?, ?)")
    .run(type, JSON.stringify(payload), new Date().toISOString());
  return result.lastInsertRowid;
}

function getOfflineQueue() {
  return dbInstance.prepare("SELECT * FROM offline_queue ORDER BY id ASC").all();
}

function removeOfflineItem(id) {
  dbInstance.prepare("DELETE FROM offline_queue WHERE id = ?").run(id);
}

function removeAttachment(attachmentId) {
  const id = Number(attachmentId);
  if (!Number.isFinite(id)) return false;
  const result = dbInstance.prepare("DELETE FROM attachments WHERE id = ?").run(id);
  return result.changes > 0;
}

function getAttachmentById(attachmentId) {
  const id = Number(attachmentId);
  if (!Number.isFinite(id)) return null;
  return dbInstance.prepare("SELECT * FROM attachments WHERE id = ?").get(id) || null;
}

function markOfflineAttempt(id, errorMessage) {
  dbInstance
    .prepare("UPDATE offline_queue SET attempts = attempts + 1, last_error = ? WHERE id = ?")
    .run(errorMessage || null, id);
}

function addSyncFailure({ entityType, entityLabel, message }) {
  dbInstance
    .prepare(
      "INSERT INTO sync_failures (created_at, entity_type, entity_label, message) VALUES (?, ?, ?, ?)",
    )
    .run(new Date().toISOString(), entityType, entityLabel || null, message);
}

function getUnreadSyncFailures() {
  return dbInstance
    .prepare("SELECT * FROM sync_failures WHERE read_at IS NULL ORDER BY id DESC")
    .all();
}

function markSyncFailuresRead() {
  dbInstance
    .prepare("UPDATE sync_failures SET read_at = ? WHERE read_at IS NULL")
    .run(new Date().toISOString());
}

/** Preserve local-only customer_name when a pending row is replaced by a Redmine id on flush. */
const pendingCustomerNames = new Map();

function timeEntryCustomerStashKey(row) {
  return [
    row?.issue_id ?? "",
    Number(row?.hours) || 0,
    row?.spent_on || "",
    String(row?.comments || "").trim(),
  ].join("\u0001");
}

function upsertTimeEntry(entry, extras = {}) {
  const issueId = entry.issue?.id || entry.issue_id || null;
  let customerName = entry.customer_name || "";
  if (!String(customerName).trim()) {
    const stashKey = timeEntryCustomerStashKey({
      issue_id: issueId,
      hours: entry.hours,
      spent_on: entry.spent_on,
      comments: entry.comments,
    });
    if (pendingCustomerNames.has(stashKey)) {
      customerName = pendingCustomerNames.get(stashKey);
      pendingCustomerNames.delete(stashKey);
    }
  }
  dbInstance
    .prepare(
      `INSERT INTO time_entries (
        id, issue_id, project_id, project_name, user_id, user_name,
        hours, spent_on, comments, customer_name, activity_id, activity_name,
        created_on, updated_on, sync_status, sync_error,
        started_at, ended_at, entry_kind, entry_source
      ) VALUES (
        @id, @issue_id, @project_id, @project_name, @user_id, @user_name,
        @hours, @spent_on, @comments, @customer_name, @activity_id, @activity_name,
        @created_on, @updated_on, @sync_status, @sync_error,
        @started_at, @ended_at, @entry_kind, @entry_source
      )
      ON CONFLICT(id) DO UPDATE SET
        hours = excluded.hours,
        spent_on = excluded.spent_on,
        comments = excluded.comments,
        customer_name = COALESCE(NULLIF(excluded.customer_name, ''), time_entries.customer_name),
        activity_id = excluded.activity_id,
        activity_name = excluded.activity_name,
        updated_on = excluded.updated_on,
        sync_status = excluded.sync_status,
        sync_error = excluded.sync_error,
        started_at = COALESCE(NULLIF(excluded.started_at, ''), time_entries.started_at),
        ended_at = COALESCE(NULLIF(excluded.ended_at, ''), time_entries.ended_at)`,
    )
    .run({
      id: entry.id,
      issue_id: issueId,
      project_id: entry.project?.id || entry.project_id || null,
      project_name: entry.project?.name || entry.project_name || "",
      user_id: entry.user?.id || entry.user_id || null,
      user_name: entry.user?.name || entry.user_name || "",
      hours: entry.hours ?? 0,
      spent_on: entry.spent_on || null,
      comments: entry.comments || "",
      customer_name: customerName,
      activity_id: entry.activity?.id || entry.activity_id || null,
      activity_name: entry.activity?.name || entry.activity_name || "",
      created_on: entry.created_on || null,
      updated_on: entry.updated_on || null,
      sync_status: "synced",
      sync_error: null,
      started_at: extras.started_at || entry.started_at || null,
      ended_at: extras.ended_at || entry.ended_at || null,
      entry_kind: extras.entry_kind || entry.entry_kind || "work",
      entry_source: extras.entry_source || entry.entry_source || "manual",
    });
}

function getNextLocalTimeEntryId() {
  const row = dbInstance.prepare("SELECT MIN(id) as m FROM time_entries").get();
  const min = row?.m;
  // Local ids must stay negative so they never collide with Redmine ids.
  if (min == null || min > 0) return -1;
  return min - 1;
}

function insertLocalTimeEntry(entry) {
  const id = getNextLocalTimeEntryId();
  const now = new Date().toISOString();
  const syncStatus = entry.sync_status || "pending";
  dbInstance
    .prepare(
      `INSERT INTO time_entries (
        id, issue_id, project_id, project_name, user_id, user_name,
        hours, spent_on, comments, customer_name, activity_id, activity_name,
        created_on, updated_on, sync_status,
        started_at, ended_at, entry_kind, entry_source
      ) VALUES (
        @id, @issue_id, @project_id, @project_name, @user_id, @user_name,
        @hours, @spent_on, @comments, @customer_name, @activity_id, @activity_name,
        @created_on, @updated_on, @sync_status,
        @started_at, @ended_at, @entry_kind, @entry_source
      )`,
    )
    .run({
      id,
      issue_id: entry.issue_id || null,
      project_id: entry.project_id || null,
      project_name: entry.project_name || "",
      user_id: entry.user_id || null,
      user_name: entry.user_name || "",
      hours: Number(entry.hours) || 0,
      spent_on: entry.spent_on || now.slice(0, 10),
      comments: entry.comments || "",
      customer_name: entry.customer_name || "",
      activity_id: entry.activity_id || null,
      activity_name: entry.activity_name || "",
      created_on: now,
      updated_on: now,
      sync_status: syncStatus,
      started_at: entry.started_at || null,
      ended_at: entry.ended_at || null,
      entry_kind: entry.entry_kind || "work",
      entry_source: entry.entry_source || "manual",
    });
  if (entry.is_running) {
    dbInstance.prepare("UPDATE time_entries SET is_running = 1 WHERE id = ?").run(id);
  }
  return dbInstance.prepare("SELECT * FROM time_entries WHERE id = ?").get(id);
}

function markTimeEntrySyncStatus(id, status, errorMessage = null) {
  dbInstance
    .prepare("UPDATE time_entries SET sync_status = ?, sync_error = ? WHERE id = ?")
    .run(status, errorMessage, id);
}

function deleteLocalTimeEntry(id) {
  const row = getTimeEntryById(id);
  if (row && String(row.customer_name || "").trim()) {
    pendingCustomerNames.set(timeEntryCustomerStashKey(row), String(row.customer_name).trim());
  }
  dbInstance.prepare("DELETE FROM time_entries WHERE id = ?").run(id);
}

function getTimeEntryById(id) {
  return dbInstance.prepare("SELECT * FROM time_entries WHERE id = ?").get(Number(id)) || null;
}

function updateLocalTimeEntry(id, patch = {}) {
  const entryId = Number(id);
  const row = getTimeEntryById(entryId);
  if (!row) return null;

  const next = {
    issue_id: patch.issue_id !== undefined ? patch.issue_id : row.issue_id,
    project_id: patch.project_id !== undefined ? patch.project_id : row.project_id,
    project_name: patch.project_name !== undefined ? patch.project_name : row.project_name,
    hours: patch.hours !== undefined ? Number(patch.hours) : row.hours,
    spent_on: patch.spent_on !== undefined ? patch.spent_on : row.spent_on,
    comments: patch.comments !== undefined ? patch.comments : row.comments,
    customer_name: patch.customer_name !== undefined ? patch.customer_name : row.customer_name,
    activity_id: patch.activity_id !== undefined ? patch.activity_id : row.activity_id,
    activity_name: patch.activity_name !== undefined ? patch.activity_name : row.activity_name,
    sync_status: patch.sync_status !== undefined ? patch.sync_status : row.sync_status,
    sync_error: patch.sync_error !== undefined ? patch.sync_error : row.sync_error,
    started_at: patch.started_at !== undefined ? patch.started_at : row.started_at,
    ended_at: patch.ended_at !== undefined ? patch.ended_at : row.ended_at,
    is_running: patch.is_running !== undefined ? (patch.is_running ? 1 : 0) : row.is_running,
    entry_source: patch.entry_source !== undefined ? patch.entry_source : row.entry_source,
    updated_on: new Date().toISOString(),
  };

  dbInstance
    .prepare(
      `UPDATE time_entries SET
        issue_id = @issue_id,
        project_id = @project_id,
        project_name = @project_name,
        hours = @hours,
        spent_on = @spent_on,
        comments = @comments,
        customer_name = @customer_name,
        activity_id = @activity_id,
        activity_name = @activity_name,
        sync_status = @sync_status,
        sync_error = @sync_error,
        started_at = @started_at,
        ended_at = @ended_at,
        is_running = @is_running,
        entry_source = @entry_source,
        updated_on = @updated_on
       WHERE id = @id`,
    )
    .run({ id: entryId, ...next });

  return getTimeEntryById(entryId);
}

function removeOfflineItemsForTimeEntry(entryId) {
  const id = Number(entryId);
  const items = getOfflineQueue();
  for (const item of items) {
    if (!["create_time_entry", "update_time_entry", "delete_time_entry"].includes(item.type)) continue;
    try {
      const payload = JSON.parse(item.payload_json);
      if (Number(payload.localId) === id || Number(payload.entryId) === id) {
        removeOfflineItem(item.id);
      }
    } catch {
      /* ignore bad payload */
    }
  }
}

/** Drop a local/pending/error/draft time entry and related queue items; adjust spent_hours. */
function discardLocalTimeEntry(id) {
  const entry = getTimeEntryById(id);
  if (!entry) return false;
  removeOfflineItemsForTimeEntry(id);
  const isLocalish =
    entry.sync_status === "pending" ||
    entry.sync_status === "error" ||
    entry.sync_status === "draft" ||
    Number(entry.id) < 0;
  if (isLocalish && entry.issue_id && entry.hours) {
    addIssueSpentHours(entry.issue_id, -Number(entry.hours));
  }
  deleteLocalTimeEntry(id);
  return true;
}

function addIssueSpentHours(issueId, deltaHours) {
  const id = Number(issueId);
  const delta = Number(deltaHours);
  if (!Number.isFinite(id) || !Number.isFinite(delta) || delta === 0) return false;
  const result = dbInstance
    .prepare("UPDATE issues SET spent_hours = COALESCE(spent_hours, 0) + ? WHERE id = ?")
    .run(delta, id);
  return result.changes > 0;
}

/** Absolute spent_hours from Redmine (not a delta). */
function setIssueSpentHours(issueId, hours) {
  const id = Number(issueId);
  if (!Number.isFinite(id) || id <= 0) return false;
  const value = hours == null || hours === "" ? null : Number(hours);
  const result = dbInstance
    .prepare("UPDATE issues SET spent_hours = ? WHERE id = ?")
    .run(Number.isFinite(value) ? value : null, id);
  return result.changes > 0;
}

/**
 * Drop local synced time entries that are no longer returned by Redmine for the same scope.
 * Keeps pending/error/draft rows and local-only (negative) ids.
 * @returns {{ removedCount: number, affectedIssueIds: number[] }}
 */
function removeOrphanSyncedTimeEntries(filters = {}, keepIds = []) {
  const keep = new Set(
    (keepIds || []).map(Number).filter((id) => Number.isFinite(id) && id > 0),
  );
  const local = queryTimeEntries(filters);
  const affected = new Set();
  let removedCount = 0;

  for (const row of local) {
    const id = Number(row.id);
    if (!Number.isFinite(id) || id <= 0) continue;
    if (row.sync_status === "pending" || row.sync_status === "error" || row.sync_status === "draft") continue;
    if (keep.has(id)) continue;
    removeOfflineItemsForTimeEntry(id);
    deleteLocalTimeEntry(id);
    removedCount += 1;
    if (row.issue_id) affected.add(Number(row.issue_id));
  }

  return { removedCount, affectedIssueIds: [...affected] };
}

function queryTimeEntries(filters = {}) {
  const clauses = ["1=1"];
  const params = {};

  if (filters.userId) {
    clauses.push("user_id = @userId");
    params.userId = Number(filters.userId);
  }
  if (filters.issueId) {
    clauses.push("issue_id = @issueId");
    params.issueId = Number(filters.issueId);
  }
  if (filters.from) {
    clauses.push("spent_on >= @from");
    params.from = filters.from;
  }
  if (filters.to) {
    clauses.push("spent_on <= @to");
    params.to = filters.to;
  }
  if (filters.syncStatus) {
    clauses.push("sync_status = @syncStatus");
    params.syncStatus = String(filters.syncStatus);
  }
  if (Array.isArray(filters.syncStatuses) && filters.syncStatuses.length) {
    const statuses = filters.syncStatuses.map(String);
    const placeholders = statuses.map((_, i) => `@ss${i}`).join(", ");
    statuses.forEach((status, i) => {
      params[`ss${i}`] = status;
    });
    clauses.push(`sync_status IN (${placeholders})`);
  }

  const sql = `SELECT * FROM time_entries WHERE ${clauses.join(" AND ")} ORDER BY spent_on DESC, id DESC`;
  return dbInstance.prepare(sql).all(params);
}

function countIssuesByProject(projectId) {
  return dbInstance.prepare("SELECT COUNT(*) AS cnt FROM issues WHERE project_id = ?").get(projectId).cnt;
}

function getDistinctAssignees(projectIds = null) {
  const ids = Array.isArray(projectIds)
    ? projectIds.map(Number).filter((id) => Number.isFinite(id) && id > 0)
    : null;

  if (ids && ids.length) {
    const placeholders = ids.map((_, i) => `@p${i}`).join(", ");
    const params = {};
    ids.forEach((id, i) => {
      params[`p${i}`] = id;
    });
    return dbInstance
      .prepare(
        `SELECT DISTINCT assigned_to_id AS id, assigned_to_name AS name
         FROM issues
         WHERE assigned_to_id IS NOT NULL AND TRIM(assigned_to_name) != ''
           AND project_id IN (${placeholders})
         ORDER BY assigned_to_name COLLATE NOCASE`,
      )
      .all(params);
  }

  return dbInstance
    .prepare(
      `SELECT DISTINCT assigned_to_id AS id, assigned_to_name AS name
       FROM issues
       WHERE assigned_to_id IS NOT NULL AND TRIM(assigned_to_name) != ''
       ORDER BY assigned_to_name COLLATE NOCASE`,
    )
    .all();
}

function getDistinctAuthors(projectIds = null) {
  const ids = Array.isArray(projectIds)
    ? projectIds.map(Number).filter((id) => Number.isFinite(id) && id > 0)
    : null;

  if (ids && ids.length) {
    const placeholders = ids.map((_, i) => `@p${i}`).join(", ");
    const params = {};
    ids.forEach((id, i) => {
      params[`p${i}`] = id;
    });
    return dbInstance
      .prepare(
        `SELECT DISTINCT author_id AS id, author_name AS name
         FROM issues
         WHERE author_id IS NOT NULL AND TRIM(author_name) != ''
           AND project_id IN (${placeholders})
         ORDER BY author_name COLLATE NOCASE`,
      )
      .all(params);
  }

  return dbInstance
    .prepare(
      `SELECT DISTINCT author_id AS id, author_name AS name
       FROM issues
       WHERE author_id IS NOT NULL AND TRIM(author_name) != ''
       ORDER BY author_name COLLATE NOCASE`,
    )
    .all();
}

function getDistinctCustomerNames() {
  return dbInstance
    .prepare(
      `SELECT DISTINCT customer_name AS name FROM time_entries
       WHERE customer_name IS NOT NULL AND TRIM(customer_name) != ''
       ORDER BY customer_name COLLATE NOCASE`,
    )
    .all();
}

function getTimeEntriesForReport({ userId, from, to }) {
  return dbInstance
    .prepare(
      `SELECT te.id, te.issue_id, te.project_name, te.hours, te.spent_on, te.comments,
              te.activity_name, te.customer_name, i.subject AS issue_subject
       FROM time_entries te
       LEFT JOIN issues i ON i.id = te.issue_id
       WHERE te.user_id = @userId AND te.spent_on >= @from AND te.spent_on <= @to
       ORDER BY te.spent_on ASC`,
    )
    .all({ userId: Number(userId), from, to });
}

function getOpenChildrenForIssues(issueIds) {
  const ids = (issueIds || []).map(Number).filter((id) => Number.isFinite(id) && id > 0);
  if (!ids.length) return [];
  const placeholders = ids.map((_, i) => `@id${i}`).join(", ");
  const params = {};
  ids.forEach((id, i) => {
    params[`id${i}`] = id;
  });
  return dbInstance
    .prepare(
      `SELECT id, subject, parent_id FROM issues
       WHERE parent_id IN (${placeholders}) AND status_is_closed = 0`,
    )
    .all(params);
}

function getActiveTimer() {
  return dbInstance.prepare("SELECT * FROM active_timer WHERE id = 1").get() || null;
}

function startActiveTimer({
  issueId,
  projectId,
  activityId,
  entryKind = "work",
  comment = "",
  customerName = "",
} = {}) {
  const startedAt = new Date().toISOString();
  dbInstance
    .prepare(
      `INSERT INTO active_timer (
        id, issue_id, project_id, activity_id, entry_kind,
        started_at, accumulated_seconds, is_paused, comment_draft, customer_name
      ) VALUES (
        1, @issue_id, @project_id, @activity_id, @entry_kind,
        @started_at, 0, 0, @comment_draft, @customer_name
      )
      ON CONFLICT(id) DO UPDATE SET
        issue_id = excluded.issue_id,
        project_id = excluded.project_id,
        activity_id = excluded.activity_id,
        entry_kind = excluded.entry_kind,
        started_at = excluded.started_at,
        accumulated_seconds = 0,
        is_paused = 0,
        comment_draft = excluded.comment_draft,
        customer_name = excluded.customer_name`,
    )
    .run({
      issue_id: issueId != null ? Number(issueId) : null,
      project_id: projectId != null ? Number(projectId) : null,
      activity_id: activityId != null ? Number(activityId) : null,
      entry_kind: entryKind || "work",
      started_at: startedAt,
      comment_draft: comment || "",
      customer_name: customerName || "",
    });
  return getActiveTimer();
}

function updateActiveTimerComment(comment) {
  const row = getActiveTimer();
  if (!row) return null;
  dbInstance.prepare("UPDATE active_timer SET comment_draft = ? WHERE id = 1").run(comment || "");
  return getActiveTimer();
}

function pauseActiveTimer() {
  const row = getActiveTimer();
  if (!row || row.is_paused) return row;
  const startedMs = Date.parse(row.started_at);
  const elapsed = Number.isFinite(startedMs) ? Math.max(0, Math.floor((Date.now() - startedMs) / 1000)) : 0;
  const accumulated = Number(row.accumulated_seconds) || 0;
  dbInstance
    .prepare(
      `UPDATE active_timer SET
        is_paused = 1,
        accumulated_seconds = @accumulated,
        started_at = @started_at
       WHERE id = 1`,
    )
    .run({
      accumulated: accumulated + elapsed,
      started_at: new Date().toISOString(),
    });
  return getActiveTimer();
}

function resumeActiveTimer() {
  const row = getActiveTimer();
  if (!row || !row.is_paused) return row;
  dbInstance
    .prepare("UPDATE active_timer SET is_paused = 0, started_at = ? WHERE id = 1")
    .run(new Date().toISOString());
  return getActiveTimer();
}

function clearActiveTimer() {
  dbInstance.prepare("DELETE FROM active_timer WHERE id = 1").run();
  return null;
}

function getRunningTimeEntries() {
  return dbInstance
    .prepare("SELECT * FROM time_entries WHERE is_running = 1 ORDER BY started_at ASC, id ASC")
    .all();
}

function setTimeEntryRunning(id, isRunning) {
  dbInstance
    .prepare("UPDATE time_entries SET is_running = ?, updated_on = ? WHERE id = ?")
    .run(isRunning ? 1 : 0, new Date().toISOString(), Number(id));
  return getTimeEntryById(id);
}

module.exports = {
  openDatabase,
  closeDatabase,
  getDb,
  getDbPath,
  getMeta,
  setMeta,
  saveReferenceData,
  getReferenceData,
  getAllReferenceData,
  setSyncProjects,
  getSyncProjects,
  getEnabledSyncProjectIds,
  updateSyncProjectState,
  applyIssueUpdatePatch,
  upsertIssueSummary,
  saveIssueDetail,
  saveAllowedStatuses,
  getPendingIssueUpdateFieldKeys,
  queryIssues,
  queryProjectStatuses,
  getIssueById,
  getCacheStats,
  estimateCacheDownload,
  clearCacheData,
  clearProjectData,
  rebuildIssueFtsEntry,
  rebuildAllIssuesFts,
  setAttachmentLocalPath,
  listCachedAttachments,
  getClosedIssueRows,
  deleteIssuesByIds,
  enqueueOfflineItem,
  getOfflineQueue,
  removeOfflineItem,
  removeAttachment,
  getAttachmentById,
  markOfflineAttempt,
  addSyncFailure,
  getUnreadSyncFailures,
  markSyncFailuresRead,
  upsertTimeEntry,
  insertLocalTimeEntry,
  markTimeEntrySyncStatus,
  deleteLocalTimeEntry,
  getTimeEntryById,
  updateLocalTimeEntry,
  removeOfflineItemsForTimeEntry,
  discardLocalTimeEntry,
  addIssueSpentHours,
  setIssueSpentHours,
  removeOrphanSyncedTimeEntries,
  queryTimeEntries,
  countIssuesByProject,
  getDistinctAssignees,
  getDistinctAuthors,
  getDistinctCustomerNames,
  getTimeEntriesForReport,
  getOpenChildrenForIssues,
  getActiveTimer,
  startActiveTimer,
  updateActiveTimerComment,
  pauseActiveTimer,
  resumeActiveTimer,
  clearActiveTimer,
  getRunningTimeEntries,
  setTimeEntryRunning,
  replaceWatchedIssues,
  getWatchedIssueIds,
  issueExists,
  getJournalIdsForIssue,
  ensureActivityFeedWatermark,
  resetActivityFeedWatermark,
  insertActivityEvent,
  insertActivityEvents,
  queryActivityFeed,
  countUnseenActivity,
  markActivitySeen,
  pruneActivityFeed,
  clearActivityFeed,
  getDeadlineAlerts,
  hasBeenPushed,
  markPushed,
  isoDateLocal,
  addDaysToIsoDate,
};
