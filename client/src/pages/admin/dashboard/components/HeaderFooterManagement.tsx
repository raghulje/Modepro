import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { api } from "../../../../utils/api";
import FormField from "../../../../components/cms/FormField";
import DragDropList from "../../../../components/cms/DragDropList";
import Modal from "../../../../components/cms/Modal";

const BRAND = "#0798bc";

type SectionTab = "navigation" | "footer";

interface NavItem {
  id: number;
  label: string;
  url: string;
  parentId: number | null;
  orderIndex: number;
  isActive: boolean;
}

interface FooterNavUiRow extends Record<string, unknown> {
  _key: string;
  label: string;
  href: string;
}

interface FooterRow {
  officeTitle: string;
  officeText: string;
  factoryTitle: string;
  factoryText: string;
  careersTitle: string;
  careersDescription: string;
  careersCtaText: string;
  careersCtaHref: string;
  copyrightText: string;
  managedByText: string;
  footerNavigation: Array<{ label: string; href: string }>;
}

export default function HeaderFooterManagement() {
  const [tab, setTab] = useState<SectionTab>("navigation");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [footer, setFooter] = useState<FooterRow>({
    officeTitle: "",
    officeText: "",
    factoryTitle: "",
    factoryText: "",
    careersTitle: "",
    careersDescription: "",
    careersCtaText: "",
    careersCtaHref: "",
    copyrightText: "",
    managedByText: "",
    footerNavigation: [],
  });
  const [footerNavUi, setFooterNavUi] = useState<FooterNavUiRow[]>([]);

  const [navModal, setNavModal] = useState(false);
  const [editingNav, setEditingNav] = useState<NavItem | null>(null);
  const [navForm, setNavForm] = useState({ label: "", url: "", parentId: "" as string | number, isActive: true });

  const flattenNavResponse = (
    roots: Array<NavItem & { children?: NavItem[] }>,
  ): NavItem[] => {
    const flat: NavItem[] = [];
    roots.forEach((top) => {
      const kids = Array.isArray(top.children) ? top.children : [];
      const { children: _omit, ...parent } = top as NavItem & { children?: NavItem[] };
      flat.push({ ...parent });
      kids.forEach((c) => {
        flat.push({ ...c, parentId: parent.id });
      });
    });
    return flat;
  };

  const load = async () => {
    setLoading(true);
    setMessage(null);
    try {
      if (tab === "navigation") {
        const res = await api.get<Array<NavItem & { children?: NavItem[] }>>("/navigation");
        const roots = Array.isArray(res.data) ? res.data : [];
        setNavItems(flattenNavResponse(roots));
      } else {
        const res = await api.get<FooterRow>("/footer/admin");
        const f = res.data as FooterRow;
        if (f) {
          const links = Array.isArray(f.footerNavigation) ? f.footerNavigation : [];
          setFooterNavUi(
            links.map((l, i) => ({
              _key: `fn-${l.href}-${i}-${Math.random().toString(36).slice(2, 9)}`,
              label: l.label ?? "",
              href: l.href ?? "",
            })),
          );
          setFooter({
            officeTitle: f.officeTitle || "",
            officeText: f.officeText || "",
            factoryTitle: f.factoryTitle || "",
            factoryText: f.factoryText || "",
            careersTitle: f.careersTitle || "",
            careersDescription: f.careersDescription || "",
            careersCtaText: f.careersCtaText || "",
            careersCtaHref: f.careersCtaHref || "",
            copyrightText: f.copyrightText || "",
            managedByText: f.managedByText || "",
            footerNavigation: links,
          });
        }
      }
    } catch (err: unknown) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to load" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [tab]);

  const topLevelNav = navItems.filter((n) => !n.parentId);

  const syncFooterLinksToPayload = (rows: FooterNavUiRow[]) => ({
    ...footer,
    footerNavigation: rows.map(({ label, href }) => ({
      label: String(label ?? ""),
      href: String(href ?? ""),
    })),
  });

  const saveFooter = async () => {
    const payload = syncFooterLinksToPayload(footerNavUi);
    setSaving(true);
    try {
      await api.put("/footer", payload);
      setFooter(payload);
      setMessage({ type: "success", text: "Footer saved" });
    } catch (err: unknown) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  const openNavModal = (item?: NavItem, parentId?: number) => {
    if (item) {
      setEditingNav(item);
      setNavForm({ label: item.label, url: item.url, parentId: item.parentId || "", isActive: item.isActive });
    } else {
      setEditingNav(null);
      setNavForm({ label: "", url: "", parentId: parentId ?? "", isActive: true });
    }
    setNavModal(true);
  };

  const saveNav = async () => {
    if (!navForm.label || !navForm.url) return alert("Label and URL required");
    setSaving(true);
    try {
      const payload = {
        label: navForm.label,
        url: navForm.url,
        parentId: navForm.parentId === "" ? null : Number(navForm.parentId),
        isActive: navForm.isActive,
      };
      if (editingNav) {
        await api.put(`/navigation/${editingNav.id}`, payload);
      } else {
        const siblings = navItems.filter((n) =>
          payload.parentId == null ? n.parentId == null : n.parentId === payload.parentId,
        );
        await api.post("/navigation", { ...payload, orderIndex: siblings.length });
      }
      setNavModal(false);
      await load();
      setMessage({ type: "success", text: "Navigation item saved" });
    } catch (err: unknown) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  const reorderTopLevel = async (orderedTops: NavItem[]) => {
    const normalized = orderedTops.map((n, i) => ({ ...n, orderIndex: i, parentId: null as number | null }));
    const otherKids = navItems.filter((n) => n.parentId != null);
    setNavItems([...normalized, ...otherKids]);
    setSaving(true);
    try {
      for (const n of normalized) {
        await api.put(`/navigation/${n.id}`, { orderIndex: n.orderIndex, parentId: null });
      }
    } catch (err: unknown) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Reorder failed" });
    } finally {
      setSaving(false);
    }
  };

  const reorderChildren = async (parentId: number, orderedKids: NavItem[]) => {
    const normalized = orderedKids.map((n, i) => ({ ...n, orderIndex: i, parentId }));
    const tops = navItems.filter((n) => !n.parentId);
    const otherKids = navItems.filter((n) => n.parentId != null && n.parentId !== parentId);
    setNavItems([...tops, ...normalized, ...otherKids]);
    setSaving(true);
    try {
      for (const n of normalized) {
        await api.put(`/navigation/${n.id}`, { orderIndex: n.orderIndex, parentId });
      }
    } catch (err: unknown) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Reorder failed" });
    } finally {
      setSaving(false);
    }
  };

  const deleteNav = async (item: NavItem) => {
    if (!confirm(`Delete navigation item "${item.label}"? Child items may be orphaned or cascade-deleted.`)) return;
    setSaving(true);
    try {
      await api.delete(`/navigation/${item.id}`);
      await load();
      setMessage({ type: "success", text: "Navigation item deleted" });
    } catch (err: unknown) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Delete failed" });
    } finally {
      setSaving(false);
    }
  };

  const topLevelSorted = topLevelNav
    .slice()
    .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-[#1F2937]">Header & Footer</h2>
          <p className="text-sm text-[#6B7280]">Site navigation and footer content</p>
        </div>
        {tab === "footer" && (
          <button type="button" onClick={saveFooter} disabled={saving || loading} className="px-4 py-2 text-white rounded-lg disabled:opacity-50 flex items-center gap-2" style={{ backgroundColor: BRAND }}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Save footer
          </button>
        )}
      </div>

      {message && (
        <div
          className={`mb-4 px-4 py-3 rounded-lg text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex gap-2 border-b border-[#E5E7EB] mb-6">
        {(["navigation", "footer"] satisfies SectionTab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors capitalize ${
              tab === t
                ? "border-[currentColor]"
                : "border-transparent text-[#6B7280] hover:text-[#1F2937]"
            }`}
            style={tab === t ? { borderColor: BRAND, color: BRAND } : undefined}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: BRAND }} />
        </div>
      ) : tab === "navigation" ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-[#6B7280]">Drag to reorder top-level links. Manage children under each item.</p>
            <button
              type="button"
              onClick={() => openNavModal(undefined)}
              disabled={saving}
              className="px-3 py-2 text-sm text-white rounded-lg disabled:opacity-50"
              style={{ backgroundColor: BRAND }}
            >
              Add root item
            </button>
          </div>

          <DragDropList
            items={topLevelSorted}
            onReorder={reorderTopLevel}
            keyExtractor={(n) => n.id}
            emptyMessage="No navigation items yet."
            renderItem={(item) => (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="font-medium text-[#111827]">{item.label}</div>
                    <div className="text-xs text-[#6B7280] break-all">{item.url}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${item.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}
                    >
                      {item.isActive ? "Active" : "Hidden"}
                    </span>
                    <button
                      type="button"
                      onClick={() => openNavModal(item)}
                      disabled={saving}
                      className="text-xs px-2 py-1 rounded border border-[#D1D5DB] hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => openNavModal(undefined, item.id)}
                      disabled={saving}
                      className="text-xs px-2 py-1 rounded border border-[#D1D5DB] hover:bg-gray-50"
                    >
                      Add child
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteNav(item)}
                      disabled={saving}
                      className="text-xs px-2 py-1 rounded text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {(() => {
                  const kids = navItems
                    .filter((n) => n.parentId === item.id)
                    .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
                  if (!kids.length) return null;
                  return (
                    <div className="mt-3 pl-4 border-l-2 ml-2" style={{ borderColor: BRAND }}>
                      <p className="text-xs font-medium text-[#6B7280] mb-2">Child links</p>
                      <DragDropList
                        items={kids}
                        onReorder={(rows) => reorderChildren(item.id, rows)}
                        keyExtractor={(n) => n.id}
                        emptyMessage="No children"
                        renderItem={(child) => (
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <div className="text-sm font-medium text-[#374151]">{child.label}</div>
                              <div className="text-xs text-[#9CA3AF] break-all">{child.url}</div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => openNavModal(child)}
                                disabled={saving}
                                className="text-xs px-2 py-1 rounded border border-[#D1D5DB]"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteNav(child)}
                                disabled={saving}
                                className="text-xs px-2 py-1 rounded text-red-600"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      />
                    </div>
                  );
                })()}
              </div>
            )}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-5">
            <FormField label="Office title">
              <input
                type="text"
                value={footer.officeTitle}
                onChange={(e) => setFooter({ ...footer, officeTitle: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </FormField>
            <FormField label="Office address / text">
              <textarea
                value={footer.officeText}
                onChange={(e) => setFooter({ ...footer, officeText: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
              />
            </FormField>
            <FormField label="Factory title">
              <input
                type="text"
                value={footer.factoryTitle}
                onChange={(e) => setFooter({ ...footer, factoryTitle: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </FormField>
            <FormField label="Factory address / text">
              <textarea
                value={footer.factoryText}
                onChange={(e) => setFooter({ ...footer, factoryText: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
              />
            </FormField>
          </div>
          <div className="space-y-5">
            <FormField label="Careers title">
              <input
                type="text"
                value={footer.careersTitle}
                onChange={(e) => setFooter({ ...footer, careersTitle: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </FormField>
            <FormField label="Careers description">
              <textarea
                value={footer.careersDescription}
                onChange={(e) => setFooter({ ...footer, careersDescription: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </FormField>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Careers CTA text">
                <input
                  type="text"
                  value={footer.careersCtaText}
                  onChange={(e) => setFooter({ ...footer, careersCtaText: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </FormField>
              <FormField label="Careers CTA href">
                <input
                  type="text"
                  value={footer.careersCtaHref}
                  onChange={(e) => setFooter({ ...footer, careersCtaHref: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </FormField>
            </div>
            <FormField label="Copyright text">
              <input
                type="text"
                value={footer.copyrightText}
                onChange={(e) => setFooter({ ...footer, copyrightText: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </FormField>
            <FormField label="Managed-by text">
              <input
                type="text"
                value={footer.managedByText}
                onChange={(e) => setFooter({ ...footer, managedByText: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </FormField>
          </div>

          <div className="lg:col-span-2 border-t border-[#E5E7EB] pt-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Footer quick links</p>
                <p className="text-xs text-gray-500 mt-1">
                  Drag to reorder. Labels appear as footer navigation entries.
                </p>
              </div>
              <button
                type="button"
                disabled={saving}
                className="text-sm px-3 py-1.5 rounded-lg text-white shrink-0"
                style={{ backgroundColor: BRAND }}
                onClick={() =>
                  setFooterNavUi((prev) => [
                    ...prev,
                    {
                      _key: `fn-new-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`,
                      label: "",
                      href: "",
                    },
                  ])
                }
              >
                Add link
              </button>
            </div>

            <DragDropList<FooterNavUiRow & { orderIndex?: number }>
              items={
                footerNavUi.map((r, idx) =>
                  ({ ...r, orderIndex: idx }) as FooterNavUiRow & { orderIndex: number })
              }
              onReorder={(items) =>
                setFooterNavUi(
                  items.map((row) => {
                    const { orderIndex: _o, ...rest } = row;
                    return rest as FooterNavUiRow;
                  }),
                )}
              keyExtractor={(row) => row._key}
              emptyMessage="No footer navigation links yet."
              renderItem={(row) => (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                  <input
                    type="text"
                    value={row.label}
                    placeholder="Label"
                    onChange={(e) =>
                      setFooterNavUi((prev) =>
                        prev.map((x) =>
                          x._key === row._key ? { ...x, label: e.target.value } : x,
                        ))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <input
                    type="text"
                    value={row.href}
                    placeholder="/path"
                    onChange={(e) =>
                      setFooterNavUi((prev) =>
                        prev.map((x) =>
                          x._key === row._key ? { ...x, href: e.target.value } : x,
                        ))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <div className="sm:col-span-2 flex justify-end">
                    <button
                      type="button"
                      className="text-xs text-red-600"
                      onClick={() =>
                        setFooterNavUi((prev) => prev.filter((x) => x._key !== row._key))}
                    >
                      Remove link
                    </button>
                  </div>
                </div>
              )}
            />
          </div>
        </div>
      )}

      <Modal
        isOpen={navModal}
        onClose={() => setNavModal(false)}
        title={editingNav ? "Edit navigation item" : "Add navigation item"}
      >
        <div className="space-y-4">
          <FormField label="Label" required>
            <input
              type="text"
              value={navForm.label}
              onChange={(e) => setNavForm({ ...navForm, label: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </FormField>
          <FormField label="URL path" required>
            <input
              type="text"
              value={navForm.url}
              onChange={(e) => setNavForm({ ...navForm, url: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="/about"
            />
          </FormField>
          <FormField label="Parent (optional)" hint="Pick a parent menu to nest under">
            <select
              value={navForm.parentId === "" ? "" : String(navForm.parentId)}
              onChange={(e) =>
                setNavForm({
                  ...navForm,
                  parentId: e.target.value === "" ? "" : Number(e.target.value),
                })}
              disabled={!!editingNav && navItems.some((n) => n.parentId === editingNav!.id)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Top level</option>
              {navItems
                .filter((n) => !n.parentId && (!editingNav || n.id !== editingNav.id))
                .map((p) => (
                  <option key={p.id} value={String(p.id)}>
                    {p.label}
                  </option>
                ))}
            </select>
          </FormField>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={navForm.isActive}
              onChange={(e) => setNavForm({ ...navForm, isActive: e.target.checked })}
            />
            Visible on site
          </label>
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => setNavModal(false)}
              className="px-4 py-2 rounded-lg border border-gray-300"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveNav}
              disabled={saving}
              className="px-4 py-2 rounded-lg text-white flex items-center gap-2 disabled:opacity-50"
              style={{ backgroundColor: BRAND }}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Save
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
