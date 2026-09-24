# Публикация RM Client на GitHub (для коллег)

## Вердикт безопасности (исходники)

| Что | Статус |
|-----|--------|
| API key / пароли Redmine в репо | Нет — только в `%APPDATA%\rm-client\settings.json` (шифр safeStorage) |
| `cache.db`, локальные бэкапы | В `.gitignore` (`*.db*`) |
| `.env`, `cloud-oauth.local.js` | В `.gitignore` |
| Хардкод секретов в коде | Не найдено |
| Скриншот с реальным логином (`api-key-hint.png`) | Удалён |
| Мёртвые `renderer/uploads/`, `_recovered_*` | Убраны из git-индекса + ignore |

Рекомендация: репозиторий **Private**. Коллеги клонируют код; каждый вводит **свой** URL Redmine и API key при онбординге.

## Перед первым push

1. Проверьте, что не попадут:
   - `%APPDATA%\rm-client\` (не в папке проекта — ок)
   - `.env*`, `sync/cloud-oauth.local.js`
   - установщики `.exe`, `dist/`, `C:\Temp\RMClientDist`
2. В GitHub Desktop / `git status` не должно быть `settings.json`, `*.db`, `node_modules`.

## Создать репозиторий

1. [github.com/new](https://github.com/new) → имя например `rm-client` → **Private**.
2. Не добавляйте README/gitignore на сайте (локальный git уже есть).
3. GitHub Desktop: Add Local Repository → `D:\RM Client` → Publish (оставьте private).

Или вручную:

```powershell
cd "D:\RM Client"
git remote add origin https://github.com/<org-or-user>/rm-client.git
git push -u origin HEAD
```

## Как раздать коллегам

1. Invite в private repo (Settings → Collaborators / org team).
2. Коллега: `git clone` → `npm install` → `npm run rebuild` → `npm start`.
3. При первом запуске — онбординг: URL Redmine + **свой** API key.

> `git pull` обновляет **исходники у разработчика**, не установленный Setup у пользователей. Для «раздачи exe» позже: Releases + установщик.

## Что коллегам не коммитить

- Свои `settings.json` / скриншоты с ключами
- Локальные `cloud-oauth.local.js` (если вернёте облако)
- Дампы очереди / БД из скриптов `scripts/*`

Скрипты `scripts/*-32573.js` читают **ваш** `%APPDATA%` локально — секретов в файлах нет, но это отладочные утилиты; для чистого репо можно не трогать или вынести позже.
