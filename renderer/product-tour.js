// Interactive product tour — spotlight steps over the main UI.
(function () {
  var STORAGE_KEY = "redmine-client:product-tour-complete";

  var active = false;
  var currentIndex = 0;
  var overlayEl = null;
  var spotlightEl = null;
  var popoverEl = null;
  var resizeHandler = null;
  var hooks = {};

  function isTourComplete() {
    try {
      return localStorage.getItem(STORAGE_KEY) === "1";
    } catch (_) {
      return false;
    }
  }

  function markTourComplete() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch (_) {
      /* ignore */
    }
  }

  function clearTourComplete() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_) {
      /* ignore */
    }
  }

  function isVisible(el) {
    if (!el || !el.getBoundingClientRect) return false;
    if (el.closest(".hidden")) return false;
    var rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  function findVisible(selector) {
    var nodes = document.querySelectorAll(selector);
    for (var i = 0; i < nodes.length; i++) {
      if (isVisible(nodes[i])) return nodes[i];
    }
    return nodes.length ? nodes[0] : null;
  }

  function findNav(action) {
    return findVisible('[data-global-nav="' + action + '"]');
  }

  function unionRect(selectors) {
    var union = null;
    (selectors || []).forEach(function (sel) {
      var el = findVisible(sel);
      if (!el) return;
      var r = el.getBoundingClientRect();
      if (!union) {
        union = { top: r.top, left: r.left, right: r.right, bottom: r.bottom };
        return;
      }
      union.top = Math.min(union.top, r.top);
      union.left = Math.min(union.left, r.left);
      union.right = Math.max(union.right, r.right);
      union.bottom = Math.max(union.bottom, r.bottom);
    });
    return union;
  }

  function wait(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function navStep(id, action, title, body, extra) {
    return Object.assign(
      {
        id: id,
        title: title,
        body: body,
        selector: '[data-global-nav="' + action + '"]',
        padding: 6,
        beforeShow: async function () {
          if (hooks.ensureIssuesListView) await hooks.ensureIssuesListView();
        },
      },
      extra || {},
    );
  }

  function getSteps() {
    return [
      {
        id: "welcome",
        title: "Добро пожаловать в RM Client",
        body:
          "Краткий тур по интерфейсу: список задач, отчёт, трекер времени, лента изменений. Можно пропустить в любой момент — повтор будет в настройках программы.",
        centered: true,
        beforeShow: async function () {
          if (hooks.ensureIssuesListView) await hooks.ensureIssuesListView();
        },
      },
      {
        id: "scope",
        title: "Область задач",
        body:
          "«Мои» — где вы исполнитель. «Поставленные» — созданные вами. «Отслеживаемые» — наблюдатель. «Избранные» — со звездой. «Все» — полный список по выбранным проектам.",
        selector: "#issue-scope-toggle",
        beforeShow: async function () {
          if (hooks.ensureIssuesListView) await hooks.ensureIssuesListView();
        },
      },
      {
        id: "project-filter",
        title: "Фильтр по проекту",
        body:
          "Один проект или «Все проекты». Список и Agile-доска работают в рамках этого фильтра. Иерархию (дерево) можно включить в Настройки → Синхронизация — это только вид списка, не состав синка.",
        selector: ".project-filter-field",
        beforeShow: async function () {
          if (hooks.ensureIssuesListView) await hooks.ensureIssuesListView();
        },
      },
      {
        id: "search",
        title: "Поиск по тексту",
        body: "Ищет по теме, проекту и автору. Точный номер задачи — кнопка «#» справа; ссылка из браузера — иконка 🔗.",
        selector: ".filters-search-field",
        beforeShow: async function () {
          if (hooks.ensureIssuesListView) await hooks.ensureIssuesListView();
        },
      },
      {
        id: "filters",
        title: "Дополнительные фильтры",
        body: "«+ Фильтр» добавляет статус, приоритет, исполнителя, срок или оценку. Активные фильтры — чипами ниже.",
        selector: "#add-list-filter-btn",
        beforeShow: async function () {
          if (hooks.ensureIssuesListView) await hooks.ensureIssuesListView();
        },
      },
      {
        id: "view-list",
        title: "Список задач",
        body:
          "Таблица с сортировкой, массовыми действиями и быстрым редактированием статуса и срока прямо в строке. В колонке «Часы» наведите на ⏱ — рамка и быстрый ввод трудозатрат.",
        selector: "#view-list-btn",
        padding: 6,
        beforeShow: async function () {
          if (hooks.ensureIssuesListView) await hooks.ensureIssuesListView();
        },
      },
      {
        id: "quick-te",
        title: "Быстрые трудозатраты",
        body:
          "Клик по часам в строке открывает компактный ввод времени. Полная форма — из карточки задачи («Показать все») или из списка записей по задаче. Порядок полей полной формы — в Настройки → Форма трудозатрат.",
        selector: "#issues-list .issue-time-btn, .issues-columns-head [data-col='hours']",
        fallbackSelector: "#issues-list",
        padding: 8,
        beforeShow: async function () {
          if (hooks.ensureIssuesListView) await hooks.ensureIssuesListView();
        },
      },
      {
        id: "create-issue",
        title: "Создание задачи",
        body:
          "«+ Создать задачу» — быстрая форма и кнопка «К полной форме»: обязательные поля, наблюдатели, родительская задача. Описание открывается в отдельном редакторе с картинками.",
        selector: "#create-issue-btn",
        padding: 6,
        beforeShow: async function () {
          if (hooks.ensureIssuesListView) await hooks.ensureIssuesListView();
        },
      },
      {
        id: "view-agile",
        title: "Agile-доска",
        body: "Kanban по статусам: перетаскивайте карточки между колонками. Сначала выберите конкретный проект в фильтре сверху — для «Все проекты» доска недоступна.",
        selector: "#view-agile-btn",
        padding: 6,
        beforeShow: async function () {
          if (hooks.ensureIssuesListView) await hooks.ensureIssuesListView();
        },
      },
      {
        id: "status-scope",
        title: "Открытые и все",
        body: "«Открытые» — активные задачи (включая «Решённый»). «Все» — и закрытые. Переключатель действует на список и фильтры.",
        selector: "#list-scope-controls",
        padding: 6,
        beforeShow: async function () {
          if (hooks.ensureIssuesListView) await hooks.ensureIssuesListView();
        },
      },
      navStep("nav-issues-list", "issues-list", "Список задач (иконка)", "Вернуться к таблице задач из любого экрана — с сохранёнными фильтрами и вкладкой scope."),
      navStep("nav-time-report", "time-report", "Отчёт трудозатрат", "Просмотр уже учтённых часов за период: график, сводки и детализация. Следующий шаг — внутри отчёта."),
      {
        id: "report-toolbar",
        title: "Период отчёта",
        body: "Пресеты (день, неделя, месяц, квартал) или произвольный диапазон дат. Данные берутся из локального кэша — только ваши записи.",
        selector: "#report-view .report-toolbar",
        padding: 8,
        wide: true,
        beforeShow: async function () {
          if (hooks.showReportView) await hooks.showReportView();
        },
      },
      {
        id: "report-tabs",
        title: "Разрезы отчёта",
        body: "Сводка по проекту, заказчику, задаче, виду деятельности или матрица «по дням». Ниже — полный список записей за период.",
        selector: "#report-breakdown-tabs",
        padding: 6,
        beforeShow: async function () {
          if (hooks.showReportView) await hooks.showReportView();
        },
      },
      navStep("nav-tracker", "tracker", "Трекер трудозатрат", "Ввод и выгрузка времени в Redmine. Следующие шаги — как пользоваться таблицей."),
      {
        id: "tracker-period",
        title: "Период в трекере",
        body: "Сегодня, неделя или «Произвольный» — откроется календарь в стиле 1С (можно выделить диапазон мышью). Показываются только ваши записи.",
        selector: "#tracker-view .tracker-toolbar",
        padding: 8,
        wide: true,
        beforeShow: async function () {
          if (hooks.showTrackerView) await hooks.showTrackerView();
        },
      },
      {
        id: "tracker-rows",
        title: "Строки и выгрузка",
        body: "«+ Добавить строку» — новая запись. Укажите проект/задачу, время и деятельность. Отметьте галочкой строки и нажмите «Отправить выбранное» — уйдёт в Redmine. ПКМ по пустому месту строки — копировать.",
        selector: "#tracker-add-row-btn",
        padding: 6,
        wide: true,
        beforeShow: async function () {
          if (hooks.showTrackerView) await hooks.showTrackerView();
        },
      },
      {
        id: "tracker-time",
        title: "Время: начало, конец, часы",
        body:
          "В колонке «Время» три поля: начало и окончание (ЧЧ:ММ) и трудозатраты в часах. Если заданы оба времени — часы пересчитаются сами; правка часов при двух временах сдвигает окончание. Режим работы (таймер / начало–конец / только часы) — в Настройках программы → Трекер. Зелёная полоска — начало, красная — конец.",
        selector: "#tracker-sessions-host .tracker-time-head, #tracker-sessions-host th.tracker-col-time",
        fallbackSelector: "#tracker-view .tracker-toolbar",
        padding: 8,
        wide: true,
        beforeShow: async function () {
          if (hooks.showTrackerView) await hooks.showTrackerView();
        },
      },
      navStep("nav-activity", "activity-feed", "Лента активности", "Изменения по задачам, где вы исполнитель или наблюдатель — без ваших собственных действий."),
      {
        id: "activity-feed",
        title: "Лента активности",
        body: "Комментарии, смена статуса, назначения и файлы от коллег. Настройте длину ленты и типы событий. Badge на иконке — непросмотренные.",
        selector: "#activity-view .activity-toolbar",
        fallbackSelector: "#activity-feed-list",
        padding: 8,
        beforeShow: async function () {
          if (hooks.showActivityView) await hooks.showActivityView();
        },
      },
      navStep("nav-notifications", "notifications", "Уведомления", "Сроки задач (скоро / просрочено) и ошибки синхронизации с Redmine."),
      navStep(
        "nav-settings",
        "settings",
        "Настройки программы",
        "Подключение, синк, трекер, форма трудозатрат, тема, резервные копии, «Что нового» и повтор обучения. Открываются поверх текущего экрана.",
      ),
      {
        id: "sync-footer",
        title: "Синхронизация",
        body: "В подвале — связь с Redmine, очередь невыгруженных изменений и прогресс синка. Проекты и API key — в Настройках программы.",
        selector: "#app-footer",
        padding: 6,
        beforeShow: async function () {
          if (hooks.ensureIssuesListView) await hooks.ensureIssuesListView();
        },
      },
      {
        id: "done",
        title: "Готово",
        body:
          "Тур можно повторить: Настройки → Обучение. Новости релиза — Настройки → Что нового. Удачной работы!",
        centered: true,
        beforeShow: async function () {
          if (hooks.ensureIssuesListView) await hooks.ensureIssuesListView();
        },
      },
    ];
  }

  function resolveTargetRect(step) {
    if (step.selectors && step.selectors.length) return unionRect(step.selectors);
    if (!step.selector || step.centered) return null;
    var el = findVisible(step.selector);
    if (!el && step.fallbackSelector) el = findVisible(step.fallbackSelector);
    if (!el) return null;
    return el.getBoundingClientRect();
  }

  function teardownDom() {
    if (resizeHandler) {
      window.removeEventListener("resize", resizeHandler);
      window.removeEventListener("scroll", resizeHandler, true);
      resizeHandler = null;
    }
    if (overlayEl && overlayEl.parentNode) overlayEl.parentNode.removeChild(overlayEl);
    overlayEl = null;
    spotlightEl = null;
    popoverEl = null;
    document.body.classList.remove("product-tour-active");
  }

  function finishTour() {
    active = false;
    markTourComplete();
    teardownDom();
  }

  async function skipTour() {
    var confirmed = true;
    if (window.desktopApi && window.desktopApi.confirm) {
      confirmed = await window.desktopApi.confirm({
        title: "Пропустить обучение?",
        message: "Тур можно запустить снова в Настройках программы → Обучение.",
        confirmLabel: "Пропустить",
        cancelLabel: "Продолжить тур",
      });
    }
    if (!confirmed) return;
    finishTour();
  }

  function positionSpotlight(rect, padding) {
    if (!spotlightEl) return;
    var pad = Number(padding) || 8;
    if (!rect) {
      spotlightEl.classList.add("hidden");
      return;
    }
    spotlightEl.classList.remove("hidden");
    spotlightEl.style.top = Math.max(0, rect.top - pad) + "px";
    spotlightEl.style.left = Math.max(0, rect.left - pad) + "px";
    spotlightEl.style.width = Math.max(0, rect.width + pad * 2) + "px";
    spotlightEl.style.height = Math.max(0, rect.height + pad * 2) + "px";
  }

  function positionPopover(step, rect) {
    if (!popoverEl) return;
    var margin = 12;
    popoverEl.classList.toggle("product-tour-popover-wide", Boolean(step.wide));
    var popRect = popoverEl.getBoundingClientRect();
    var width = popRect.width || (step.wide ? 420 : 340);
    var height = popRect.height || 180;

    if (step.centered || !rect) {
      popoverEl.style.top = "50%";
      popoverEl.style.left = "50%";
      popoverEl.style.transform = "translate(-50%, -50%)";
      return;
    }

    popoverEl.style.transform = "";
    var top = rect.bottom + margin;
    var left = rect.left + rect.width / 2 - width / 2;
    left = Math.min(Math.max(margin, left), window.innerWidth - width - margin);

    if (top + height > window.innerHeight - margin) {
      top = rect.top - height - margin;
    }
    if (top < margin) top = margin;

    popoverEl.style.top = top + "px";
    popoverEl.style.left = left + "px";
  }

  function renderPopover(step, index, total) {
    if (!popoverEl) return;
    var isFirst = index === 0;
    var isLast = index >= total - 1;
    popoverEl.innerHTML =
      '<div class="product-tour-popover-inner">' +
      '<div class="product-tour-progress">Шаг ' +
      (index + 1) +
      " из " +
      total +
      "</div>" +
      "<h3 class=\"product-tour-title\">" +
      escapeHtml(step.title) +
      "</h3>" +
      '<p class="product-tour-body">' +
      escapeHtml(step.body) +
      "</p>" +
      '<div class="product-tour-actions">' +
      '<button type="button" class="btn-ghost btn-sm product-tour-skip">Пропустить</button>' +
      '<div class="product-tour-actions-main">' +
      (isFirst ? "" : '<button type="button" class="btn-secondary btn-sm product-tour-back">Назад</button>') +
      '<button type="button" class="btn-primary btn-sm product-tour-next">' +
      (isLast ? "Готово" : "Далее") +
      "</button>" +
      "</div></div></div>";

    popoverEl.querySelector(".product-tour-skip")?.addEventListener("click", function () {
      skipTour().catch(function () {
        finishTour();
      });
    });
    popoverEl.querySelector(".product-tour-back")?.addEventListener("click", function () {
      showStep(index - 1).catch(function () {});
    });
    popoverEl.querySelector(".product-tour-next")?.addEventListener("click", function () {
      if (isLast) finishTour();
      else showStep(index + 1).catch(function () {});
    });
  }

  async function showStep(index) {
    var steps = getSteps();
    if (index < 0 || index >= steps.length) return;
    currentIndex = index;
    var step = steps[index];

    if (step.beforeShow) {
      try {
        await step.beforeShow();
      } catch (_) {
        /* continue */
      }
      await wait(160);
    }

    var rect = resolveTargetRect(step);
    if (rect && !(rect.width || rect.height)) {
      rect = null;
    }
    if (rect && rect.width === 0 && rect.height === 0) rect = null;
    if (rect) {
      rect = {
        top: rect.top,
        left: rect.left,
        width: rect.right != null ? rect.right - rect.left : rect.width,
        height: rect.bottom != null ? rect.bottom - rect.top : rect.height,
        bottom: rect.bottom,
      };
    }

    renderPopover(step, index, steps.length);
    positionSpotlight(rect, step.padding);
    positionPopover(step, rect);
    requestAnimationFrame(function () {
      positionPopover(step, rect);
    });
  }

  function ensureDom() {
    if (overlayEl) return;
    document.body.classList.add("product-tour-active");
    overlayEl = document.createElement("div");
    overlayEl.className = "product-tour-overlay";
    overlayEl.setAttribute("role", "presentation");

    spotlightEl = document.createElement("div");
    spotlightEl.className = "product-tour-spotlight";
    spotlightEl.setAttribute("aria-hidden", "true");

    popoverEl = document.createElement("div");
    popoverEl.className = "product-tour-popover";
    popoverEl.setAttribute("role", "dialog");
    popoverEl.setAttribute("aria-modal", "true");
    popoverEl.setAttribute("aria-live", "polite");

    overlayEl.appendChild(spotlightEl);
    overlayEl.appendChild(popoverEl);
    document.body.appendChild(overlayEl);

    resizeHandler = function () {
      if (!active) return;
      var steps = getSteps();
      var step = steps[currentIndex];
      if (!step) return;
      var rect = resolveTargetRect(step);
      if (rect) {
        rect = {
          top: rect.top,
          left: rect.left,
          width: rect.right != null ? rect.right - rect.left : rect.width,
          height: rect.bottom != null ? rect.bottom - rect.top : rect.height,
        };
      }
      positionSpotlight(rect, step.padding);
      positionPopover(step, rect);
    };
    window.addEventListener("resize", resizeHandler);
    window.addEventListener("scroll", resizeHandler, true);
  }

  async function startTour(options) {
    options = options || {};
    if (active) return;
    if (!options.force && isTourComplete()) return;

    active = true;
    if (options.force) clearTourComplete();
    ensureDom();
    await showStep(0);
  }

  function configure(nextHooks) {
    hooks = nextHooks || {};
  }

  function isActive() {
    return active;
  }

  async function handleEscape() {
    if (!active) return;
    await skipTour();
  }

  var api = {
    STORAGE_KEY: STORAGE_KEY,
    getSteps: getSteps,
    findVisible: findVisible,
    findNav: findNav,
    isTourComplete: isTourComplete,
    markTourComplete: markTourComplete,
    clearTourComplete: clearTourComplete,
    configure: configure,
    startTour: startTour,
    isActive: isActive,
    handleEscape: handleEscape,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof window !== "undefined") {
    window.ProductTour = api;
  }
})();
