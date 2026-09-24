/** Build indented project trees from flat Redmine reference projects. */
(function (factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.ProjectTree = api;
})(function createProjectTree() {
  function projectParentId(project) {
    if (!project) return null;
    const raw = project.parent_id ?? project.parent?.id ?? project.parent;
    if (raw == null || raw === "") return null;
    if (typeof raw === "object") {
      const id = Number(raw.id);
      return Number.isFinite(id) ? id : null;
    }
    const id = Number(raw);
    return Number.isFinite(id) ? id : null;
  }

  /**
   * @param {object[]} projects
   * @returns {{ id: number, name: string, depth: number, parentId: number|null }[]}
   */
  function flattenProjectsTree(projects) {
    const list = (projects || [])
      .map((p) => ({
        id: Number(p.id ?? p.project_id),
        name: String(p.name || p.project_name || `Проект #${p.id ?? p.project_id}`),
        parentId: projectParentId(p),
        status: p.status,
      }))
      .filter((p) => Number.isFinite(p.id));

    const byId = new Map(list.map((p) => [p.id, p]));
    const children = new Map();
    list.forEach((p) => {
      const parentOk = p.parentId != null && byId.has(p.parentId);
      const key = parentOk ? p.parentId : null;
      if (!children.has(key)) children.set(key, []);
      children.get(key).push(p);
    });
    children.forEach((arr) => arr.sort((a, b) => a.name.localeCompare(b.name, "ru")));

    const out = [];
    function walk(parentKey, depth) {
      const kids = children.get(parentKey) || [];
      kids.forEach((node) => {
        out.push({
          id: node.id,
          name: node.name,
          depth,
          parentId: node.parentId,
        });
        walk(node.id, depth + 1);
      });
    }
    walk(null, 0);

    // Orphans whose parent is outside the filtered set already attached under null.
    // Any id not visited (cycles) — append flat.
    const seen = new Set(out.map((r) => r.id));
    list
      .filter((p) => !seen.has(p.id))
      .sort((a, b) => a.name.localeCompare(b.name, "ru"))
      .forEach((p) => out.push({ id: p.id, name: p.name, depth: 0, parentId: p.parentId }));

    return out;
  }

  function indentLabel(name, depth, { prefix = true } = {}) {
    const d = Math.max(0, Number(depth) || 0);
    if (!d) return String(name || "");
    const pad = "\u00A0\u00A0".repeat(d);
    return prefix ? `${pad}${d > 0 ? "└ " : ""}${name}` : `${pad}${name}`;
  }

  /**
   * @param {object[]} projects
   * @param {{ hierarchy?: boolean }} opts
   */
  function projectsForSelect(projects, opts = {}) {
    if (!opts.hierarchy) {
      return (projects || [])
        .map((p) => ({
          id: Number(p.id ?? p.project_id),
          name: String(p.name || p.project_name || `Проект #${p.id ?? p.project_id}`),
          depth: 0,
        }))
        .filter((p) => Number.isFinite(p.id))
        .sort((a, b) => a.name.localeCompare(b.name, "ru"));
    }
    return flattenProjectsTree(projects).map((row) => ({
      id: row.id,
      name: indentLabel(row.name, row.depth),
      depth: row.depth,
      rawName: row.name,
    }));
  }

  return {
    projectParentId,
    flattenProjectsTree,
    indentLabel,
    projectsForSelect,
  };
});
