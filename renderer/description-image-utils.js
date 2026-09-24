(function (exports) {
  function filterPendingForHtml(files, html) {
    var source = String(html || "");
    var list = Array.isArray(files) ? files : [];
    return list.filter(function (file) {
      if (!file) return false;
      var name = String(file.filename || "");
      if (name && source.indexOf(name) !== -1) return true;
      var b64 = String(file.dataBase64 || "");
      if (b64 && source.indexOf(b64) !== -1) return true;
      return false;
    });
  }

  function normalizeDataImageSrc(src) {
    var raw = String(src || "").trim();
    if (raw.indexOf("data:image/") !== 0) return raw;
    var q = raw.indexOf("?");
    return q === -1 ? raw : raw.slice(0, q);
  }

  exports.filterPendingForHtml = filterPendingForHtml;
  exports.normalizeDataImageSrc = normalizeDataImageSrc;
})(typeof module !== "undefined" && module.exports ? module.exports : (window.DescriptionImageUtils = {}));
