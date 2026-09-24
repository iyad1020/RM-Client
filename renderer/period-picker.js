/** Month indices 0–11 */

const MONTH_LABELS_RU = [
  "Янв",
  "Фев",
  "Мар",
  "Апр",
  "Май",
  "Июн",
  "Июл",
  "Авг",
  "Сен",
  "Окт",
  "Ноя",
  "Дек",
];

function pad2(n) {
  return String(n).padStart(2, "0");
}

function isoDateFromParts(y, m, d) {
  return `${y}-${pad2(m)}-${pad2(d)}`;
}

function parseIsoDate(iso) {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(String(iso))) return null;
  const [y, m, d] = String(iso).split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  if (Number.isNaN(dt.getTime())) return null;
  return dt;
}

function lastDayOfMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

/** @returns {{ from: string, to: string }} inclusive ISO range for calendar month */
function monthRangeToIso(year, monthIndex) {
  const from = isoDateFromParts(year, monthIndex + 1, 1);
  const to = isoDateFromParts(year, monthIndex + 1, lastDayOfMonth(year, monthIndex));
  return { from, to };
}

function normalizeRange(from, to) {
  const a = String(from || "").slice(0, 10);
  const b = String(to || "").slice(0, 10);
  if (!a || !b) return { from: a, to: b };
  if (a > b) return { from: b, to: a };
  return { from: a, to: b };
}

function todayIsoLocal() {
  const d = new Date();
  return isoDateFromParts(d.getFullYear(), d.getMonth() + 1, d.getDate());
}

function offsetDayIso(dayOffset, base = new Date()) {
  const d = new Date(base.getFullYear(), base.getMonth(), base.getDate());
  d.setDate(d.getDate() + dayOffset);
  return isoDateFromParts(d.getFullYear(), d.getMonth() + 1, d.getDate());
}

function weekRangeIso(base = new Date()) {
  const d = new Date(base.getFullYear(), base.getMonth(), base.getDate());
  const day = (d.getDay() + 6) % 7;
  const start = new Date(d);
  start.setDate(d.getDate() - day);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return {
    from: isoDateFromParts(start.getFullYear(), start.getMonth() + 1, start.getDate()),
    to: isoDateFromParts(end.getFullYear(), end.getMonth() + 1, end.getDate()),
  };
}

function monthPresetIso(base = new Date()) {
  const y = base.getFullYear();
  const m = base.getMonth();
  return monthRangeToIso(y, m);
}

function decadePresetIso(base = new Date()) {
  const y = base.getFullYear();
  const m = base.getMonth();
  const day = base.getDate();
  let fromDay = 1;
  let toDay = 10;
  if (day > 20) {
    fromDay = 21;
    toDay = lastDayOfMonth(y, m);
  } else if (day > 10) {
    fromDay = 11;
    toDay = 20;
  }
  return {
    from: isoDateFromParts(y, m + 1, fromDay),
    to: isoDateFromParts(y, m + 1, toDay),
  };
}

function quarterPresetIso(base = new Date()) {
  const y = base.getFullYear();
  const q = Math.floor(base.getMonth() / 3);
  const startMonth = q * 3;
  const endMonth = startMonth + 2;
  return {
    from: monthRangeToIso(y, startMonth).from,
    to: monthRangeToIso(y, endMonth).to,
  };
}

function halfYearPresetIso(base = new Date()) {
  const y = base.getFullYear();
  const firstHalf = base.getMonth() < 6;
  return firstHalf
    ? { from: `${y}-01-01`, to: `${y}-06-30` }
    : { from: `${y}-07-01`, to: `${y}-12-31` };
}

function yearPresetIso(base = new Date()) {
  const y = base.getFullYear();
  return { from: `${y}-01-01`, to: `${y}-12-31` };
}

function getPresetRange(preset, base = new Date()) {
  switch (preset) {
    case "yesterday": {
      const t = offsetDayIso(-1, base);
      return { from: t, to: t };
    }
    case "tomorrow": {
      const t = offsetDayIso(1, base);
      return { from: t, to: t };
    }
    case "today":
    case "day": {
      const t = todayIsoLocal();
      return { from: t, to: t };
    }
    case "week":
      return weekRangeIso(base);
    case "decade":
      return decadePresetIso(base);
    case "month":
      return monthPresetIso(base);
    case "quarter":
      return quarterPresetIso(base);
    case "halfyear":
      return halfYearPresetIso(base);
    case "year":
      return yearPresetIso(base);
    default:
      return weekRangeIso(base);
  }
}

function monthIndexFromIso(iso) {
  const d = parseIsoDate(iso);
  if (!d) return null;
  return { year: d.getFullYear(), month: d.getMonth() };
}

function monthKey(year, monthIndex) {
  return Number(year) * 12 + Number(monthIndex);
}

function rangeFromMonthPoints(a, b) {
  const ka = monthKey(a.year, a.month);
  const kb = monthKey(b.year, b.month);
  const start = ka <= kb ? a : b;
  const end = ka <= kb ? b : a;
  return {
    from: monthRangeToIso(start.year, start.month).from,
    to: monthRangeToIso(end.year, end.month).to,
  };
}

function isMonthInRange(year, monthIndex, fromIso, toIso) {
  const cellFrom = monthRangeToIso(year, monthIndex).from;
  const cellTo = monthRangeToIso(year, monthIndex).to;
  const from = String(fromIso || "").slice(0, 10);
  const to = String(toIso || "").slice(0, 10);
  if (!from || !to) return false;
  return cellFrom <= to && cellTo >= from;
}

/**
 * @param {object} options
 * @param {HTMLElement} options.host
 * @param {HTMLInputElement} options.fromInput
 * @param {HTMLInputElement} options.toInput
 * @param {() => void} [options.onChange]
 * @param {() => void|Promise<void>} [options.onApply]
 */
function mountPeriodPicker(options) {
  const host = options.host;
  const fromInput = options.fromInput;
  const toInput = options.toInput;
  const hideToggle = options.hideToggle === true;
  if (!host || !fromInput || !toInput) return null;

  let anchorYear = new Date().getFullYear();
  let panelOpen = false;
  let customMode = false;
  let dragAnchor = null;
  let isDragging = false;
  let clickAnchor = null;

  const toggleBtn = document.createElement("button");
  toggleBtn.type = "button";
  toggleBtn.className = "btn-secondary btn-sm period-picker-toggle";
  toggleBtn.title = "Выбрать период";
  toggleBtn.setAttribute("aria-label", "Выбрать период");
  toggleBtn.textContent = "📅";

  const panel = document.createElement("div");
  panel.className = "period-picker-panel hidden";
  panel.setAttribute("role", "dialog");
  panel.innerHTML = `
    <div class="period-picker-title">Выберите период</div>
    <div class="period-picker-date-row">
      <label class="period-picker-date-field">
        <span>С</span>
        <input type="date" data-custom-from aria-label="Дата начала периода" />
      </label>
      <label class="period-picker-date-field">
        <span>По</span>
        <input type="date" data-custom-to aria-label="Дата окончания периода" />
      </label>
    </div>
    <div class="period-picker-standards-view" data-standards-view>
      <div class="period-picker-relative-list">
        <button type="button" class="period-picker-relative" data-relative="yesterday">Вчера</button>
        <button type="button" class="period-picker-relative" data-relative="today">Сегодня</button>
        <button type="button" class="period-picker-relative" data-relative="tomorrow">Завтра</button>
      </div>
      <div class="period-picker-preset-col">
        <button type="button" data-preset="day">День</button>
        <button type="button" data-preset="week">Неделя</button>
        <button type="button" data-preset="decade">Декада</button>
        <button type="button" data-preset="month">Месяц</button>
        <button type="button" data-preset="quarter">Квартал</button>
        <button type="button" data-preset="halfyear">Полугодие</button>
        <button type="button" data-preset="year">Год</button>
      </div>
    </div>
    <div class="period-picker-custom-view hidden" data-custom-view>
      <p class="period-picker-custom-hint">Или выделите месяцы ниже (зажатая ЛКМ) — даты сверху обновятся.</p>
      <div class="period-picker-header">
        <button type="button" class="period-picker-nav" data-nav="-1" aria-label="Предыдущие годы">‹</button>
        <div class="period-picker-years" data-years></div>
        <button type="button" class="period-picker-nav" data-nav="1" aria-label="Следующие годы">›</button>
      </div>
    </div>
    <div class="period-picker-footer">
      <button type="button" class="link-btn period-picker-mode-toggle" data-mode-toggle>Показать произвольный период</button>
      <div class="period-picker-actions">
        <button type="button" class="btn-secondary btn-sm" data-cancel>Отмена</button>
        <button type="button" class="btn-primary btn-sm" data-apply>Выбрать</button>
      </div>
    </div>
  `;

  if (!hideToggle) host.appendChild(toggleBtn);
  host.appendChild(panel);

  const yearsEl = panel.querySelector("[data-years]");
  const standardsView = panel.querySelector("[data-standards-view]");
  const customView = panel.querySelector("[data-custom-view]");
  const modeToggle = panel.querySelector("[data-mode-toggle]");
  const applyBtn = panel.querySelector("[data-apply]");
  const customFromInput = panel.querySelector("[data-custom-from]");
  const customToInput = panel.querySelector("[data-custom-to]");
  let activePresetKey = "";

  function markActivePreset(key) {
    activePresetKey = key || "";
    panel.querySelectorAll("[data-relative], [data-preset]").forEach((btn) => {
      const rel = btn.getAttribute("data-relative");
      const preset = btn.getAttribute("data-preset");
      const match = (rel && rel === activePresetKey) || (preset && preset === activePresetKey);
      btn.classList.toggle("is-selected", Boolean(match));
    });
  }

  function syncInputs(from, to, { notify = true, presetKey } = {}) {
    const norm = normalizeRange(from, to);
    fromInput.value = norm.from;
    toInput.value = norm.to;
    if (customFromInput && customFromInput !== document.activeElement) {
      customFromInput.value = norm.from || "";
    }
    if (customToInput && customToInput !== document.activeElement) {
      customToInput.value = norm.to || "";
    }
    if (presetKey !== undefined) markActivePreset(presetKey);
    else if (!activePresetKey) markActivePreset("");
    renderGrid();
    if (notify) options.onChange?.();
  }

  function applyManualDates() {
    const from = (customFromInput?.value || "").trim();
    const to = (customToInput?.value || "").trim();
    if (!from && !to) return;
    const norm = normalizeRange(from || to, to || from);
    syncInputs(norm.from, norm.to, { presetKey: "" });
  }

  function setCustomMode(on) {
    customMode = Boolean(on);
    standardsView?.classList.toggle("hidden", customMode);
    customView?.classList.toggle("hidden", !customMode);
    if (modeToggle) {
      modeToggle.textContent = customMode
        ? "Показать стандартные периоды"
        : "Показать произвольный период";
    }
    if (customFromInput) customFromInput.value = fromInput.value || "";
    if (customToInput) customToInput.value = toInput.value || "";
    if (customMode) renderGrid();
  }

  function applyMonthRange(start, end) {
    const range = rangeFromMonthPoints(start, end);
    syncInputs(range.from, range.to, { presetKey: "" });
  }

  function renderGrid() {
    if (!yearsEl) return;
    const from = fromInput.value;
    const to = toInput.value;
    yearsEl.innerHTML = "";
    for (let y = anchorYear; y < anchorYear + 3; y += 1) {
      const col = document.createElement("div");
      col.className = "period-picker-year-col";
      col.innerHTML = `<div class="period-picker-year-title">${y}</div>`;
      const grid = document.createElement("div");
      grid.className = "period-picker-month-grid";
      MONTH_LABELS_RU.forEach((label, monthIndex) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "period-picker-month";
        btn.textContent = label;
        btn.dataset.year = String(y);
        btn.dataset.month = String(monthIndex);
        if (isMonthInRange(y, monthIndex, from, to)) btn.classList.add("in-range");
        const start = monthRangeToIso(y, monthIndex).from;
        const end = monthRangeToIso(y, monthIndex).to;
        if (from === start) btn.classList.add("range-start");
        if (to === end) btn.classList.add("range-end");
        grid.appendChild(btn);
      });
      col.appendChild(grid);
      yearsEl.appendChild(col);
    }
  }

  function openPanel(opts = {}) {
    panelOpen = true;
    panel.classList.remove("hidden");
    if (!hideToggle) toggleBtn.setAttribute("aria-expanded", "true");
    const customBtn = document.getElementById("tracker-period-custom-btn");
    customBtn?.setAttribute("aria-expanded", "true");
    const fromMeta = monthIndexFromIso(fromInput.value);
    if (fromMeta) anchorYear = fromMeta.year;
    if (!fromInput.value || !toInput.value) {
      const today = todayIsoLocal();
      syncInputs(fromInput.value || today, toInput.value || fromInput.value || today, {
        notify: false,
        presetKey: "",
      });
    } else {
      syncInputs(fromInput.value, toInput.value, { notify: false, presetKey: activePresetKey });
    }
    setCustomMode(opts.custom === true);
    renderGrid();
  }

  function closePanel() {
    panelOpen = false;
    panel.classList.add("hidden");
    if (!hideToggle) toggleBtn.setAttribute("aria-expanded", "false");
    const customBtn = document.getElementById("tracker-period-custom-btn");
    customBtn?.setAttribute("aria-expanded", "false");
    isDragging = false;
    dragAnchor = null;
    clickAnchor = null;
  }

  if (!hideToggle) {
    toggleBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      if (panelOpen) closePanel();
      else openPanel();
    });
  }

  panel.addEventListener("click", async (event) => {
    const relativeBtn = event.target.closest("[data-relative]");
    if (relativeBtn) {
      const key = relativeBtn.getAttribute("data-relative");
      const range = getPresetRange(key);
      syncInputs(range.from, range.to, { presetKey: key });
      return;
    }
    const presetBtn = event.target.closest("[data-preset]");
    if (presetBtn) {
      const key = presetBtn.getAttribute("data-preset");
      const range = getPresetRange(key);
      syncInputs(range.from, range.to, { presetKey: key });
      return;
    }
    if (event.target.closest("[data-mode-toggle]")) {
      setCustomMode(!customMode);
      return;
    }
    const nav = event.target.closest("[data-nav]");
    if (nav) {
      anchorYear += Number(nav.getAttribute("data-nav")) * 3;
      renderGrid();
      return;
    }
    if (event.target.closest("[data-cancel]")) {
      closePanel();
      return;
    }
    if (event.target.closest("[data-apply]")) {
      const norm = normalizeRange(fromInput.value, toInput.value);
      if (!norm.from || !norm.to) return;
      syncInputs(norm.from, norm.to, { presetKey: activePresetKey });
      const btn = applyBtn;
      if (btn) {
        btn.disabled = true;
        const prev = btn.textContent;
        btn.textContent = "Загружаем…";
        try {
          await options.onApply?.();
          closePanel();
        } finally {
          btn.disabled = false;
          btn.textContent = prev;
        }
      }
      return;
    }
    const monthBtn = event.target.closest(".period-picker-month");
    if (monthBtn && !isDragging) {
      const y = Number(monthBtn.dataset.year);
      const m = Number(monthBtn.dataset.month);
      const point = { year: y, month: m };
      if (!clickAnchor) {
        clickAnchor = point;
        const range = monthRangeToIso(y, m);
        syncInputs(range.from, range.to, { presetKey: "" });
      } else {
        applyMonthRange(clickAnchor, point);
        clickAnchor = null;
      }
    }
  });

  yearsEl?.addEventListener("mousedown", (event) => {
    const monthBtn = event.target.closest(".period-picker-month");
    if (!monthBtn) return;
    event.preventDefault();
    isDragging = true;
    clickAnchor = null;
    dragAnchor = { year: Number(monthBtn.dataset.year), month: Number(monthBtn.dataset.month) };
    applyMonthRange(dragAnchor, dragAnchor);
  });

  yearsEl?.addEventListener("mouseover", (event) => {
    if (!isDragging || !dragAnchor) return;
    const monthBtn = event.target.closest(".period-picker-month");
    if (!monthBtn) return;
    applyMonthRange(dragAnchor, {
      year: Number(monthBtn.dataset.year),
      month: Number(monthBtn.dataset.month),
    });
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });

  fromInput.addEventListener("change", () => {
    const norm = normalizeRange(fromInput.value, toInput.value);
    syncInputs(norm.from, norm.to, { notify: true });
  });
  toInput.addEventListener("change", () => {
    const norm = normalizeRange(fromInput.value, toInput.value);
    syncInputs(norm.from, norm.to, { notify: true });
  });

  customFromInput?.addEventListener("change", applyManualDates);
  customToInput?.addEventListener("change", applyManualDates);
  customFromInput?.addEventListener("input", () => {
    if (customFromInput.value && customToInput?.value) applyManualDates();
  });
  customToInput?.addEventListener("input", () => {
    if (customFromInput?.value && customToInput.value) applyManualDates();
  });

  let datePickerActive = false;
  const markDatePickerActive = () => {
    datePickerActive = true;
  };
  const clearDatePickerActive = () => {
    setTimeout(() => {
      datePickerActive = false;
    }, 250);
  };
  customFromInput?.addEventListener("focus", markDatePickerActive);
  customToInput?.addEventListener("focus", markDatePickerActive);
  customFromInput?.addEventListener("blur", clearDatePickerActive);
  customToInput?.addEventListener("blur", clearDatePickerActive);

  document.addEventListener("click", (event) => {
    if (!panelOpen) return;
    if (datePickerActive) return;
    if (host.contains(event.target)) return;
    if (event.target.closest("#tracker-period-custom-btn")) return;
    closePanel();
  });

  return { renderGrid, openPanel, closePanel, syncInputs, setCustomMode };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    MONTH_LABELS_RU,
    monthRangeToIso,
    normalizeRange,
    getPresetRange,
    isMonthInRange,
    rangeFromMonthPoints,
    mountPeriodPicker,
  };
}

if (typeof window !== "undefined") {
  window.PeriodPicker = {
    MONTH_LABELS_RU,
    monthRangeToIso,
    normalizeRange,
    getPresetRange,
    isMonthInRange,
    rangeFromMonthPoints,
    mountPeriodPicker,
  };
}
