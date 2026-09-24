/** Merge Redmine custom field definitions with issue values. */
(function (factory) {
  const api = factory();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  if (typeof window !== "undefined") {
    window.CustomFieldForm = api;
  }
})(function createCustomFieldForm() {
  const SIMPLE_EDIT_FORMATS = new Set(["string", "text", "link", "float", "int"]);
  const CREATE_EDIT_FORMATS = new Set([
    "string",
    "text",
    "link",
    "float",
    "int",
    "list",
    "enumeration",
    "bool",
    "date",
  ]);

  function normalizeFieldFormat(field) {
    return String(field?.field_format || field?.format || "string").toLowerCase();
  }

  function isSimpleEditableField(field) {
    return SIMPLE_EDIT_FORMATS.has(normalizeFieldFormat(field));
  }

  function isCreateEditableField(field) {
    return CREATE_EDIT_FORMATS.has(normalizeFieldFormat(field));
  }

  function possibleValueLabel(entry) {
    if (entry == null) return "";
    if (typeof entry === "string" || typeof entry === "number") return String(entry);
    return String(entry.label ?? entry.value ?? entry.name ?? "");
  }

  function possibleValueValue(entry) {
    if (entry == null) return "";
    if (typeof entry === "string" || typeof entry === "number") return String(entry);
    return String(entry.value ?? entry.label ?? entry.name ?? "");
  }

  /**
   * @param {object[]} defs from /issues/new.json
   * @param {object[]} values from issue.custom_fields
   */
  function mergeCustomFieldRows(defs = [], values = []) {
    const valueById = new Map();
    (values || []).forEach((field) => {
      const id = Number(field?.id ?? field?.field_id);
      if (!Number.isFinite(id)) return;
      const raw = field?.value ?? field?.field_value;
      const value = Array.isArray(raw) ? raw.join(", ") : String(raw ?? "");
      valueById.set(id, value);
    });

    const rows = (defs || []).map((def) => {
      const id = Number(def.id);
      const name = def.name || def.field_name || `#${id}`;
      const format = normalizeFieldFormat(def);
      const value = valueById.has(id) ? valueById.get(id) : "";
      return {
        id,
        name,
        format,
        value,
        isRequired: Boolean(def.is_required),
        multiple: Boolean(def.multiple),
        possibleValues: def.possible_values || [],
        editable: isSimpleEditableField(def),
      };
    });

    valueById.forEach((value, id) => {
      if (rows.some((r) => r.id === id)) return;
      const raw = (values || []).find((field) => Number(field?.id ?? field?.field_id) === id);
      const name = raw?.name || raw?.field_name || `Поле #${id}`;
      const format = normalizeFieldFormat(raw || {});
      rows.push({
        id,
        name,
        format,
        value,
        isRequired: false,
        multiple: Boolean(raw?.multiple),
        possibleValues: raw?.possible_values || [],
        editable: isSimpleEditableField({ field_format: format }),
      });
    });

    return rows.sort((a, b) => String(a.name).localeCompare(String(b.name), "ru"));
  }

  /** Required fields for quick create (project+tracker form defs). */
  function requiredCreateFieldRows(defs = []) {
    return (defs || [])
      .filter((def) => Boolean(def?.is_required) && Number.isFinite(Number(def.id)))
      .map((def) => {
        const format = normalizeFieldFormat(def);
        return {
          id: Number(def.id),
          name: def.name || def.field_name || `#${def.id}`,
          format,
          value: "",
          isRequired: true,
          multiple: Boolean(def.multiple),
          possibleValues: def.possible_values || [],
          editable: isCreateEditableField(def),
        };
      })
      .sort((a, b) => String(a.name).localeCompare(String(b.name), "ru"));
  }

  function escapeHtml(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderCustomFieldsViewHtml(rows) {
    if (!rows.length) return "";
    return rows
      .map(
        (row) =>
          `<div class="kv-key">${escapeHtml(row.name)}</div><div class="kv-value" data-cf-id="${row.id}">${escapeHtml(row.value || "—")}</div>`,
      )
      .join("");
  }

  function renderCustomFieldsEditHtml(rows) {
    if (!rows.length) return "";
    return rows
      .map((row) => {
        const req = row.isRequired ? `<span class="req">*</span>` : "";
        const id = `edit-cf-${row.id}`;
        if (!row.editable) {
          return `<div class="field-row cf-readonly">
          <label>${escapeHtml(row.name)}</label>
          <div class="muted cf-readonly-value">${escapeHtml(row.value || "—")}</div>
          <span class="field-hint">Редактирование этого типа поля пока недоступно</span>
        </div>`;
        }
        const format = row.format;
        if (format === "text") {
          return `<div class="field-row" data-cf-row="${row.id}">
          <label for="${id}">${escapeHtml(row.name)} ${req}</label>
          <textarea id="${id}" data-cf-id="${row.id}" rows="2">${escapeHtml(row.value || "")}</textarea>
        </div>`;
        }
        const inputType = format === "int" || format === "float" ? "number" : "text";
        const step = format === "float" ? ' step="any"' : "";
        return `<div class="field-row" data-cf-row="${row.id}">
        <label for="${id}">${escapeHtml(row.name)} ${req}</label>
        <input type="${inputType}" id="${id}" data-cf-id="${row.id}" value="${escapeHtml(row.value || "")}"${step} />
      </div>`;
      })
      .join("");
  }

  function renderCreateCustomFieldsHtml(rows) {
    if (!rows.length) return "";
    return rows
      .map((row) => {
        const req = row.isRequired ? `<span class="req">*</span>` : "";
        const requiredAttr = row.isRequired ? ' data-cf-required="1"' : "";
        const id = `create-cf-${row.id}`;
        const error = row.isRequired ? `<span class="field-error">Обязательное поле</span>` : "";
        if (!row.editable) {
          if (!row.isRequired) {
            return `<div class="field-row cf-readonly" data-cf-row="${row.id}">
            <label>${escapeHtml(row.name)}</label>
            <div class="muted">Тип «${escapeHtml(row.format)}» пока недоступен в форме создания</div>
          </div>`;
          }
          return `<div class="field-row invalid" data-cf-row="${row.id}"${requiredAttr}>
          <label>${escapeHtml(row.name)} ${req}</label>
          <div class="muted">Тип поля «${escapeHtml(row.format)}» пока нельзя заполнить здесь — откройте задачу в Redmine.</div>
          <span class="field-error">Недоступно в форме</span>
        </div>`;
        }
        if (row.format === "bool") {
          return `<div class="field-row" data-cf-row="${row.id}"${requiredAttr}>
          <label class="checklist-item" for="${id}">
            <input type="checkbox" id="${id}" data-cf-id="${row.id}" data-cf-format="bool" />
            ${escapeHtml(row.name)} ${req}
          </label>
          ${error}
        </div>`;
        }
        if (row.format === "date") {
          return `<div class="field-row" data-cf-row="${row.id}"${requiredAttr}>
          <label for="${id}">${escapeHtml(row.name)} ${req}</label>
          <input type="date" id="${id}" data-cf-id="${row.id}" data-cf-format="date" />
          ${error}
        </div>`;
        }
        if (row.format === "list" || row.format === "enumeration") {
          const options = (row.possibleValues || [])
            .map((entry) => {
              const value = possibleValueValue(entry);
              const label = possibleValueLabel(entry) || value;
              return `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`;
            })
            .join("");
          if (row.multiple) {
            return `<div class="field-row" data-cf-row="${row.id}"${requiredAttr}>
            <label for="${id}">${escapeHtml(row.name)} ${req}</label>
            <select id="${id}" data-cf-id="${row.id}" data-cf-format="list" multiple size="${Math.min(6, Math.max(3, (row.possibleValues || []).length || 3))}">
              ${options}
            </select>
            ${error}
          </div>`;
          }
          return `<div class="field-row" data-cf-row="${row.id}"${requiredAttr}>
          <label for="${id}">${escapeHtml(row.name)} ${req}</label>
          <select id="${id}" data-cf-id="${row.id}" data-cf-format="list">
            <option value="">— выберите —</option>
            ${options}
          </select>
          ${error}
        </div>`;
        }
        if (row.format === "text") {
          return `<div class="field-row" data-cf-row="${row.id}"${requiredAttr}>
          <label for="${id}">${escapeHtml(row.name)} ${req}</label>
          <textarea id="${id}" data-cf-id="${row.id}" rows="2"></textarea>
          ${error}
        </div>`;
        }
        const inputType = row.format === "int" || row.format === "float" ? "number" : "text";
        const step = row.format === "float" ? ' step="any"' : "";
        return `<div class="field-row" data-cf-row="${row.id}"${requiredAttr}>
        <label for="${id}">${escapeHtml(row.name)} ${req}</label>
        <input type="${inputType}" id="${id}" data-cf-id="${row.id}"${step} />
        ${error}
      </div>`;
      })
      .join("");
  }

  /** All create-form fields (required + optional) for full mode. */
  function allCreateFieldRows(defs = []) {
    return (defs || [])
      .filter((def) => Number.isFinite(Number(def.id)))
      .map((def) => {
        const format = normalizeFieldFormat(def);
        return {
          id: Number(def.id),
          name: def.name || def.field_name || `#${def.id}`,
          format,
          value: "",
          isRequired: Boolean(def.is_required),
          multiple: Boolean(def.multiple),
          possibleValues: def.possible_values || [],
          editable: isCreateEditableField(def),
        };
      })
      .sort((a, b) => {
        if (a.isRequired !== b.isRequired) return a.isRequired ? -1 : 1;
        return String(a.name).localeCompare(String(b.name), "ru");
      });
  }

  function collectCustomFieldsPatch(formRoot) {
    if (!formRoot) return [];
    const patch = [];
    const seen = new Set();
    formRoot.querySelectorAll("[data-cf-id]").forEach((el) => {
      if (el.closest(".cf-readonly")) return;
      const id = Number(el.getAttribute("data-cf-id"));
      if (!Number.isFinite(id) || seen.has(id)) return;
      seen.add(id);
      const format = String(el.getAttribute("data-cf-format") || "").toLowerCase();
      if (el.tagName === "SELECT" && el.multiple) {
        const selected = Array.from(el.selectedOptions || []).map((opt) => opt.value).filter(Boolean);
        patch.push({ id, value: selected });
        return;
      }
      if (format === "bool" || el.type === "checkbox") {
        patch.push({ id, value: el.checked ? "1" : "0" });
        return;
      }
      const value = "value" in el ? String(el.value ?? "") : String(el.textContent ?? "");
      patch.push({ id, value });
    });
    return patch;
  }

  function validateRequiredCreateFields(formRoot) {
    if (!formRoot) return [];
    const missing = [];
    formRoot.querySelectorAll("[data-cf-row][data-cf-required]").forEach((row) => {
      const id = Number(row.getAttribute("data-cf-row"));
      const input = row.querySelector("[data-cf-id]");
      if (!input) {
        missing.push({ id, name: row.querySelector("label")?.textContent || `#${id}` });
        row.classList.add("invalid");
        return;
      }
      let empty = false;
          if (input.tagName === "SELECT" && input.multiple) {
            empty = Array.from(input.selectedOptions || []).length === 0;
          } else if (input.type === "checkbox") {
            // Bool always has a value (checked/unchecked → 1/0).
            empty = false;
          } else {
            empty = !String(input.value || "").trim();
          }
      row.classList.toggle("invalid", empty);
      if (empty) {
        missing.push({
          id,
          name: (row.querySelector("label")?.textContent || `#${id}`).replace(/\s*\*\s*$/, "").trim(),
        });
      }
    });
    return missing;
  }

  function defsFromIssueValues(values = []) {
    return (values || [])
      .map((field) => {
        const id = Number(field?.id ?? field?.field_id);
        if (!Number.isFinite(id)) return null;
        return {
          id,
          name: field.name || field.field_name || `Поле #${id}`,
          field_format: field.field_format || field.format || "string",
          possible_values: field.possible_values || [],
          is_required: Boolean(field.is_required),
          multiple: Boolean(field.multiple),
        };
      })
      .filter(Boolean);
  }

  return {
    mergeCustomFieldRows,
    isSimpleEditableField,
    isCreateEditableField,
    requiredCreateFieldRows,
    allCreateFieldRows,
    defsFromIssueValues,
    renderCustomFieldsViewHtml,
    renderCustomFieldsEditHtml,
    renderCreateCustomFieldsHtml,
    collectCustomFieldsPatch,
    validateRequiredCreateFields,
  };
});
