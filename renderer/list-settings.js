// Purely visual/config controls — no Redmine business logic.
// Handles: which optional columns show in the issues list, and keeps
// already-rendered rows (built by renderer.js) in sync when the choice changes.
//
// IMPORTANT for renderer.js: to actually populate "Приоритет", "Потрачено
// часов" or "Срок завершения" per row, add a matching element inside each
// .issue-item with a data-col attribute, e.g.:
//   <div class="issue-meta" data-col="hours">4.5 ч</div>
// This script only shows/hides — it never invents data that isn't rendered.
(function () {
  var COLS = [
    { key: "project", width: "160px" },
    { key: "assignee", width: "140px" },
    { key: "status", width: "130px" },
    { key: "priority", width: "110px" },
    { key: "hours", width: "110px" },
    { key: "author", width: "140px" },
    { key: "estimated_hours", width: "110px" },
    { key: "due", width: "120px" },
    { key: "updated_on", width: "148px" }
  ];
  var STORAGE_KEY = "redmine-client:columns";
  var DEFAULT_ENABLED = ["project", "assignee", "status", "priority", "due", "hours", "updated_on"];

  function loadEnabled() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_ENABLED.slice();
      var parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        if (parsed.indexOf("due") === -1 && !localStorage.getItem(STORAGE_KEY + ":due-defaulted")) {
          parsed.push("due");
          saveEnabled(parsed);
          localStorage.setItem(STORAGE_KEY + ":due-defaulted", "1");
        }
        if (parsed.indexOf("hours") === -1 && !localStorage.getItem(STORAGE_KEY + ":hours-defaulted")) {
          parsed.push("hours");
          saveEnabled(parsed);
          localStorage.setItem(STORAGE_KEY + ":hours-defaulted", "1");
        }
        if (parsed.indexOf("priority") === -1 && !localStorage.getItem(STORAGE_KEY + ":priority-defaulted")) {
          parsed.push("priority");
          saveEnabled(parsed);
          localStorage.setItem(STORAGE_KEY + ":priority-defaulted", "1");
        }
        if (parsed.indexOf("updated_on") === -1 && !localStorage.getItem(STORAGE_KEY + ":updated-defaulted")) {
          parsed.push("updated_on");
          saveEnabled(parsed);
          localStorage.setItem(STORAGE_KEY + ":updated-defaulted", "1");
        }
        return parsed;
      }
    } catch (e) {}
    return DEFAULT_ENABLED.slice();
  }

  function saveEnabled(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function applyColumns(enabled) {
    var head = document.querySelector(".issues-columns-head");
    var view = document.getElementById("issues-view");
    if (!head || !view) return;

    var template = "var(--issues-subject-width, minmax(0, 1fr))";
    COLS.forEach(function (col) {
      var on = enabled.indexOf(col.key) !== -1;
      var headCell = head.querySelector('[data-col="' + col.key + '"]');
      if (headCell) headCell.classList.toggle("hidden", !on);
      if (on) template += " " + col.width;
    });
    view.style.setProperty("--issues-grid-template", template);

    document.querySelectorAll("#issues-list .issue-item").forEach(function (row) {
      COLS.forEach(function (col) {
        var cell = row.querySelector('[data-col="' + col.key + '"]');
        if (cell) cell.classList.toggle("hidden", enabled.indexOf(col.key) === -1);
      });
    });
  }

  function syncCheckboxes(enabled) {
    document.querySelectorAll("#columns-settings-popover [data-col-toggle]").forEach(function (box) {
      box.checked = enabled.indexOf(box.getAttribute("data-col-toggle")) !== -1;
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var enabled = loadEnabled();
    applyColumns(enabled);
    syncCheckboxes(enabled);

    window.applyColumnSettings = function () {
      applyColumns(loadEnabled());
    };

    var list = document.getElementById("issues-list");
    if (list) {
      new MutationObserver(function () {
        applyColumns(loadEnabled());
      }).observe(list, { childList: true, subtree: true });
    }

    var saveBtn = document.getElementById("columns-settings-save-btn");
    if (saveBtn) {
      saveBtn.addEventListener("click", function () {
        var next = [];
        document.querySelectorAll("#columns-settings-popover [data-col-toggle]").forEach(function (box) {
          if (box.checked) next.push(box.getAttribute("data-col-toggle"));
        });
        saveEnabled(next);
        applyColumns(next);
        document.getElementById("columns-settings-popover").classList.add("hidden");
      });
    }
  });
})();
