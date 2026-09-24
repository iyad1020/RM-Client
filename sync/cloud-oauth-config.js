/**
 * OAuth client credentials for cloud backup.
 * Priority: user settings → env → sync/cloud-oauth.local.js
 *
 * Yandex: https://oauth.yandex.ru — Redirect URI http://127.0.0.1:42813/callback , right "Яндекс.Диск"
 * Google: Cloud Console → OAuth Desktop — Redirect URI http://127.0.0.1:42814/callback
 */
function loadLocalOverride() {
  try {
    return require("./cloud-oauth.local.js");
  } catch {
    return {};
  }
}

const local = loadLocalOverride();

const cloudOAuthConfig = {
  yandexClientId: String(
    process.env.RM_YANDEX_CLIENT_ID || local.yandexClientId || "",
  ).trim(),
  yandexClientSecret: String(
    process.env.RM_YANDEX_CLIENT_SECRET || local.yandexClientSecret || "",
  ).trim(),
  googleClientId: String(
    process.env.RM_GOOGLE_CLIENT_ID || local.googleClientId || "",
  ).trim(),
  googleClientSecret: String(
    process.env.RM_GOOGLE_CLIENT_SECRET || local.googleClientSecret || "",
  ).trim(),
  yandexFolder: "app:/RM Client/backups",
  googleFolderName: "RM Client backups",
};

function resolveCredentials(provider, settings = {}) {
  if (provider === "yandex") {
    const clientId = String(
      settings.cloudBackupYandexClientId || cloudOAuthConfig.yandexClientId || "",
    ).trim();
    const clientSecret = String(
      settings.cloudBackupYandexClientSecret || cloudOAuthConfig.yandexClientSecret || "",
    ).trim();
    return { clientId, clientSecret, ready: Boolean(clientId) };
  }
  if (provider === "google") {
    const clientId = String(
      settings.cloudBackupGoogleClientId || cloudOAuthConfig.googleClientId || "",
    ).trim();
    const clientSecret = String(
      settings.cloudBackupGoogleClientSecret || cloudOAuthConfig.googleClientSecret || "",
    ).trim();
    return { clientId, clientSecret, ready: Boolean(clientId && clientSecret) };
  }
  return { clientId: "", clientSecret: "", ready: false };
}

function assertConfigured(provider, settings = {}) {
  const creds = resolveCredentials(provider, settings);
  if (provider === "yandex") {
    if (!creds.ready) {
      const err = new Error("NEED_SETUP_YANDEX");
      err.code = "NEED_SETUP";
      err.provider = "yandex";
      throw err;
    }
    return { clientId: creds.clientId, clientSecret: creds.clientSecret };
  }
  if (provider === "google") {
    if (!creds.ready) {
      const err = new Error("NEED_SETUP_GOOGLE");
      err.code = "NEED_SETUP";
      err.provider = "google";
      throw err;
    }
    return { clientId: creds.clientId, clientSecret: creds.clientSecret };
  }
  throw new Error("Неизвестный провайдер облака");
}

module.exports = { cloudOAuthConfig, resolveCredentials, assertConfigured };
