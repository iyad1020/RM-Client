(function () {
  var modal = null;
  var root = null;
  var area = null;
  var errorEl = null;
  var saveBtn = null;
  var cancelBtn = null;
  var editor = null;
  var pendingImages = [];
  var editorReady = false;

  function looksLikeMarkdown(text) {
    return window.TextFormat && typeof window.TextFormat.looksLikeMarkdown === "function"
      ? window.TextFormat.looksLikeMarkdown(text)
      : /(?:^|\n)#{1,6}\s+/.test(String(text || ""));
  }

  function looksLikeHtml(text) {
    return window.TextFormat && typeof window.TextFormat.looksLikeHtml === "function"
      ? window.TextFormat.looksLikeHtml(text)
      : /<(?:p|div|h[1-6]|ul|ol|table|strong)\b/i.test(String(text || ""));
  }

  function toEditorHtml(raw) {
    var value = String(raw || "");
    if (!value.trim()) return "";
    if (window.TextFormat && typeof window.TextFormat.textileToHtml === "function") {
      return window.TextFormat.textileToHtml(value);
    }
    if (looksLikeHtml(value)) return value;
    return value
      .split(/\n{2,}/)
      .map(function (chunk) {
        return "<p>" + String(chunk).replace(/\n/g, "<br>") + "</p>";
      })
      .join("");
  }

  function setError(message) {
    if (!errorEl) return;
    if (!message) {
      errorEl.textContent = "";
      errorEl.classList.add("hidden");
      return;
    }
    errorEl.textContent = message;
    errorEl.classList.remove("hidden");
  }

  function escapeAttr(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;");
  }

  function blobToDataUrl(blob) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () {
        resolve(String(reader.result || ""));
      };
      reader.onerror = function () {
        reject(reader.error || new Error("Не удалось прочитать изображение"));
      };
      reader.readAsDataURL(blob);
    });
  }

  async function prepareImageBlob(blob) {
    var prepare = window.__prepareDescriptionImage;
    if (typeof prepare === "function") {
      return prepare(blob);
    }
    var dataUrl = await blobToDataUrl(blob);
    var filename =
      blob && blob.name && blob.name !== "image.png"
        ? blob.name
        : "clipboard-" + Date.now() + ".png";
    return {
      filename: filename,
      contentType: blob.type || "image/png",
      dataUrl: dataUrl,
      upload: null,
    };
  }

  function trackPendingUpload(upload) {
    if (!upload || !upload.dataBase64) return;
    var exists = pendingImages.some(function (item) {
      return item && item.dataBase64 === upload.dataBase64;
    });
    if (!exists) pendingImages.push(upload);
  }

  function destroyEditor() {
    editorReady = false;
    if (editor) {
      try {
        editor.remove();
      } catch {}
      editor = null;
    }
    if (window.tinymce) {
      try {
        window.tinymce.remove("#description-editor-area");
      } catch {}
    }
  }

  function clipboardHasImage(data) {
    if (!data) return false;
    return Array.from(data.items || []).some(function (item) {
      return item.type && item.type.indexOf("image/") === 0;
    });
  }

  function handleEditorPaste(event) {
    if (!editor || !editorReady) return;
    var data = event.clipboardData;
    if (!data) return;

    // Own image paste path: avoids TinyMCE inserting filename text alongside the
    // bitmap, and keeps alt=filename for upload rewrite matching.
    if (clipboardHasImage(data)) {
      event.preventDefault();
      event.stopPropagation();
      var items = Array.from(data.items || []);
      var imageItem = items.find(function (item) {
        return item.type && item.type.indexOf("image/") === 0;
      });
      if (!imageItem) return;
      var blob = imageItem.getAsFile();
      if (!blob) return;
      prepareImageBlob(blob)
        .then(function (prepared) {
          if (prepared.upload) trackPendingUpload(prepared.upload);
          editor.insertContent(
            '<img src="' +
              prepared.dataUrl +
              '" alt="' +
              escapeAttr(prepared.filename) +
              '">',
          );
        })
        .catch(function (error) {
          setError(error.message || "Не удалось вставить изображение.");
        });
      return;
    }

    var html = data.getData("text/html") || "";
    var text = data.getData("text/plain") || "";
    if (!text.trim()) return;
    if (html && /<(?:p|div|h[1-6]|table|ul|ol)\b/i.test(html) && !looksLikeMarkdown(text)) return;
    if (!looksLikeMarkdown(text)) return;
    event.preventDefault();
    event.stopPropagation();
    var converted = toEditorHtml(text);
    if (!converted) return;
    editor.insertContent(converted);
  }

  function isDarkTheme() {
    return document.documentElement.getAttribute("data-theme") === "dark";
  }

  function createEditor(initialValue) {
    return new Promise(function (resolve, reject) {
      if (!window.tinymce || !area) {
        reject(new Error("TinyMCE не загружен"));
        return;
      }
      destroyEditor();
      pendingImages = [];
      editorReady = false;

      var dark = isDarkTheme();
      window.tinymce
        .init({
          selector: "#description-editor-area",
          base_url: "./vendor/tinymce",
          suffix: ".min",
          license_key: "gpl",
          menubar: false,
          branding: false,
          promotion: false,
          statusbar: true,
          resize: false,
          height: "100%",
          plugins: "lists link image table",
          toolbar:
            "undo redo | blocks | bold italic underline strikethrough | alignleft aligncenter alignright | bullist numlist outdent indent | table tabledelete | link image | removeformat",
          toolbar_mode: "sliding",
          table_toolbar:
            "tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol",
          table_resize_bars: true,
          table_sizing_mode: "relative",
          object_resizing: true,
          image_description: false,
          paste_data_images: true,
          automatic_uploads: true,
          // Must stay false: TinyMCE appends ?timestamp to the returned URL when true,
          // which corrupts data:image/... URLs and shows a broken image icon.
          images_reuse_filename: false,
          convert_urls: false,
          relative_urls: false,
          remove_script_host: false,
          entity_encoding: "raw",
          skin: dark ? "oxide-dark" : "oxide",
          content_css: dark ? "dark" : "default",
          content_style:
            "body { font-family: Segoe UI, Tahoma, sans-serif; font-size: 14px; line-height: 1.45; }" +
            " img { max-width: 100%; height: auto; }" +
            " table { border-collapse: collapse; width: 100%; }" +
            " table td, table th { border: 1px solid #ccc; padding: 6px 8px; }",
          images_upload_handler: function (blobInfo) {
            var blob = blobInfo.blob();
            var suggestedName = typeof blobInfo.filename === "function" ? blobInfo.filename() : "";
            // Keep clipboard filename stable for upload/rewrite matching.
            if (blob && (!blob.name || blob.name === "image.png") && suggestedName) {
              try {
                blob = new File([blob], suggestedName, { type: blob.type || "image/png" });
              } catch {}
            }
            return prepareImageBlob(blob).then(function (prepared) {
              if (prepared.upload) trackPendingUpload(prepared.upload);
              // Returning a data URL is fine with images_reuse_filename:false.
              // addFilter below prevents TinyMCE from re-uploading that data URL.
              return prepared.dataUrl;
            });
          },
          file_picker_types: "image",
          file_picker_callback: function (callback, value, meta) {
            if (meta.filetype !== "image") return;
            var input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.onchange = function () {
              var file = input.files && input.files[0];
              if (!file) return;
              prepareImageBlob(file)
                .then(function (prepared) {
                  if (prepared.upload) trackPendingUpload(prepared.upload);
                  callback(prepared.dataUrl, { alt: prepared.filename, title: prepared.filename });
                })
                .catch(function (error) {
                  setError(error.message || "Не удалось вставить изображение.");
                });
            };
            input.click();
          },
          setup: function (ed) {
            ed.on("init", function () {
              // Only auto-upload blob: images. If we return data: from the handler,
              // TinyMCE would otherwise upload the same bitmap again → duplicate attachments.
              try {
                if (ed.editorUpload && typeof ed.editorUpload.addFilter === "function") {
                  ed.editorUpload.addFilter(function (img) {
                    var src = String((img && img.src) || "");
                    return src.indexOf("blob:") === 0;
                  });
                }
              } catch {}
              ed.setContent(toEditorHtml(initialValue));
              try {
                ed.getBody().addEventListener("paste", handleEditorPaste, true);
              } catch {}
              ed.focus();
              editorReady = true;
            });
          },
        })
        .then(function (editors) {
          editor = editors && editors[0] ? editors[0] : window.tinymce.activeEditor;
          resolve(editor);
        })
        .catch(reject);
    });
  }

  function open(initialValue) {
    if (!modal) init();
    if (!modal || !area) return false;
    if (!window.tinymce) {
      setError("Не удалось загрузить редактор описания.");
      return false;
    }
    setError("");
    modal.classList.remove("hidden");
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.textContent = "Загрузка…";
    }
    createEditor(initialValue)
      .then(function (instance) {
        if (!instance) {
          setError("Не удалось загрузить редактор описания.");
          if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.textContent = "Сохранить";
          }
          return;
        }
        if (saveBtn) {
          saveBtn.disabled = false;
          saveBtn.textContent = "Сохранить";
        }
      })
      .catch(function (error) {
        setError(error.message || "Не удалось загрузить редактор описания.");
        if (saveBtn) {
          saveBtn.disabled = false;
          saveBtn.textContent = "Сохранить";
        }
      });
    return true;
  }

  function close() {
    destroyEditor();
    pendingImages = [];
    setError("");
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.textContent = "Сохранить";
    }
    if (cancelBtn) cancelBtn.disabled = false;
    modal?.classList.add("hidden");
  }

  function getHTML() {
    if (!editor) return "";
    try {
      return String(editor.getContent({ format: "html" }) || "");
    } catch {
      return "";
    }
  }

  function takePendingImages() {
    var html = getHTML();
    var filter =
      window.DescriptionImageUtils && typeof window.DescriptionImageUtils.filterPendingForHtml === "function"
        ? window.DescriptionImageUtils.filterPendingForHtml
        : function (files) {
            return files || [];
          };
    var files = filter(pendingImages, html);
    pendingImages = [];
    return files;
  }

  function setSaving(on) {
    if (!saveBtn) return;
    saveBtn.disabled = Boolean(on);
    saveBtn.textContent = on ? "Сохраняем…" : "Сохранить";
    if (cancelBtn) cancelBtn.disabled = Boolean(on);
    if (editor) {
      try {
        editor.mode.set(on ? "readonly" : "design");
      } catch {}
    }
  }

  function init() {
    modal = document.getElementById("description-editor-modal");
    root = document.getElementById("description-editor-root");
    area = document.getElementById("description-editor-area");
    errorEl = document.getElementById("description-editor-error");
    saveBtn = document.getElementById("description-editor-save-btn");
    cancelBtn = document.getElementById("description-editor-cancel-btn");
    if (!modal) return;

    cancelBtn?.addEventListener("click", function () {
      if (saveBtn?.disabled) return;
      close();
    });

    var backdropDown = false;
    modal.addEventListener("mousedown", function (e) {
      if (e.button !== 0) return;
      backdropDown = e.target === modal;
    });
    modal.addEventListener("mouseup", function (e) {
      if (e.button !== 0) {
        backdropDown = false;
        return;
      }
      if (backdropDown && e.target === modal && !saveBtn?.disabled) close();
      backdropDown = false;
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal && !modal.classList.contains("hidden") && !saveBtn?.disabled) {
        close();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", init);

  window.DescriptionEditor = {
    open: open,
    close: close,
    getHTML: getHTML,
    takePendingImages: takePendingImages,
    setSaving: setSaving,
    setError: setError,
    isOpen: function () {
      return Boolean(modal && !modal.classList.contains("hidden"));
    },
  };
})();
