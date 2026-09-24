// First-run onboarding wizard — real Redmine connection, projects, and sync.
(function () {
  var TOTAL_STEPS = 3;
  var currentStep = 1;
  var connectionOk = false;
  var projectsLoaded = false;
  var loadedProjects = [];
  var syncUnsub = null;
  var syncStarted = false;

  function $(id) {
    return document.getElementById(id);
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function displayUserName(user) {
    if (!user) return "пользователь";
    var full = [user.firstname, user.lastname].filter(Boolean).join(" ").trim();
    return full || user.login || user.name || "пользователь";
  }

  function getCredentials() {
    return {
      redmineUrl: ($("wizard-url").value || "").trim(),
      apiKey: ($("wizard-api-key").value || "").trim(),
    };
  }

  function setNextEnabled(enabled) {
    var btn = $("wizard-next-btn");
    if (!btn) return;
    btn.disabled = !enabled;
  }

  function updateNextGate() {
    if (currentStep === 1) {
      setNextEnabled(connectionOk);
      return;
    }
    if (currentStep === 2) {
      var checked = document.querySelectorAll('#project-checklist input[type="checkbox"]:checked').length;
      setNextEnabled(projectsLoaded && checked > 0);
      return;
    }
    setNextEnabled(false);
  }

  function invalidateConnection() {
    connectionOk = false;
    projectsLoaded = false;
    loadedProjects = [];
    $("wizard-check-success").classList.add("hidden");
    $("wizard-check-error").classList.add("hidden");
    var list = $("project-checklist");
    if (list) list.innerHTML = "";
    updateSelectedCount();
    updateNextGate();
  }

  function updateProgress() {
    for (var i = 1; i <= TOTAL_STEPS; i++) {
      var dot = document.querySelector('.wizard-step-dot[data-dot="' + i + '"]');
      if (!dot) continue;
      dot.classList.toggle("done", i < currentStep);
      dot.classList.toggle("active", i === currentStep);
      dot.textContent = i < currentStep ? "\u2713" : String(i);
    }
    var lines = document.querySelectorAll(".wizard-progress-line");
    lines.forEach(function (line, idx) {
      line.classList.toggle("done", idx + 1 < currentStep);
    });
    $("wizard-step-label").textContent = "Шаг " + currentStep + " из " + TOTAL_STEPS;
  }

  function showStep(step) {
    currentStep = step;
    document.querySelectorAll(".wizard-step").forEach(function (el) {
      el.classList.toggle("hidden", Number(el.getAttribute("data-step")) !== step);
    });
    $("wizard-back-btn").classList.toggle("hidden", step === 1);
    $("wizard-skip-btn").classList.toggle("hidden", step !== 1);
    $("wizard-next-btn").classList.toggle("hidden", step === TOTAL_STEPS);
    updateProgress();
    updateNextGate();
  }

  function updateSelectedCount() {
    var checked = document.querySelectorAll('#project-checklist input[type="checkbox"]:checked').length;
    $("selected-count").textContent = "Выбрано: " + checked;
    if (currentStep === 2) updateNextGate();
  }

  function renderProjects(projects) {
    var list = $("project-checklist");
    if (!list) return;
    loadedProjects = Array.isArray(projects) ? projects.slice() : [];
    projectsLoaded = true;

    if (!loadedProjects.length) {
      list.innerHTML =
        '<div class="wizard-empty muted">Нет доступных проектов. Проверьте права API-ключа в Redmine.</div>';
      updateSelectedCount();
      updateNextGate();
      return;
    }

    loadedProjects.sort(function (a, b) {
      return String(a.name || "").localeCompare(String(b.name || ""), "ru");
    });

    list.innerHTML = loadedProjects
      .map(function (project) {
        var id = Number(project.id);
        var name = project.name || "Проект #" + id;
        return (
          '<label class="wizard-project-row">' +
          '<input type="checkbox" data-project-id="' +
          id +
          '" />' +
          '<span class="wizard-project-name">' +
          escapeHtml(name) +
          "</span>" +
          "</label>"
        );
      })
      .join("");

    updateSelectedCount();
    updateNextGate();
  }

  function getSelectedProjectIds() {
    return Array.from(document.querySelectorAll('#project-checklist input[type="checkbox"]:checked'))
      .map(function (box) {
        return Number(box.getAttribute("data-project-id"));
      })
      .filter(function (id) {
        return Number.isFinite(id) && id > 0;
      });
  }

  function describePhase(status) {
    switch (status && status.phase) {
      case "reference":
        return "Загрузка справочников\u2026";
      case "projects":
      case "issues":
        return "Загрузка задач\u2026";
      case "details":
        return "Загрузка истории изменений\u2026";
      case "incremental":
        return "Обновление\u2026";
      case "cancelled":
        return "Операция отменена";
      default:
        return status && status.running ? "Синхронизация\u2026" : "Готово";
    }
  }

  function updateSyncOverlay(status) {
    if (!status) return;
    var pct = Math.max(0, Math.min(100, Number(status.percent) || 0));
    var fill = $("sync-progress-fill");
    var percentEl = $("sync-progress-percent");
    var lineEl = $("sync-project-line");
    var detailEl = $("sync-detail-line");
    if (fill) fill.style.width = pct + "%";
    if (percentEl) percentEl.textContent = pct + "%";

    var projectName = status.projectName || "";
    var projectDone = Number(status.projectDone) || 0;
    var projectTotal = Number(status.projectTotal) || 0;
    if (lineEl) {
      if (projectName && projectTotal > 0) {
        lineEl.textContent = projectName + " \u2014 " + projectDone + " / " + projectTotal + " задач";
      } else if (projectName) {
        lineEl.textContent = projectName;
      } else {
        lineEl.textContent = describePhase(status);
      }
    }
    if (detailEl) detailEl.textContent = describePhase(status);
  }

  function showSyncOverlay() {
    var overlay = $("sync-progress-overlay");
    if (!overlay) return;
    overlay.classList.remove("hidden");
    updateSyncOverlay({
      running: true,
      phase: "reference",
      percent: 0,
      projectName: "",
      projectDone: 0,
      projectTotal: 0,
    });
  }

  function hideSyncOverlay() {
    var overlay = $("sync-progress-overlay");
    if (overlay) overlay.classList.add("hidden");
  }

  async function goToMain() {
    try {
      sessionStorage.setItem("redmine-client:start-product-tour", "1");
    } catch (_) {
      /* ignore */
    }
    if (window.desktopApi && window.desktopApi.openMainWindow) {
      await window.desktopApi.openMainWindow();
      return;
    }
    window.location.href = "./index.html";
  }

  async function ensureApi() {
    if (!window.desktopApi) {
      throw new Error("API приложения недоступно. Перезапустите RM Client.");
    }
  }

  async function loadProjectsForStep2() {
    await ensureApi();
    var creds = getCredentials();
    var list = $("project-checklist");
    if (list) {
      list.innerHTML = '<div class="wizard-empty muted">Загрузка проектов\u2026</div>';
    }
    var reference = await window.desktopApi.loadReferenceData(creds);
    var projects = (reference && reference.projects) || [];
    var active = projects.filter(function (p) {
      return Number(p.status) !== 5;
    });
    renderProjects(active);
  }

  async function advanceFromStep1() {
    if (!connectionOk) return;
    try {
      await loadProjectsForStep2();
      if (!loadedProjects.length) {
        alert("Не удалось получить список проектов. Проверьте права API-ключа.");
        return;
      }
      showStep(2);
    } catch (error) {
      connectionOk = false;
      updateNextGate();
      $("wizard-check-success").classList.add("hidden");
      $("wizard-check-error").classList.remove("hidden");
      var detail = document.querySelector("#wizard-check-error .wizard-check-detail");
      if (detail) detail.textContent = error.message || "Не удалось загрузить проекты";
      alert(error.message || "Не удалось загрузить проекты");
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    showStep(1);
    setNextEnabled(false);

    ["wizard-url", "wizard-api-key"].forEach(function (id) {
      var el = $(id);
      if (!el) return;
      el.addEventListener("input", invalidateConnection);
      el.addEventListener("change", invalidateConnection);
    });

    $("wizard-next-btn").addEventListener("click", async function () {
      if (currentStep === 1) {
        await advanceFromStep1();
        return;
      }
      if (currentStep === 2) {
        if (getSelectedProjectIds().length === 0) {
          alert("Выберите хотя бы один проект для синхронизации.");
          return;
        }
        showStep(3);
      }
    });

    $("wizard-back-btn").addEventListener("click", function () {
      if (currentStep > 1) showStep(currentStep - 1);
    });

    $("wizard-skip-btn").addEventListener("click", async function () {
      var ok = confirm(
        "Пропустить мастер настройки?\n\nВы попадёте в приложение без синхронизации. URL, API-ключ и проекты можно указать позже в настройках.",
      );
      if (!ok) return;
      try {
        await ensureApi();
        var creds = getCredentials();
        await window.desktopApi.completeOnboarding({
          redmineUrl: creds.redmineUrl || undefined,
          apiKey: creds.apiKey || undefined,
          autosyncEnabled: false,
        });
        await goToMain();
      } catch (error) {
        alert(error.message || "Не удалось пропустить настройку");
      }
    });

    $("wizard-check-btn").addEventListener("click", async function () {
      var btn = $("wizard-check-btn");
      var creds = getCredentials();
      $("wizard-check-success").classList.add("hidden");
      $("wizard-check-error").classList.add("hidden");
      connectionOk = false;
      updateNextGate();

      if (!creds.redmineUrl || !creds.apiKey) {
        $("wizard-check-error").classList.remove("hidden");
        var emptyDetail = document.querySelector("#wizard-check-error .wizard-check-detail");
        if (emptyDetail) emptyDetail.textContent = "Укажите URL и API-ключ";
        return;
      }

      if (btn) {
        btn.disabled = true;
        btn.textContent = "Проверка\u2026";
      }

      try {
        await ensureApi();
        var result = await window.desktopApi.testConnection(creds);
        if (result && result.ok) {
          connectionOk = true;
          $("wizard-check-username").textContent = displayUserName(result.user);
          $("wizard-check-success").classList.remove("hidden");
          $("wizard-check-error").classList.add("hidden");
        } else {
          connectionOk = false;
          $("wizard-check-success").classList.add("hidden");
          $("wizard-check-error").classList.remove("hidden");
          var errDetail = document.querySelector("#wizard-check-error .wizard-check-detail");
          if (errDetail) {
            errDetail.textContent = (result && result.message) || "Проверьте URL и API-ключ и попробуйте снова";
          }
        }
      } catch (error) {
        connectionOk = false;
        $("wizard-check-success").classList.add("hidden");
        $("wizard-check-error").classList.remove("hidden");
        var catchDetail = document.querySelector("#wizard-check-error .wizard-check-detail");
        if (catchDetail) catchDetail.textContent = error.message || "Не удалось подключиться";
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.textContent = "Проверить подключение";
        }
        updateNextGate();
      }
    });

    var searchInput = $("project-search");
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        var q = searchInput.value.trim().toLowerCase();
        document.querySelectorAll(".wizard-project-row").forEach(function (row) {
          var nameEl = row.querySelector(".wizard-project-name");
          var name = nameEl ? nameEl.textContent.toLowerCase() : "";
          row.classList.toggle("wizard-project-row--filtered-out", q.length > 0 && name.indexOf(q) === -1);
        });
      });
    }

    $("select-all-btn").addEventListener("click", function () {
      document.querySelectorAll('#project-checklist input[type="checkbox"]').forEach(function (box) {
        var row = box.closest(".wizard-project-row");
        if (row && row.classList.contains("wizard-project-row--filtered-out")) return;
        box.checked = true;
      });
      updateSelectedCount();
    });

    $("deselect-all-btn").addEventListener("click", function () {
      document.querySelectorAll('#project-checklist input[type="checkbox"]').forEach(function (box) {
        box.checked = false;
      });
      updateSelectedCount();
    });

    $("project-checklist").addEventListener("change", updateSelectedCount);

    $("start-sync-btn").addEventListener("click", async function () {
      if (syncStarted) return;
      var projectIds = getSelectedProjectIds();
      if (!projectIds.length) {
        alert("Выберите хотя бы один проект.");
        showStep(2);
        return;
      }

      var mode = document.querySelector('input[name="cache-mode"]:checked');
      var autosync = $("autosync-toggle").checked;
      var creds = getCredentials();
      var startBtn = $("start-sync-btn");

      try {
        await ensureApi();
        syncStarted = true;
        if (startBtn) startBtn.disabled = true;
        showSyncOverlay();

        if (syncUnsub) {
          syncUnsub();
          syncUnsub = null;
        }
        syncUnsub = window.desktopApi.onSyncProgress(updateSyncOverlay);

        var result = await window.desktopApi.startFullSync({
          redmineUrl: creds.redmineUrl,
          apiKey: creds.apiKey,
          projectIds: projectIds,
          cacheMode: (mode && mode.value) || "issues-history",
          autosyncEnabled: Boolean(autosync),
          autosyncIntervalMinutes: 5,
        });

        if (result && result.cancelled) {
          hideSyncOverlay();
          syncStarted = false;
          if (startBtn) startBtn.disabled = false;
          alert("Синхронизация прервана. Можно запустить снова или настроить проекты позже в приложении.");
          return;
        }

        updateSyncOverlay({
          running: false,
          phase: "idle",
          percent: 100,
          projectName: "",
          projectDone: 0,
          projectTotal: 0,
        });
        setTimeout(function () {
          goToMain().catch(function (error) {
            alert(error.message || "Не удалось открыть главное окно");
          });
        }, 400);
      } catch (error) {
        hideSyncOverlay();
        syncStarted = false;
        if (startBtn) startBtn.disabled = false;
        alert(error.message || "Синхронизация не удалась");
      }
    });

    var cancelBtn = $("sync-cancel-btn");
    if (cancelBtn) {
      cancelBtn.addEventListener("click", async function () {
        var ok = confirm(
          "Прервать синхронизацию?\n\nУже загруженные данные останутся, но кэш может быть неполным.",
        );
        if (!ok) return;
        try {
          await ensureApi();
          await window.desktopApi.cancelSync();
        } catch (_) {
          /* ignore */
        }
      });
    }

    var laterLink = $("sync-work-later-link");
    if (laterLink) {
      laterLink.addEventListener("click", function (event) {
        event.preventDefault();
        hideSyncOverlay();
        goToMain().catch(function () {});
      });
    }

    if (window.desktopApi && window.desktopApi.loadSettings) {
      window.desktopApi.loadSettings().then(function (settings) {
        if (!settings) return;
        if (settings.redmineUrl && !$("wizard-url").value) {
          $("wizard-url").value = settings.redmineUrl;
        }
        if (settings.apiKey && !$("wizard-api-key").value) {
          $("wizard-api-key").value = settings.apiKey;
        }
      }).catch(function () {});
    }
  });
})();
