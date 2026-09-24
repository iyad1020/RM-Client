/** Разметка панели быстрой навигации (дублируется в шапке и на полноэкранных экранах). */
function globalNavIconsMarkup() {
  return `<div class="global-nav-icons" role="toolbar" aria-label="Быстрая навигация">
    <button type="button" class="icon-btn icon-btn-issues" data-global-nav="issues-list" title="Список задач" aria-label="Список задач">
      <svg class="icon-svg" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M8 6h13M8 12h13M8 18h13M4 6h.01M4 12h.01M4 18h.01" />
      </svg>
    </button>
    <button type="button" class="icon-btn" data-global-nav="deep-search" title="Глобальный поиск" aria-label="Глобальный поиск">
      <svg class="icon-svg" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="2" />
        <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M16.5 16.5L21 21" />
      </svg>
    </button>
    <button type="button" class="icon-btn" data-global-nav="time-report" title="Мои трудозатраты за период" aria-label="Отчёт за период">
      <span aria-hidden="true">&#9201;</span>
    </button>
    <button type="button" class="icon-btn icon-btn-tracker" data-global-nav="tracker" title="Трудозатраты (трекер)" aria-label="Трекер">
      <span aria-hidden="true">&#9202;</span>
    </button>
    <button type="button" class="icon-btn" data-global-nav="quick-issue-by-id" title="Открыть задачу по номеру" aria-label="Открыть задачу по номеру">
      <span class="quick-issue-hash" aria-hidden="true">#</span>
    </button>
    <button type="button" class="icon-btn" data-global-nav="open-link" title="Открыть задачу по ссылке" aria-label="Открыть по ссылке">
      <span aria-hidden="true">&#128279;</span>
    </button>
    <div class="activity-feed-icon">
      <button type="button" class="icon-btn" data-global-nav="activity-feed" title="Лента активности" aria-label="Лента активности">
        <svg class="activity-pulse-icon" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            d="M2 12h3l2.5-6 3 12 2.5-6H22" />
        </svg>
        <span class="badge hidden" data-activity-feed-count>0</span>
      </button>
    </div>
    <div class="notifications">
      <button type="button" class="icon-btn" data-global-nav="notifications" title="Сроки и ошибки" aria-label="Сроки и ошибки">
        <span aria-hidden="true">&#128276;</span>
        <span class="badge hidden" data-notifications-count>0</span>
      </button>
    </div>
    <button type="button" class="icon-btn" data-global-nav="settings" title="Настройки подключения" aria-label="Настройки">
      <span aria-hidden="true">&#9881;</span>
    </button>
  </div>`;
}

function mountGlobalNavIcons(host) {
  if (!host || host.dataset.globalNavMounted === "1") return;
  host.innerHTML = globalNavIconsMarkup();
  host.dataset.globalNavMounted = "1";
}

function mountAllGlobalNavIcons(root) {
  const scope = root && root.querySelectorAll ? root : document;
  scope.querySelectorAll("[data-global-nav-host]").forEach((host) => mountGlobalNavIcons(host));
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { globalNavIconsMarkup, mountGlobalNavIcons, mountAllGlobalNavIcons };
}

if (typeof window !== "undefined") {
  window.GlobalNavIcons = { globalNavIconsMarkup, mountGlobalNavIcons, mountAllGlobalNavIcons };
}
