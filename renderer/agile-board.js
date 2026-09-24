// Agile board (Kanban) view — works with SQLite-backed data via renderer.js hooks.
(function () {
  function $(id) { return document.getElementById(id); }

  function el(tag, className, html) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (html !== undefined) node.innerHTML = html;
    return node;
  }

  function initials(name) {
    return String(name || "?").split(" ").map(function (p) { return p[0]; }).join("").slice(0, 2).toUpperCase();
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function colorForStatus(text) {
    var rules = [
      [/нов/i, "#5b8def"],
      [/в работе|in progress/i, "#3ddc84"],
      [/обратная|review|уточнен/i, "#e0a640"],
      [/решен|выполнен|done/i, "#38b8a4"],
      [/закрыт|closed/i, "#7b8494"],
      [/отклонен|rejected|отменен/i, "#e5484d"],
      [/estimate|оцен/i, "#7fb0e0"],
      [/plan|план/i, "#5b8def"],
      [/defer|отлож/i, "#7b8494"]
    ];
    var t = String(text || "").trim();
    for (var i = 0; i < rules.length; i++) {
      if (rules[i][0].test(t)) return rules[i][1];
    }
    return "#5b8def";
  }

  function getStatusRecords() {
    if (window.__getBoardStatuses) return window.__getBoardStatuses() || [];
    return [];
  }

  function getBoardIssues() {
    if (window.__getBoardIssues) return window.__getBoardIssues() || [];
    return [];
  }

  function updateBoardSubtitle() {
    var subtitle = $("board-subtitle");
    if (!subtitle) return;
    subtitle.textContent = window.__getBoardSubtitle ? window.__getBoardSubtitle() : "Доска задач";
  }

  var FIELDS = [
    { key: "tracker", label: "Трекер" },
    { key: "assignee", label: "Назначена" },
    { key: "author", label: "Автор" },
    { key: "number", label: "Номер задачи" },
    { key: "project", label: "Проект" },
    { key: "estimate", label: "Оценка" },
    { key: "doneRatio", label: "% готовности" },
    { key: "parent", label: "Родительская задача" }
  ];
  var DEFAULT_FIELDS = ["tracker", "assignee", "author"];

  var FILTER_ITEMS = [
    "Трекер", "Приоритет", "Автор", "Назначена", "Тема", "Готовность", "Подзадачи",
    "Версия status", "Трекер родителя", "Оценка трудозатрат", "Необходимые компетенции",
    "Задача", "Частная", "Наблюдатель"
  ];
  var FILTER_GROUPS = {
    "Назначена": ["Группа назначенного", "Роль назначенного"],
    "Дата": ["Создано", "Обновлено", "Срок завершения"]
  };

  var FILTER_FIELD_MAP = {
    "Трекер": "tracker",
    "Приоритет": "priority",
    "Автор": "author",
    "Назначена": "assignee"
  };

  var COL_KEY_PREFIX = "redmine-client:agile-columns:";
  var FIELD_KEY = "redmine-client:agile-fields";
  var AUTHOR_FIELD_MIGRATED_KEY = "redmine-client:agile-fields-author-v1";
  var EXPANDED_KEY = "redmine-client:agile-options-expanded";
  var TOOLBAR_COLLAPSED_KEY = "redmine-client:agile-toolbar-collapsed";
  var CLOSED_LIMIT_KEY = "redmine-client:agile-closed-limit";
  var DEFAULT_CLOSED_LIMIT = 10;

  var state = { filters: {}, dragging: false, dragIssueId: null, dragFromStatusId: null, dragAllowedPromise: null };

  function loadClosedColumnLimit() {
    try {
      var raw = localStorage.getItem(CLOSED_LIMIT_KEY);
      if (raw === null || raw === "") return DEFAULT_CLOSED_LIMIT;
      var n = Number(raw);
      if (!Number.isFinite(n) || n < 0) return DEFAULT_CLOSED_LIMIT;
      return Math.min(500, Math.floor(n));
    } catch (e) {
      return DEFAULT_CLOSED_LIMIT;
    }
  }

  function saveClosedColumnLimit(value) {
    var n = Number(value);
    if (!Number.isFinite(n) || n < 0) n = DEFAULT_CLOSED_LIMIT;
    localStorage.setItem(CLOSED_LIMIT_KEY, String(Math.min(500, Math.floor(n))));
  }

  function isClosedStatusName(statusName, statusMeta) {
    if (statusMeta && statusMeta.is_closed) return true;
    return /done|закрыт|closed|решен|выполнен/i.test(String(statusName || ""));
  }

  function limitClosedColumnIssues(issues, limit, statusName, statusMeta) {
    if (!limit || !isClosedStatusName(statusName, statusMeta)) return { issues: issues, total: issues.length };
    var sorted = issues.slice().sort(function (a, b) {
      return (b.updatedOn || 0) - (a.updatedOn || 0);
    });
    return { issues: sorted.slice(0, limit), total: sorted.length };
  }

  function syncClosedLimitInput() {
    var input = $("options-closed-limit");
    if (input) input.value = String(loadClosedColumnLimit());
  }

  function getFilterOptions(name) {
    var field = FILTER_FIELD_MAP[name];
    if (!field) return [];
    var seen = {};
    getBoardIssues().forEach(function (issue) {
      var v = issue[field];
      if (v && v !== "—") seen[v] = true;
    });
    return Object.keys(seen).sort();
  }

  function getSelectedProjectId() {
    if (window.__getSelectedProjectId) return window.__getSelectedProjectId();
    return "all";
  }

  function columnsStorageKey() {
    var projectId = getSelectedProjectId();
    return projectId && projectId !== "all" ? COL_KEY_PREFIX + projectId : null;
  }

  function getProjectStatusNames() {
    return getStatusRecords().map(function (s) { return s.name; }).filter(Boolean);
  }

  function getDefaultColumns() {
    return getProjectStatusNames();
  }

  function loadColumns() {
    var key = columnsStorageKey();
    var allowed = getProjectStatusNames();
    if (!key || !allowed.length) return getDefaultColumns();
    try {
      var raw = localStorage.getItem(key);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) {
          return parsed.filter(function (name) { return allowed.indexOf(name) !== -1; });
        }
      }
    } catch (e) {}
    return getDefaultColumns();
  }

  function saveColumns(list) {
    var key = columnsStorageKey();
    if (!key) return;
    localStorage.setItem(key, JSON.stringify(list));
  }

  function loadFields() {
    try {
      var raw = localStorage.getItem(FIELD_KEY);
      var parsed = raw ? JSON.parse(raw) : null;
      if (!localStorage.getItem(AUTHOR_FIELD_MIGRATED_KEY)) {
        localStorage.setItem(AUTHOR_FIELD_MIGRATED_KEY, "1");
        if (Array.isArray(parsed) && parsed.indexOf("author") === -1) {
          parsed = parsed.concat(["author"]);
          saveFields(parsed);
          return parsed;
        }
      }
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {}
    return DEFAULT_FIELDS.slice();
  }
  function saveFields(list) { localStorage.setItem(FIELD_KEY, JSON.stringify(list)); }

  function renderOptionsCheckboxes() {
    var colGrid = $("options-columns-grid");
    var fieldGrid = $("options-fields-grid");
    if (!colGrid || !fieldGrid) return;
    var columns = loadColumns();
    var fields = loadFields();
    var statuses = getProjectStatusNames();

    colGrid.innerHTML = "";
    if (!statuses.length) {
      colGrid.appendChild(el("div", "muted", "Выберите проект — статусы появятся после синхронизации"));
    } else {
      statuses.forEach(function (status) {
        var label = el("label", "checklist-item");
        label.innerHTML = '<input type="checkbox" data-col-name="' + escapeHtml(status) + '"' + (columns.indexOf(status) !== -1 ? " checked" : "") + " /> " + escapeHtml(status);
        colGrid.appendChild(label);
      });
    }

    fieldGrid.innerHTML = "";
    FIELDS.forEach(function (f) {
      var label = el("label", "checklist-item");
      label.innerHTML = '<input type="checkbox" data-field-name="' + f.key + '"' + (fields.indexOf(f.key) !== -1 ? " checked" : "") + " /> " + f.label;
      fieldGrid.appendChild(label);
    });
    syncClosedLimitInput();
  }

  function appendPersonRow(container, name, role, extraClass) {
    var row = el("div", "kanban-card-person" + (extraClass ? " " + extraClass : ""));
    row.appendChild(el("span", "watcher-avatar", initials(name)));
    row.appendChild(el("span", "kanban-card-person-name", escapeHtml(name || "—")));
    row.appendChild(el("span", "kanban-card-person-role", role));
    container.appendChild(row);
  }

  function formatEstimate(value) {
    if (value === "" || value === null || value === undefined) return "—";
    var n = Number(value);
    if (Number.isFinite(n)) return String(n);
    return String(value);
  }

  function buildCard(issue, fields) {
    var card = el("div", "kanban-card");
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.draggable = true;
    card.dataset.issueId = String(issue.id);
    card.dataset.statusId = issue.statusId != null ? String(issue.statusId) : "";

    if (fields.indexOf("tracker") !== -1) {
      card.appendChild(el("span", "kanban-card-tracker", escapeHtml(issue.tracker)));
    }

    var idPrefix = fields.indexOf("number") !== -1 ? "<b>#" + issue.id + "</b> " : "";
    card.appendChild(el("div", "kanban-card-subject", idPrefix + escapeHtml(issue.subject)));

    if (issue.parentId) {
      var parentLabel = "#" + issue.parentId;
      if (issue.parentSubject) parentLabel += " " + issue.parentSubject;
      var parentChip = el("div", "kanban-card-parent");
      parentChip.title = "Родительская задача " + parentLabel;
      parentChip.appendChild(el("span", "kanban-card-parent-icon", "\u21B3"));
      parentChip.appendChild(el("span", "kanban-card-parent-text", escapeHtml(parentLabel)));
      card.appendChild(parentChip);
    }

    var extras = [];
    if (fields.indexOf("project") !== -1) extras.push("Проект: " + (issue.project || "—"));
    if (fields.indexOf("estimate") !== -1) extras.push("Оценка: " + formatEstimate(issue.estimatedHours));
    if (fields.indexOf("doneRatio") !== -1) extras.push("Готовность: " + (issue.doneRatio || 0) + "%");
    if (fields.indexOf("parent") !== -1 && issue.parentId && !issue.parentSubject) {
      extras.push("Родитель: #" + issue.parentId);
    }
    if (extras.length) card.appendChild(el("div", "kanban-card-meta-extra", extras.join(" · ")));

    var people = el("div", "kanban-card-people");
    if (fields.indexOf("assignee") !== -1) appendPersonRow(people, issue.assignee, "исп.");
    if (fields.indexOf("author") !== -1) appendPersonRow(people, issue.author, "автор", "is-author");
    if (people.childNodes.length) card.appendChild(people);

    card.addEventListener("click", function () {
      if (state.dragging) return;
      if (window.__openIssuePreview) window.__openIssuePreview(issue.id);
    });
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); if (window.__openIssuePreview) window.__openIssuePreview(issue.id); }
    });
    bindCardDrag(card, issue);

    return card;
  }

  function clearDropTargets() {
    document.querySelectorAll(".kanban-column").forEach(function (col) {
      col.classList.remove("kanban-column--drop-ok", "kanban-column--drop-forbidden");
    });
  }

  function applyAllowedColumns(result, issue) {
    var columns = document.querySelectorAll(".kanban-column");
    if (result && result.unavailable) {
      columns.forEach(function (col) {
        col.classList.add("kanban-column--drop-forbidden");
      });
      return;
    }
    var unsupported = Boolean(result && result.unsupported);
    var allowedIds = {};
    (result && result.statuses ? result.statuses : []).forEach(function (s) {
      allowedIds[Number(s.id)] = true;
    });
    columns.forEach(function (col) {
      var id = Number(col.getAttribute("data-status-id"));
      var ok = unsupported || allowedIds[id] || id === Number(issue.statusId);
      col.classList.toggle("kanban-column--drop-ok", ok);
      col.classList.toggle("kanban-column--drop-forbidden", !ok);
    });
  }

  function bindCardDrag(card, issue) {
    card.addEventListener("dragstart", function (e) {
      state.dragging = true;
      state.dragIssueId = issue.id;
      state.dragFromStatusId = issue.statusId;
      e.dataTransfer.setData("text/plain", String(issue.id));
      e.dataTransfer.effectAllowed = "move";
      card.classList.add("is-dragging");
      state.dragAllowedPromise = window.__getAllowedStatuses
        ? window.__getAllowedStatuses(issue.id)
        : Promise.resolve({ unsupported: true });
      state.dragAllowedPromise.then(function (result) {
        if (state.dragIssueId !== issue.id) return;
        applyAllowedColumns(result, issue);
      }).catch(function () {
        if (state.dragIssueId !== issue.id) return;
        applyAllowedColumns({ unavailable: true }, issue);
      });
    });
    card.addEventListener("dragend", function () {
      card.classList.remove("is-dragging");
      clearDropTargets();
      setTimeout(function () { state.dragging = false; }, 0);
    });
  }

  function bindColumnDrop(col, statusId, statusName) {
    col.addEventListener("dragover", function (e) {
      if (!state.dragging) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = col.classList.contains("kanban-column--drop-forbidden") ? "none" : "move";
    });
    col.addEventListener("drop", function (e) {
      e.preventDefault();
      var issueId = Number(e.dataTransfer.getData("text/plain") || state.dragIssueId);
      var targetId = Number(statusId);
      if (!issueId || !targetId) return;
      if (Number(state.dragFromStatusId) === targetId) return;
      var promise = state.dragAllowedPromise || Promise.resolve({ unsupported: true });
      promise.then(function (result) {
        if (result && result.unavailable) {
          if (window.__showAppToast) window.__showAppToast("Нужна сеть, чтобы проверить переход статуса", "error");
          return null;
        }
        if (!result || !result.unsupported) {
          var allowed = (result && result.statuses ? result.statuses : []).some(function (s) {
            return Number(s.id) === targetId;
          });
          if (!allowed) {
            if (window.__showAppToast) {
              window.__showAppToast("Нельзя сменить статус на «" + statusName + "»: переход запрещён в Redmine.", "error");
            }
            return null;
          }
        }
        if (!window.__applyBoardStatusChange) return null;
        return window.__applyBoardStatusChange(issueId, targetId);
      }).then(function (result) {
        if (result && result.cancelled && window.__refreshBoardData) window.__refreshBoardData();
      });
    });
  }

  function showBoardEmpty(title, message, showSync) {
    var scroller = $("kanban-scroller");
    var emptyState = $("board-empty-state");
    var titleEl = $("board-empty-title");
    var messageEl = $("board-empty-message");
    var syncBtn = $("board-sync-now-btn");
    if (scroller) scroller.classList.add("hidden");
    if (emptyState) emptyState.classList.remove("hidden");
    if (titleEl) titleEl.textContent = title;
    if (messageEl) messageEl.textContent = message;
    if (syncBtn) syncBtn.classList.toggle("hidden", !showSync);
  }

  function renderBoard() {
    var scroller = $("kanban-scroller");
    var emptyState = $("board-empty-state");
    if (!scroller || !emptyState) return;

    updateBoardSubtitle();

    var projectId = getSelectedProjectId();
    if (!projectId || projectId === "all") {
      scroller.innerHTML = "";
      showBoardEmpty(
        "Выберите проект",
        "Доска Agile работает только для одного проекта. Укажите проект в фильтре «Проект» в верхней панели.",
        false
      );
      return;
    }

    var columns = loadColumns();
    var fields = loadFields();
    var search = (($("board-search") && $("board-search").value) || "").trim().toLowerCase();
    var allIssues = getBoardIssues();
    var projectStatuses = getProjectStatusNames();
    var visibleStatuses = (columns.length ? columns : getDefaultColumns()).filter(function (name) {
      return projectStatuses.indexOf(name) !== -1;
    });

    scroller.innerHTML = "";

    if (!projectStatuses.length) {
      showBoardEmpty(
        "Нет статусов для проекта",
        "Синхронизируйте задачи выбранного проекта — колонки появятся из реальных статусов в кэше.",
        true
      );
      return;
    }

    if (!visibleStatuses.length) {
      showBoardEmpty(
        "Нет выбранных колонок",
        "Откройте «Опции» и отметьте статусы проекта, которые нужно показывать на доске.",
        false
      );
      return;
    }

    scroller.classList.remove("hidden");
    emptyState.classList.add("hidden");

    visibleStatuses.forEach(function (status) {
      var statusMeta = null;
      getStatusRecords().forEach(function (s) {
        if (s.name === status) statusMeta = s;
      });

      var issues = allIssues.filter(function (issue) {
        if (issue.status !== status) return false;
        for (var filterName in state.filters) {
          var fieldKey = FILTER_FIELD_MAP[filterName];
          var wanted = state.filters[filterName];
          if (fieldKey && wanted && issue[fieldKey] !== wanted) return false;
        }
        if (search && issue.subject.toLowerCase().indexOf(search) === -1 && String(issue.id).indexOf(search) === -1) return false;
        return true;
      });

      var closedLimit = loadClosedColumnLimit();
      var limited = limitClosedColumnIssues(issues, closedLimit, status, statusMeta);
      issues = limited.issues;
      var totalIssues = limited.total;

      var col = el("div", "kanban-column");
      if (statusMeta && statusMeta.id != null) col.setAttribute("data-status-id", String(statusMeta.id));
      col.setAttribute("data-status-name", status);
      var headColor = colorForStatus(status);
      var countLabel = totalIssues > issues.length
        ? issues.length + " из " + totalIssues
        : String(totalIssues);
      var head = el("div", "kanban-column-head", escapeHtml(status) + ' <span class="count">(' + countLabel + ')</span>');
      head.style.setProperty("--status-color", headColor);
      col.appendChild(head);
      var body = el("div", "kanban-column-body");
      issues.forEach(function (issue) { body.appendChild(buildCard(issue, fields)); });
      if (totalIssues > issues.length) {
        body.appendChild(el("div", "kanban-column-more muted", "ещё " + (totalIssues - issues.length) + " в кэше"));
      }
      col.appendChild(body);
      bindColumnDrop(col, statusMeta && statusMeta.id, status);
      scroller.appendChild(col);
    });
  }

  function renderFilterDropdown() {
    var list = $("filter-option-list");
    if (!list) return;
    list.innerHTML = "";
    FILTER_ITEMS.forEach(function (name) {
      var btn = el("button", "filter-option");
      btn.type = "button";
      btn.textContent = name;
      btn.addEventListener("click", function () { pickFilter(name); });
      list.appendChild(btn);
    });
    Object.keys(FILTER_GROUPS).forEach(function (groupName) {
      var groupLabel = el("div", "filter-option-group-label");
      groupLabel.textContent = groupName;
      list.appendChild(groupLabel);
      FILTER_GROUPS[groupName].forEach(function (name) {
        var btn = el("button", "filter-option nested");
        btn.type = "button";
        btn.textContent = name;
        btn.addEventListener("click", function () { pickFilter(name); });
        list.appendChild(btn);
      });
    });
  }

  function closeChipPopovers() {
    document.querySelectorAll(".filter-chip-popover").forEach(function (p) { p.remove(); });
    document.removeEventListener("click", chipPopoverOutsideHandler);
  }

  function chipPopoverOutsideHandler(e) {
    if (!e.target.closest(".filter-chip")) closeChipPopovers();
  }

  function openChipValuePicker(chip, name) {
    closeChipPopovers();
    var options = getFilterOptions(name);
    var pop = el("div", "filter-chip-popover");
    if (!options.length) {
      pop.appendChild(el("div", "filter-chip-popover-empty muted", "Нет данных для этого поля"));
    } else {
      options.forEach(function (opt) {
        var btn = el("button", "filter-option", escapeHtml(opt));
        btn.type = "button";
        btn.addEventListener("click", function () {
          state.filters[name] = opt;
          var label = chip.querySelector(".filter-chip-label");
          if (label) label.textContent = name + ": " + opt;
          closeChipPopovers();
          renderBoard();
        });
        pop.appendChild(btn);
      });
    }
    chip.appendChild(pop);
    setTimeout(function () { document.addEventListener("click", chipPopoverOutsideHandler); }, 0);
  }

  function pickFilter(name) {
    var popover = $("add-filter-popover");
    if (popover) popover.classList.add("hidden");
    var row = $("filter-chips-row");
    if (!row || row.querySelector('[data-filter-name="' + name + '"]')) return;

    var chip = el("span", "filter-chip");
    chip.setAttribute("data-filter-name", name);

    var label = el("button", "filter-chip-label", escapeHtml(name) + ": не задано");
    label.type = "button";
    label.addEventListener("click", function (e) {
      e.stopPropagation();
      openChipValuePicker(chip, name);
    });
    chip.appendChild(label);

    var removeBtn = el("button", "filter-chip-remove", "&times;");
    removeBtn.type = "button";
    removeBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      delete state.filters[name];
      chip.remove();
      if (!row.querySelector(".filter-chip")) row.classList.add("hidden");
      closeChipPopovers();
      renderBoard();
    });
    chip.appendChild(removeBtn);

    row.appendChild(chip);
    row.classList.remove("hidden");
    openChipValuePicker(chip, name);
  }

  function updateOfflineBadge() {
    var badge = $("offline-badge");
    var scroller = $("kanban-scroller");
    var offline = window.__getNetworkOnline ? !window.__getNetworkOnline() : !navigator.onLine;
    if (badge) badge.classList.toggle("hidden", !offline);
    if (scroller) scroller.classList.toggle("offline", offline);
  }

  function showListView() {
    if (window.__closeIssuePreview) window.__closeIssuePreview();
    $("issue-page")?.classList.add("hidden");
    $("time-entries-view")?.classList.add("hidden");
    $("report-view")?.classList.add("hidden");
    $("view-list-btn")?.classList.add("active");
    $("view-agile-btn")?.classList.remove("active");
    $("issues-view")?.classList.remove("hidden");
    $("agile-view")?.classList.add("hidden");
    $("list-scope-controls")?.classList.remove("hidden");
    $("list-only-actions")?.classList.remove("hidden");
    document
      .querySelector("header.topbar")
      ?.classList.remove(
        "is-issue-mode",
        "is-agile-mode",
        "is-tracker-mode",
        "is-report-mode",
        "is-activity-mode",
        "is-settings-mode",
      );
    document.querySelectorAll('[data-agile-hide="true"]').forEach(function (f) { f.classList.remove("hidden"); });
  }

  function showAgileView() {
    if (window.__closeIssuePreview) window.__closeIssuePreview();
    $("issue-page")?.classList.add("hidden");
    $("time-entries-view")?.classList.add("hidden");
    $("report-view")?.classList.add("hidden");
    $("tracker-view")?.classList.add("hidden");
    $("view-agile-btn")?.classList.add("active");
    $("view-list-btn")?.classList.remove("active");
    $("agile-view")?.classList.remove("hidden");
    $("issues-view")?.classList.add("hidden");
    $("list-scope-controls")?.classList.add("hidden");
    $("list-only-actions")?.classList.add("hidden");
    var topbar = document.querySelector("header.topbar");
    topbar?.classList.remove("is-issue-mode", "is-tracker-mode", "is-report-mode", "is-activity-mode", "is-settings-mode");
    topbar?.classList.add("is-agile-mode");
    document.querySelectorAll('[data-agile-hide="true"]').forEach(function (f) { f.classList.add("hidden"); });
    if (window.__refreshBoardData) {
      window.__refreshBoardData().then(function () {
        renderOptionsCheckboxes();
        renderBoard();
      });
    } else {
      renderOptionsCheckboxes();
      renderBoard();
    }
  }

  window.__showAgileView = showAgileView;
  window.__agileBoardRefresh = renderBoard;

  document.addEventListener("DOMContentLoaded", function () {
    renderOptionsCheckboxes();
    syncClosedLimitInput();
    renderFilterDropdown();
    updateOfflineBadge();
    window.addEventListener("online", updateOfflineBadge);
    window.addEventListener("offline", updateOfflineBadge);

    var panel = document.querySelector(".options-panel");
    var expanded = localStorage.getItem(EXPANDED_KEY) !== "0";
    if (panel) panel.classList.toggle("expanded", expanded);
    var optionsBody = $("options-body");
    if (optionsBody) optionsBody.classList.toggle("hidden", !expanded);

    var toolbarCollapsible = $("board-toolbar-collapsible");
    var toolbarChevron = $("board-toolbar-chevron");
    var toolbarToggleBtn = $("board-toolbar-toggle-btn");
    var toolbarCollapsed = localStorage.getItem(TOOLBAR_COLLAPSED_KEY) === "1";
    if (toolbarCollapsible) toolbarCollapsible.classList.toggle("collapsed", toolbarCollapsed);
    if (toolbarChevron) toolbarChevron.innerHTML = toolbarCollapsed ? "&#9660;" : "&#9650;";
    if (toolbarToggleBtn) {
      toolbarToggleBtn.addEventListener("click", function () {
        var willCollapse = !toolbarCollapsible.classList.contains("collapsed");
        toolbarCollapsible.classList.toggle("collapsed", willCollapse);
        toolbarChevron.innerHTML = willCollapse ? "&#9660;" : "&#9650;";
        localStorage.setItem(TOOLBAR_COLLAPSED_KEY, willCollapse ? "1" : "0");
      });
    }

    var toggleBtn = $("options-toggle-btn");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", function () {
        var willExpand = optionsBody.classList.contains("hidden");
        optionsBody.classList.toggle("hidden", !willExpand);
        panel.classList.toggle("expanded", willExpand);
        localStorage.setItem(EXPANDED_KEY, willExpand ? "1" : "0");
      });
    }

    var applyBtn = $("options-apply-btn");
    if (applyBtn) {
      applyBtn.addEventListener("click", function () {
        var cols = [];
        document.querySelectorAll("#options-columns-grid [data-col-name]").forEach(function (b) {
          if (b.checked) cols.push(b.getAttribute("data-col-name"));
        });
        var flds = [];
        document.querySelectorAll("#options-fields-grid [data-field-name]").forEach(function (b) {
          if (b.checked) flds.push(b.getAttribute("data-field-name"));
        });
        saveColumns(cols);
        saveFields(flds);
        var closedLimitInput = $("options-closed-limit");
        if (closedLimitInput) saveClosedColumnLimit(closedLimitInput.value);
        renderBoard();
      });
    }

    var clearBtn = $("options-clear-btn");
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        document.querySelectorAll("#options-columns-grid input, #options-fields-grid input").forEach(function (b) {
          b.checked = false;
        });
      });
    }

    var addFilterBtn = $("add-filter-btn");
    if (addFilterBtn) {
      addFilterBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        renderFilterDropdown();
        $("add-filter-popover").classList.toggle("hidden");
      });
    }

    document.addEventListener("click", function (e) {
      if (!e.target.closest(".add-filter-anchor")) {
        var pop = $("add-filter-popover");
        if (pop) pop.classList.add("hidden");
      }
      if (!e.target.closest(".options-panel")) {
        var body = $("options-body");
        var panelEl = document.querySelector(".options-panel");
        if (body && !body.classList.contains("hidden")) {
          body.classList.add("hidden");
          if (panelEl) panelEl.classList.remove("expanded");
          localStorage.setItem(EXPANDED_KEY, "0");
        }
      }
    });

    var searchInput = $("board-search");
    if (searchInput) searchInput.addEventListener("input", renderBoard);

    var syncBtn = $("board-sync-now-btn");
    if (syncBtn) {
      syncBtn.addEventListener("click", function () {
        if (window.__runBoardSync) {
          window.__runBoardSync();
        } else {
          renderBoard();
        }
      });
    }

    var listBtn = $("view-list-btn");
    var agileBtn = $("view-agile-btn");
    if (listBtn) listBtn.addEventListener("click", showListView);
    if (agileBtn) agileBtn.addEventListener("click", showAgileView);
  });
})();
