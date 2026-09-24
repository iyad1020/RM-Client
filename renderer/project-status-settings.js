(function () {
  var STORAGE_KEY = "redmine-client:project-statuses";
  var DEFAULT_STATUS_NAMES = [
    "новый",
    "согласован",
    "в работе",
    "решенный",
    "решённый",
    "resolved",
    "закрытый",
    "закрыт",
    "closed",
    "обратная связь",
    "feedback",
    "проверена",
    "проверен",
    "отклонен",
    "отклонён",
  ];

  function normalizeName(name) {
    return String(name || "")
      .trim()
      .toLowerCase()
      .replace(/ё/g, "е");
  }

  function normalizeProjectKey(projectId) {
    if (projectId === null || projectId === undefined || projectId === "" || projectId === "all") return "all";
    return String(Number(projectId));
  }

  function parseStore() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      var parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (_error) {
      return {};
    }
  }

  function saveStore(store) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store || {}));
  }

  function normalizeEnabled(list) {
    return Array.from(
      new Set(
        (Array.isArray(list) ? list : [])
          .map(function (id) {
            return Number(id);
          })
          .filter(function (id) {
            return Number.isFinite(id) && id > 0;
          }),
      ),
    );
  }

  function getBaseIds(referenceStatuses) {
    return (referenceStatuses || [])
      .filter(function (status) {
        return DEFAULT_STATUS_NAMES.indexOf(normalizeName(status && status.name)) !== -1;
      })
      .map(function (status) {
        return Number(status.id);
      })
      .filter(function (id) {
        return Number.isFinite(id) && id > 0;
      });
  }

  function loadProjectStatusConfig(projectId) {
    var store = parseStore();
    var key = normalizeProjectKey(projectId);
    return store[key];
  }

  function saveProjectStatusConfig(projectId, enabledIds) {
    var store = parseStore();
    var key = normalizeProjectKey(projectId);
    store[key] = { enabled: normalizeEnabled(enabledIds) };
    saveStore(store);
    return store[key];
  }

  function resetProjectStatusConfig(projectId) {
    var store = parseStore();
    var key = normalizeProjectKey(projectId);
    delete store[key];
    saveStore(store);
  }

  function getEnabledStatusIds(projectId, referenceStatuses, projectStatuses) {
    var cfg = loadProjectStatusConfig(projectId);
    if (cfg && cfg.enabled) return normalizeEnabled(cfg.enabled);
    var baseIds = getBaseIds(referenceStatuses);
    if (!baseIds.length) return [];
    var projectIds = (projectStatuses || []).map(function (status) {
      return Number(status.id);
    });
    if (!projectIds.length) return baseIds;
    var intersection = baseIds.filter(function (id) {
      return projectIds.indexOf(id) !== -1;
    });
    return intersection.length ? intersection : projectIds;
  }

  function getEffectiveStatuses(projectId, referenceStatuses, projectStatuses) {
    var source = Array.isArray(projectStatuses) && projectStatuses.length ? projectStatuses : referenceStatuses || [];
    if (!source.length) return [];
    var enabled = getEnabledStatusIds(projectId, referenceStatuses, source);
    if (!enabled.length) return source.slice();
    return source.filter(function (status) {
      return enabled.indexOf(Number(status.id)) !== -1;
    });
  }

  window.ProjectStatusSettings = {
    STORAGE_KEY: STORAGE_KEY,
    DEFAULT_STATUS_NAMES: DEFAULT_STATUS_NAMES.slice(),
    normalizeProjectKey: normalizeProjectKey,
    parseStore: parseStore,
    loadProjectStatusConfig: loadProjectStatusConfig,
    saveProjectStatusConfig: saveProjectStatusConfig,
    resetProjectStatusConfig: resetProjectStatusConfig,
    getBaseIds: getBaseIds,
    getEnabledStatusIds: getEnabledStatusIds,
    getEffectiveStatuses: getEffectiveStatuses,
  };
})();
