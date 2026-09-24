// Purely visual enhancement — no business logic.
// Colors the status column in the issues list and the "Статус" row in the
// issue key-value block based on the status text that renderer.js already
// renders. Also colors priority text and mono-formats date-looking values.
// Safe to remove: without this file everything still works, just monochrome.
(function () {
  var STATUS_COLORS = [
    [/нов/i, "#5b8def"],
    [/в работе/i, "#3ddc84"],
    [/обратная связь|уточнен/i, "#e0a640"],
    [/решен|выполнен/i, "#38b8a4"],
    [/закрыт/i, "#7b8494"],
    [/отклонен|отменен/i, "#e5484d"]
  ];

  function colorFor(text) {
    var t = (text || "").trim();
    for (var i = 0; i < STATUS_COLORS.length; i++) {
      if (STATUS_COLORS[i][0].test(t)) return STATUS_COLORS[i][1];
    }
    return null;
  }

  function priorityColorFor(text) {
    if (window.PriorityColor && typeof window.PriorityColor.getPriorityColor === "function") {
      return window.PriorityColor.getPriorityColor(text);
    }
    return null;
  }

  function paintListRows() {
    var rows = document.querySelectorAll("#issues-list .issue-item");
    rows.forEach(function (row) {
      var statusCell = row.querySelector(".issue-status-cell .issue-status-label") || row.querySelector(".issue-status-cell");
      if (statusCell) {
        var color = colorFor(statusCell.textContent);
        var paintTarget = row.querySelector(".issue-status-cell") || statusCell;
        paintTarget.style.setProperty("--status-color", color || "");
      }

      var priorityCell = row.querySelector('[data-col="priority"]');
      if (priorityCell) {
        var pColor = priorityColorFor(priorityCell.textContent);
        if (pColor) {
          priorityCell.style.setProperty("--priority-color", pColor);
          priorityCell.classList.add("has-priority-color");
        } else {
          priorityCell.style.removeProperty("--priority-color");
          priorityCell.classList.remove("has-priority-color");
        }
      }
    });
  }

  function paintMainMeta() {
    var container = document.getElementById("issue-main-meta");
    if (!container) return;
    var children = Array.prototype.slice.call(container.children);
    for (var i = 0; i < children.length; i += 2) {
      var key = children[i];
      var val = children[i + 1];
      if (!key || !val) continue;
      var keyText = (key.textContent || "").trim();
      var textEl = val.querySelector(".field-view") || val;
      var text = (textEl.textContent || "").trim();

      if (/статус/i.test(keyText)) {
        var color = colorFor(text);
        if (color) {
          textEl.classList.add("kv-value-status");
          textEl.style.background = "";
          textEl.style.color = color;
          textEl.style.fontWeight = "600";
        }
      } else if (/приоритет/i.test(keyText)) {
        var pColor = priorityColorFor(text);
        if (pColor) {
          textEl.classList.add("kv-value-priority");
          textEl.style.color = pColor;
          textEl.style.fontWeight = "600";
        } else {
          textEl.classList.remove("kv-value-priority");
          textEl.style.color = "";
          textEl.style.fontWeight = "";
        }
      } else if (/^\d{2}\.\d{2}\.\d{4}$/.test(text)) {
        textEl.classList.add("kv-value-date");
      }
    }
  }

  function paintAll() {
    paintListRows();
    paintMainMeta();
  }

  window.applyStatusColors = paintAll;

  document.addEventListener("DOMContentLoaded", function () {
    paintAll();
    var list = document.getElementById("issues-list");
    var meta = document.getElementById("issue-main-meta");
    var obs = new MutationObserver(paintAll);
    if (list) obs.observe(list, { childList: true, subtree: true });
    if (meta) obs.observe(meta, { childList: true, subtree: true });
  });
})();
