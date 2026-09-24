// Activity feed display settings (limit + type groups). No Redmine logic.
(function () {
  var STORAGE_KEY = "redmine-client:activity-feed";
  var DEFAULT_LIMIT = 10;
  var LIMIT_OPTIONS = [10, 25, 50, 100];
  var ALL_GROUPS = ["comment", "params", "assigned", "attachment"];
  var GROUP_LABELS = {
    comment: "Комментарии",
    params: "Изменения параметров",
    assigned: "Назначение на меня",
    attachment: "Файлы",
  };
  var GROUP_KINDS = {
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

  function normalizeLimit(value) {
    var n = Number(value);
    return LIMIT_OPTIONS.indexOf(n) !== -1 ? n : DEFAULT_LIMIT;
  }

  function normalizeGroups(list) {
    if (!Array.isArray(list) || !list.length) return ALL_GROUPS.slice();
    var filtered = list.filter(function (g) {
      return ALL_GROUPS.indexOf(g) !== -1;
    });
    return filtered.length ? filtered : ALL_GROUPS.slice();
  }

  function loadSettings() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return { limit: DEFAULT_LIMIT, groups: ALL_GROUPS.slice() };
      }
      var parsed = JSON.parse(raw);
      return {
        limit: normalizeLimit(parsed && parsed.limit),
        groups: normalizeGroups(parsed && parsed.groups),
      };
    } catch (e) {
      return { limit: DEFAULT_LIMIT, groups: ALL_GROUPS.slice() };
    }
  }

  function saveSettings(settings) {
    var next = {
      limit: normalizeLimit(settings && settings.limit),
      groups: normalizeGroups(settings && settings.groups),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  }

  function resetSettings() {
    return saveSettings({ limit: DEFAULT_LIMIT, groups: ALL_GROUPS.slice() });
  }

  function kindsForGroups(groups) {
    var set = {};
    normalizeGroups(groups).forEach(function (group) {
      (GROUP_KINDS[group] || []).forEach(function (kind) {
        set[kind] = true;
      });
    });
    return Object.keys(set);
  }

  function groupsSummary(groups) {
    var list = normalizeGroups(groups);
    if (list.length === ALL_GROUPS.length) return "Все типы";
    if (!list.length) return "Ничего";
    if (list.length === 1) return GROUP_LABELS[list[0]] || list[0];
    return "Выбрано: " + list.length;
  }

  window.ActivityFeedSettings = {
    STORAGE_KEY: STORAGE_KEY,
    DEFAULT_LIMIT: DEFAULT_LIMIT,
    LIMIT_OPTIONS: LIMIT_OPTIONS.slice(),
    ALL_GROUPS: ALL_GROUPS.slice(),
    GROUP_LABELS: GROUP_LABELS,
    GROUP_KINDS: GROUP_KINDS,
    loadSettings: loadSettings,
    saveSettings: saveSettings,
    resetSettings: resetSettings,
    kindsForGroups: kindsForGroups,
    groupsSummary: groupsSummary,
    normalizeLimit: normalizeLimit,
    normalizeGroups: normalizeGroups,
  };
})();
