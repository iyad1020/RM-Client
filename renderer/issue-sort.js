/**
 * Pure issue-list sorting helpers (no DOM).
 * Priority weight: higher = more important.
 */
(function (root) {
  const PRIORITY_WEIGHT = {
    немедленно: 6,
    срочный: 5,
    высокий: 4,
    обычный: 3,
    низкий: 2,
    отложено: 1,
  };

  function getPriorityWeight(priorityName) {
    const key = String(priorityName || "")
      .toLowerCase()
      .trim();
    if (Object.prototype.hasOwnProperty.call(PRIORITY_WEIGHT, key)) {
      return PRIORITY_WEIGHT[key];
    }
    return 0;
  }

  function compareDueDates(aDue, bDue, dir) {
    const da = aDue || "";
    const db = bDue || "";
    if (!da && !db) return 0;
    if (!da) return 1;
    if (!db) return -1;
    if (da < db) return -1 * dir;
    if (da > db) return 1 * dir;
    return 0;
  }

  function compareNames(aName, bName, dir) {
    const mul = dir === "desc" ? -1 : 1;
    return String(aName || "").localeCompare(String(bName || ""), "ru", { sensitivity: "base" }) * mul;
  }

  /** Empty assignee always last, regardless of sort direction. */
  function compareAssignees(aName, bName, dir) {
    const aEmpty = !aName || !String(aName).trim();
    const bEmpty = !bName || !String(bName).trim();
    if (aEmpty && bEmpty) return 0;
    if (aEmpty) return 1;
    if (bEmpty) return -1;
    return compareNames(aName, bName, dir);
  }

  function compareUpdated(aIso, bIso, dir) {
    const ta = aIso ? Date.parse(aIso) : NaN;
    const tb = bIso ? Date.parse(bIso) : NaN;
    const aEmpty = !Number.isFinite(ta);
    const bEmpty = !Number.isFinite(tb);
    if (aEmpty && bEmpty) return 0;
    if (aEmpty) return 1;
    if (bEmpty) return -1;
    const mul = dir === "desc" ? -1 : 1;
    if (ta < tb) return -1 * mul;
    if (ta > tb) return 1 * mul;
    return 0;
  }

  // Workflow order (1 = earliest). Russian and English lists are separate lanes.
  const STATUS_ORDER_RU = [
    "новый",
    "согласован",
    "в работе",
    "решенный",
    "обратная связь",
    "проверена",
    "закрыт",
    "отклонен",
  ];
  const STATUS_ORDER_EN = [
    "to do",
    "under review",
    "approved for estimation",
    "waiting for estimation",
    "estimated",
    "deferred",
    "rejected",
    "approved",
    "planned",
    "in progress",
    "done",
  ];
  const STATUS_ALIASES = {
    "under revie": "under review",
    "wating for estimation": "waiting for estimation",
    estimeted: "estimated",
  };

  function normalizeStatusKey(name) {
    let key = String(name || "")
      .toLowerCase()
      .replace(/ё/g, "е")
      .replace(/\s+/g, " ")
      .trim();
    if (STATUS_ALIASES[key]) key = STATUS_ALIASES[key];
    // Truncated Redmine label "under revie" / "Under Review…"
    if (key.startsWith("under revie")) key = "under review";
    return key;
  }

  /**
   * @returns {{ lane: number, rank: number }}
   * lane: 0 = RU, 1 = EN, 2 = unknown (RU always above EN; unknown last)
   * rank: 1..n in workflow order (smaller = earlier); unknown → large
   */
  function getStatusSortMeta(statusName) {
    const key = normalizeStatusKey(statusName);
    const ruIdx = STATUS_ORDER_RU.indexOf(key);
    if (ruIdx !== -1) return { lane: 0, rank: ruIdx + 1 };
    const enIdx = STATUS_ORDER_EN.indexOf(key);
    if (enIdx !== -1) return { lane: 1, rank: enIdx + 1 };
    return { lane: 2, rank: 1000 };
  }

  /**
   * Russian statuses always above English (and unknown last), regardless of dir.
   * Within a lane, asc = workflow order as listed, desc = reverse.
   */
  function compareStatuses(aName, bName, dir) {
    const a = getStatusSortMeta(aName);
    const b = getStatusSortMeta(bName);
    if (a.lane !== b.lane) return a.lane - b.lane;
    const mul = dir === "desc" ? -1 : 1;
    if (a.rank !== b.rank) return (a.rank - b.rank) * mul;
    return compareNames(aName, bName, dir);
  }

  /**
   * @param {Array} issues
   * @param {{
   *   priorityDir?: 'asc'|'desc'|null,
   *   dueDir?: 'asc'|'desc'|null,
   *   projectDir?: 'asc'|'desc'|null,
   *   assigneeDir?: 'asc'|'desc'|null,
   *   statusDir?: 'asc'|'desc'|null,
   *   updatedDir?: 'asc'|'desc'|null,
   * }} opts
   * Priority is always primary when priorityDir is set; due is secondary
   * (uses dueDir if set, otherwise ascending). Additional keys apply after.
   */
  function sortIssues(issues, opts = {}) {
    const priorityDir = opts.priorityDir || null;
    const dueDir = opts.dueDir || null;
    const projectDir = opts.projectDir || null;
    const assigneeDir = opts.assigneeDir || null;
    const statusDir = opts.statusDir || null;
    const updatedDir = opts.updatedDir || null;
    if (!priorityDir && !dueDir && !projectDir && !assigneeDir && !statusDir && !updatedDir) {
      return issues.slice();
    }

    const pMul = priorityDir === "asc" ? 1 : priorityDir === "desc" ? -1 : 0;
    const dMul = dueDir === "desc" ? -1 : 1;

    return issues.slice().sort((a, b) => {
      if (priorityDir) {
        const pa = getPriorityWeight(a.priority?.name);
        const pb = getPriorityWeight(b.priority?.name);
        if (pa !== pb) return (pa - pb) * pMul;
      }

      if (dueDir || priorityDir) {
        const dueCmp = compareDueDates(a.due_date, b.due_date, dueDir ? dMul : 1);
        if (dueCmp) return dueCmp;
      }

      if (projectDir) {
        const cmp = compareNames(a.project?.name, b.project?.name, projectDir);
        if (cmp) return cmp;
      }

      if (assigneeDir) {
        const cmp = compareAssignees(a.assigned_to?.name, b.assigned_to?.name, assigneeDir);
        if (cmp) return cmp;
      }

      if (statusDir) {
        const cmp = compareStatuses(a.status?.name, b.status?.name, statusDir);
        if (cmp) return cmp;
      }

      if (updatedDir) {
        const cmp = compareUpdated(a.updated_on, b.updated_on, updatedDir);
        if (cmp) return cmp;
      }

      return (Number(a.id) || 0) - (Number(b.id) || 0);
    });
  }

  const api = {
    PRIORITY_WEIGHT,
    getPriorityWeight,
    compareDueDates,
    compareNames,
    compareAssignees,
    compareStatuses,
    compareUpdated,
    getStatusSortMeta,
    STATUS_ORDER_RU,
    STATUS_ORDER_EN,
    sortIssues,
  };
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  root.IssueSort = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
