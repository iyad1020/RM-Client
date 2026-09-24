// Purely visual behaviors — popover open/close, status-scope toggle state,
// and the collapsed/expanded comment composer. No Redmine business logic:
// wiring the scope toggle and filter checklist to an actual query is
// renderer.js's job — this file only manages the UI state and persistence
// of user-facing preferences that don't require a server round-trip.
(function () {
  var POPOVER_IDS = ["notifications-popover", "columns-settings-popover"];

  function closeAllPopovers(exceptId) {
    POPOVER_IDS.forEach(function (id) {
      if (id === exceptId) return;
      var el = document.getElementById(id);
      if (el) el.classList.add("hidden");
    });
  }

  function wirePopoverToggle(btnId, popoverId) {
    var btn = document.getElementById(btnId);
    var pop = document.getElementById(popoverId);
    if (!btn || !pop) return;
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var willOpen = pop.classList.contains("hidden");
      closeAllPopovers();
      if (willOpen) pop.classList.remove("hidden");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    // Connection/settings card open/close is handled in renderer.js.
    // Issue edit mode (toggle-edit-btn / #issue-page.editing) is wired in renderer.js.

    wirePopoverToggle("edit-columns-btn", "columns-settings-popover");

    ["columns-settings-close-btn"].forEach(function (id) {
      var btn = document.getElementById(id);
      if (btn) btn.addEventListener("click", function () { closeAllPopovers(); });
    });

    document.addEventListener("click", function (e) {
      if (!e.target.closest(".settings-anchor") && !e.target.closest(".notifications") && !e.target.closest("#notifications-popover") && !e.target.closest('[data-global-nav="notifications"]')) {
        closeAllPopovers();
      }
    });

    // Status scope (Открытые / Все) is wired in renderer.js — it drives the status multi-select.

    // Create-issue modal: backdrop close + cancel clear only.
    // Opening (incl. CF preload) is owned by renderer.js — do not open here or the
    // modal flashes empty then reflows when renderer resets/loads fields.
    var createModal = document.getElementById("create-issue-modal");
    var createForm = document.getElementById("create-issue-form");
    var createCancelBtn = document.getElementById("create-issue-cancel-btn");
    if (createModal && createForm) {
      var closeCreateModal = function () {
        createModal.classList.add("hidden");
        createForm.querySelectorAll(".field-row.invalid").forEach(function (row) {
          row.classList.remove("invalid");
        });
      };
      if (createCancelBtn) createCancelBtn.addEventListener("click", closeCreateModal);
      // Close only when both press and release happen on the backdrop with LMB.
      // Selecting text inside and releasing outside must not close the modal.
      var backdropPointerDown = false;
      createModal.addEventListener("mousedown", function (e) {
        if (e.button !== 0) return;
        backdropPointerDown = e.target === createModal;
      });
      createModal.addEventListener("mouseup", function (e) {
        if (e.button !== 0) {
          backdropPointerDown = false;
          return;
        }
        if (backdropPointerDown && e.target === createModal) closeCreateModal();
        backdropPointerDown = false;
      });
      // Submit + field validation live in renderer.js (createIssueSubmit).
    }

    // Comment composer: collapsed single line by default, expands on focus/click,
    // collapses again on outside click if left empty — same idea as Jira.
    var commentForm = document.getElementById("issue-comment-form");
    var commentTextarea = document.getElementById("edit-notes");
    if (commentForm && commentTextarea) {
      var expand = function () { commentForm.classList.add("expanded"); };
      var collapseIfEmpty = function () {
        var hasPending = commentForm.querySelector("#comment-attachments-list:not(.hidden)");
        if (!commentTextarea.value.trim() && !hasPending) commentForm.classList.remove("expanded");
      };
      commentTextarea.addEventListener("focus", expand);
      commentForm.addEventListener("click", expand);
      document.addEventListener("click", function (e) {
        if (!commentForm.contains(e.target)) collapseIfEmpty();
      });

      // Textile toolbar — wrap/prefix selection in #edit-notes.
      var toolbar = commentForm.querySelector(".comment-toolbar");
      if (toolbar) {
        toolbar.addEventListener("mousedown", function (e) {
          if (e.target.closest("button")) e.preventDefault();
        });
        toolbar.addEventListener("click", function (e) {
          var btn = e.target.closest("button[data-textile]");
          if (!btn) return;
          var cmd = btn.getAttribute("data-textile");
          if (cmd === "image") {
            // Handled in renderer.js (file picker + pending uploads).
            commentForm.dispatchEvent(new CustomEvent("comment-insert-image"));
            return;
          }
          applyTextile(commentTextarea, cmd);
          expand();
        });
      }
    }
  });

  function applyTextile(textarea, cmd) {
    var start = textarea.selectionStart;
    var end = textarea.selectionEnd;
    var value = textarea.value;
    var selected = value.slice(start, end);
    var before = value.slice(0, start);
    var after = value.slice(end);
    var insert = "";
    var selStart = start;
    var selEnd = start;

    function wrap(left, right, placeholder) {
      right = right == null ? left : right;
      if (selected) {
        insert = left + selected + right;
        selStart = start;
        selEnd = start + insert.length;
      } else {
        insert = left + placeholder + right;
        selStart = start + left.length;
        selEnd = selStart + placeholder.length;
      }
    }

    function prefixLines(prefix) {
      var block = selected || "текст";
      insert = block
        .split("\n")
        .map(function (line) { return prefix + line; })
        .join("\n");
      if (selected) {
        selStart = start;
        selEnd = start + insert.length;
      } else {
        selStart = start + prefix.length;
        selEnd = start + insert.length;
      }
    }

    switch (cmd) {
      case "bold":
        wrap("*", "*", "жирный");
        break;
      case "italic":
        wrap("_", "_", "курсив");
        break;
      case "underline":
        wrap("+", "+", "подчёркнутый");
        break;
      case "strike":
        wrap("-", "-", "зачёркнутый");
        break;
      case "h1":
        insert = "h1. " + (selected || "Заголовок");
        selStart = selected ? start : start + 4;
        selEnd = start + insert.length;
        break;
      case "h2":
        insert = "h2. " + (selected || "Заголовок");
        selStart = selected ? start : start + 4;
        selEnd = start + insert.length;
        break;
      case "h3":
        insert = "h3. " + (selected || "Заголовок");
        selStart = selected ? start : start + 4;
        selEnd = start + insert.length;
        break;
      case "ul":
        prefixLines("* ");
        break;
      case "ol":
        prefixLines("# ");
        break;
      case "code":
        wrap("@", "@", "код");
        break;
      case "link": {
        var label = selected || "текст ссылки";
        var url = window.prompt("URL ссылки:", "https://");
        if (!url) return;
        insert = '"' + label + '":' + url;
        selStart = start;
        selEnd = start + insert.length;
        break;
      }
      default:
        return;
    }

    textarea.value = before + insert + after;
    textarea.focus();
    textarea.setSelectionRange(selStart, selEnd);
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
  }
})();
