import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { api } from "../../../../utils/api";
import FormField from "../../../../components/cms/FormField";
import ImageSelector from "../../../../components/cms/ImageSelector";
import DragDropList from "../../../../components/cms/DragDropList";
import Modal from "../../../../components/cms/Modal";

const BRAND = "#0798bc";

type MainTab = "page" | "catalog";

interface ProductsPageDto {
  id?: number;
  bannerImage?: string | null;
  bannerAlt?: string | null;
  pageTitle?: string | null;
  introTitle?: string | null;
  introDescription?: string | null;
}

interface ProductRow {
  id: number;
  groupId?: number;
  name: string;
  casNo: string | null;
  imagePath: string | null;
  orderIndex: number;
}

interface GroupRow {
  id: number;
  categoryId: number;
  name: string;
  orderIndex: number;
  products?: ProductRow[];
}

interface CategoryRow {
  id: number;
  slug: string;
  label: string;
  orderIndex: number;
  groups: GroupRow[];
}

interface ProductsAdminPayload {
  page: ProductsPageDto | null;
  categories: CategoryRow[];
}

export default function ProductsPageManagement() {
  const [mainTab, setMainTab] = useState<MainTab>("page");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [pageDto, setPageDto] = useState<ProductsPageDto>({
    bannerImage: null,
    bannerAlt: "",
    pageTitle: "",
    introTitle: "",
    introDescription: "",
  });
  const [categories, setCategories] = useState<CategoryRow[]>([]);

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryRow | null>(null);
  const [categoryForm, setCategoryForm] = useState({ slug: "", label: "" });

  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [groupCategoryId, setGroupCategoryId] = useState<number | null>(null);
  const [editingGroup, setEditingGroup] = useState<GroupRow | null>(null);
  const [groupForm, setGroupForm] = useState({ name: "" });

  const [productModalOpen, setProductModalOpen] = useState(false);
  const [productGroupId, setProductGroupId] = useState<number | null>(null);
  const [editingProduct, setEditingProduct] = useState<ProductRow | null>(null);
  const [productForm, setProductForm] = useState({ name: "", casNo: "", imagePath: null as string | null });

  const loadAdmin = useCallback(async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await api.get<ProductsAdminPayload>("/products/admin");
      const payload = res.data as ProductsAdminPayload | undefined;
      if (payload?.page) {
        const p = payload.page;
        setPageDto({
          bannerImage: p.bannerImage ?? null,
          bannerAlt: p.bannerAlt ?? "",
          pageTitle: p.pageTitle ?? "",
          introTitle: p.introTitle ?? "",
          introDescription: p.introDescription ?? "",
        });
      }
      if (payload?.categories) {
        const sorted = [...payload.categories].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
        setCategories(
          sorted.map((c) => ({
            ...c,
            groups: [...(c.groups || [])]
              .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
              .map((g) => ({
                ...g,
                products: [...(g.products || [])].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)),
              })),
          })),
        );
      }
    } catch (err: unknown) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Could not load products admin data",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAdmin();
  }, [loadAdmin]);

  const savePage = async () => {
    setSaving(true);
    try {
      await api.put("/products/page", {
        bannerImage: pageDto.bannerImage ?? null,
        bannerAlt: pageDto.bannerAlt || null,
        pageTitle: pageDto.pageTitle || null,
        introTitle: pageDto.introTitle || null,
        introDescription: pageDto.introDescription || null,
      });
      setMessage({ type: "success", text: "Products page banner & intro saved" });
      await loadAdmin();
    } catch (err: unknown) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  const persistCategoryOrder = async (ordered: CategoryRow[]) => {
    const normalized = ordered.map((c, i) => ({ ...c, orderIndex: i }));
    setCategories(normalized);
    setSaving(true);
    try {
      for (const c of normalized) {
        await api.put(`/products/categories/${c.id}`, { orderIndex: c.orderIndex });
      }
    } catch (err: unknown) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Reorder failed" });
      await loadAdmin();
    } finally {
      setSaving(false);
    }
  };

  const persistGroupOrder = async (categoryId: number, orderedGroups: GroupRow[]) => {
    const normalized = orderedGroups.map((g, i) => ({ ...g, orderIndex: i }));
    setCategories((prev) =>
      prev.map((c) => (c.id === categoryId ? { ...c, groups: normalized } : c)),
    );
    setSaving(true);
    try {
      for (const g of normalized) {
        await api.put(`/products/groups/${g.id}`, { orderIndex: g.orderIndex });
      }
    } catch (err: unknown) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Reorder failed" });
      await loadAdmin();
    } finally {
      setSaving(false);
    }
  };

  const persistProductOrder = async (groupId: number, orderedProducts: ProductRow[]) => {
    const normalized = orderedProducts.map((p, i) => ({ ...p, orderIndex: i }));
    setCategories((prev) =>
      prev.map((c) => ({
        ...c,
        groups: c.groups.map((g) => (g.id === groupId ? { ...g, products: normalized } : g)),
      })),
    );
    setSaving(true);
    try {
      for (const p of normalized) {
        await api.put(`/products/items/${p.id}`, { orderIndex: p.orderIndex });
      }
    } catch (err: unknown) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Reorder failed" });
      await loadAdmin();
    } finally {
      setSaving(false);
    }
  };

  const openCategoryModal = (cat?: CategoryRow) => {
    if (cat) {
      setEditingCategory(cat);
      setCategoryForm({ slug: cat.slug, label: cat.label });
    } else {
      setEditingCategory(null);
      setCategoryForm({ slug: "", label: "" });
    }
    setCategoryModalOpen(true);
  };

  const saveCategory = async () => {
    if (!categoryForm.slug.trim() || !categoryForm.label.trim()) {
      alert("Slug and label are required");
      return;
    }
    setSaving(true);
    try {
      if (editingCategory) {
        await api.put(`/products/categories/${editingCategory.id}`, {
          slug: categoryForm.slug.trim(),
          label: categoryForm.label.trim(),
        });
      } else {
        await api.post("/products/categories", {
          slug: categoryForm.slug.trim(),
          label: categoryForm.label.trim(),
          orderIndex: categories.length,
        });
      }
      setCategoryModalOpen(false);
      await loadAdmin();
      setMessage({ type: "success", text: "Category saved" });
    } catch (err: unknown) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Save category failed" });
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (cat: CategoryRow) => {
    if (!confirm(`Delete category "${cat.label}" and all nested groups/items?`)) return;
    setSaving(true);
    try {
      await api.delete(`/products/categories/${cat.id}`);
      await loadAdmin();
      setMessage({ type: "success", text: "Category deleted" });
    } catch (err: unknown) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Delete failed" });
    } finally {
      setSaving(false);
    }
  };

  const openGroupModal = (categoryId: number, group?: GroupRow) => {
    setGroupCategoryId(categoryId);
    if (group) {
      setEditingGroup(group);
      setGroupForm({ name: group.name });
    } else {
      setEditingGroup(null);
      setGroupForm({ name: "" });
    }
    setGroupModalOpen(true);
  };

  const saveGroup = async () => {
    if (!groupForm.name.trim() || groupCategoryId == null) return alert("Missing data");
    setSaving(true);
    try {
      if (editingGroup) {
        await api.put(`/products/groups/${editingGroup.id}`, { name: groupForm.name.trim() });
      } else {
        const cat = categories.find((c) => c.id === groupCategoryId);
        const n = cat?.groups.length ?? 0;
        await api.post("/products/groups", {
          categoryId: groupCategoryId,
          name: groupForm.name.trim(),
          orderIndex: n,
        });
      }
      setGroupModalOpen(false);
      await loadAdmin();
      setMessage({ type: "success", text: "Group saved" });
    } catch (err: unknown) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Save group failed" });
    } finally {
      setSaving(false);
    }
  };

  const deleteGroup = async (g: GroupRow) => {
    if (!confirm(`Delete group "${g.name}" and all products inside?`)) return;
    setSaving(true);
    try {
      await api.delete(`/products/groups/${g.id}`);
      await loadAdmin();
      setMessage({ type: "success", text: "Group deleted" });
    } catch (err: unknown) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Delete failed" });
    } finally {
      setSaving(false);
    }
  };

  const openProductModal = (groupId: number, p?: ProductRow) => {
    setProductGroupId(groupId);
    if (p) {
      setEditingProduct(p);
      setProductForm({ name: p.name, casNo: p.casNo || "", imagePath: p.imagePath });
    } else {
      setEditingProduct(null);
      setProductForm({ name: "", casNo: "", imagePath: null });
    }
    setProductModalOpen(true);
  };

  const saveProduct = async () => {
    if (!productForm.name.trim() || productGroupId == null) return alert("Name required");
    setSaving(true);
    try {
      if (editingProduct) {
        await api.put(`/products/items/${editingProduct.id}`, {
          name: productForm.name.trim(),
          casNo: productForm.casNo.trim() || null,
          imagePath: productForm.imagePath,
        });
      } else {
        let count = 0;
        categories.forEach((c) =>
          c.groups.forEach((g) => {
            if (g.id === productGroupId) count = g.products?.length ?? 0;
          }),
        );
        await api.post("/products/items", {
          groupId: productGroupId,
          name: productForm.name.trim(),
          casNo: productForm.casNo.trim() || null,
          imagePath: productForm.imagePath,
          orderIndex: count,
        });
      }
      setProductModalOpen(false);
      await loadAdmin();
      setMessage({ type: "success", text: "Product saved" });
    } catch (err: unknown) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Save product failed" });
    } finally {
      setSaving(false);
    }
  };

  const deleteProductRow = async (p: ProductRow) => {
    if (!confirm(`Delete product "${p.name}"?`)) return;
    setSaving(true);
    try {
      await api.delete(`/products/items/${p.id}`);
      await loadAdmin();
      setMessage({ type: "success", text: "Product deleted" });
    } catch (err: unknown) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Delete failed" });
    } finally {
      setSaving(false);
    }
  };

  const orderedCategories = [...categories].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-xl font-bold text-[#1F2937]">Products</h2>
          <p className="text-sm text-[#6B7280] mt-1">Page hero copy and catalogue structure</p>
        </div>
        <button
          type="button"
          onClick={() => loadAdmin()}
          disabled={loading || saving}
          className="px-4 py-2 rounded-lg border border-[#D1D5DB] text-sm hover:bg-gray-50 disabled:opacity-50"
        >
          Reload
        </button>
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
        {(["page", "catalog"] satisfies MainTab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setMainTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px capitalize ${
              mainTab === t ? "border-[currentColor]" : "border-transparent text-[#6B7280]"
            }`}
            style={mainTab === t ? { borderColor: BRAND, color: BRAND } : undefined}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: BRAND }} />
        </div>
      ) : mainTab === "page" ? (
        <div className="space-y-6 max-w-3xl">
          <ImageSelector
            label="Banner image"
            value={pageDto.bannerImage ?? null}
            onChange={(p) => setPageDto({ ...pageDto, bannerImage: p })}
          />
          <FormField label="Banner alt">
            <input
              value={pageDto.bannerAlt ?? ""}
              onChange={(e) => setPageDto({ ...pageDto, bannerAlt: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </FormField>
          <FormField label="Page title">
            <input
              value={pageDto.pageTitle ?? ""}
              onChange={(e) => setPageDto({ ...pageDto, pageTitle: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm uppercase"
            />
          </FormField>
          <FormField label="Intro heading">
            <input
              value={pageDto.introTitle ?? ""}
              onChange={(e) => setPageDto({ ...pageDto, introTitle: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </FormField>
          <FormField label="Intro description">
            <textarea
              value={pageDto.introDescription ?? ""}
              onChange={(e) => setPageDto({ ...pageDto, introDescription: e.target.value })}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </FormField>
          <button
            type="button"
            onClick={savePage}
            disabled={saving}
            className="px-4 py-2 text-white rounded-lg disabled:opacity-50 flex items-center gap-2"
            style={{ backgroundColor: BRAND }}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Save page
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between flex-wrap gap-3">
            <p className="text-sm text-[#6B7280]">Drag tabs to reorder. Groups and products reorder within parents.</p>
            <button
              type="button"
              disabled={saving}
              className="px-3 py-2 text-sm text-white rounded-lg disabled:opacity-50"
              style={{ backgroundColor: BRAND }}
              onClick={() => openCategoryModal()}
            >
              New category tab
            </button>
          </div>

          <DragDropList<CategoryRow>
            items={orderedCategories}
            onReorder={persistCategoryOrder}
            keyExtractor={(c) => c.id}
            emptyMessage="No product categories defined."
            renderItem={(cat) => (
              <div className="space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold text-[#111827]">{cat.label}</div>
                    <div className="text-xs text-[#9CA3AF]">
                      slug:{cat.slug} · order:{cat.orderIndex}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="text-xs px-2 py-1 rounded border border-gray-300"
                      onClick={() => openCategoryModal(cat)}
                    >
                      Edit tab
                    </button>
                    <button
                      type="button"
                      className="text-xs px-2 py-1 rounded border border-[#0798bc] text-[#0798bc]"
                      onClick={() => openGroupModal(cat.id)}
                    >
                      Add group
                    </button>
                    <button
                      type="button"
                      className="text-xs px-2 py-1 text-red-600"
                      onClick={() => deleteCategory(cat)}
                    >
                      Delete tab
                    </button>
                  </div>
                </div>

                <DragDropList<GroupRow>
                  items={[...(cat.groups || [])].sort(
                    (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0),
                  )}
                  onReorder={(groups) => persistGroupOrder(cat.id, groups)}
                  keyExtractor={(g) => g.id}
                  emptyMessage="No groups in this category."
                  renderItem={(grp) => (
                    <div className="space-y-3">
                      <div className="flex flex-wrap justify-between gap-2">
                        <div className="text-sm font-medium text-[#374151]">{grp.name}</div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="text-xs px-2 py-1 border rounded"
                            onClick={() => openGroupModal(cat.id, grp)}
                          >
                            Edit group
                          </button>
                          <button
                            type="button"
                            className="text-xs px-2 py-1 border rounded text-[#0798bc]"
                            onClick={() => openProductModal(grp.id)}
                          >
                            Add product
                          </button>
                          <button
                            type="button"
                            className="text-xs text-red-600"
                            onClick={() => deleteGroup(grp)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <DragDropList<ProductRow>
                        items={[...(grp.products || [])].sort(
                          (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0),
                        )}
                        onReorder={(prods) => persistProductOrder(grp.id, prods)}
                        keyExtractor={(p) => p.id}
                        emptyMessage="No products in this group."
                        renderItem={(p) => (
                          <div className="flex flex-wrap justify-between gap-2 items-center">
                            <div>
                              <div className="text-sm font-medium">{p.name}</div>
                              <div className="text-xs text-[#9CA3AF]">CAS: {p.casNo || "—"}</div>
                              <div className="text-[10px] text-gray-400 break-all max-w-xl">
                                {p.imagePath || "No image"}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                className="text-xs px-2 py-1 border rounded"
                                onClick={() => openProductModal(grp.id, p)}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                className="text-xs text-red-600"
                                onClick={() => deleteProductRow(p)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      />
                    </div>
                  )}
                />
              </div>
            )}
          />
        </div>
      )}

      <Modal isOpen={categoryModalOpen} onClose={() => setCategoryModalOpen(false)} title={editingCategory ? "Edit category" : "New category"}>
        <div className="space-y-4">
          <FormField label="Slug (URL id)" required hint="e.g. intermediates">
            <input
              value={categoryForm.slug}
              onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </FormField>
          <FormField label="Label">
            <input
              value={categoryForm.label}
              onChange={(e) => setCategoryForm({ ...categoryForm, label: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </FormField>
          <div className="flex justify-end gap-2 pt-4">
            <button type="button" onClick={() => setCategoryModalOpen(false)} className="px-4 py-2 border rounded-lg">
              Cancel
            </button>
            <button type="button" disabled={saving} onClick={saveCategory} className="px-4 py-2 text-white rounded-lg" style={{ backgroundColor: BRAND }}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin inline" /> : null} Save
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={groupModalOpen} onClose={() => setGroupModalOpen(false)} title={editingGroup ? "Edit group" : "New group"}>
        <div className="space-y-4">
          <FormField label="Group heading">
            <input
              value={groupForm.name}
              onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </FormField>
          <div className="flex justify-end gap-2 pt-4">
            <button type="button" onClick={() => setGroupModalOpen(false)} className="px-4 py-2 border rounded-lg">
              Cancel
            </button>
            <button type="button" disabled={saving} onClick={saveGroup} className="px-4 py-2 text-white rounded-lg" style={{ backgroundColor: BRAND }}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin inline" /> : null} Save
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={productModalOpen} onClose={() => setProductModalOpen(false)} title={editingProduct ? "Edit product" : "New product"} size="full">
        <div className="space-y-4">
          <FormField label="Product name" required>
            <input
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </FormField>
          <FormField label="CAS number">
            <input
              value={productForm.casNo}
              onChange={(e) => setProductForm({ ...productForm, casNo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </FormField>
          <ImageSelector
            label="Product image"
            value={productForm.imagePath}
            onChange={(path) => setProductForm({ ...productForm, imagePath: path })}
            aspectRatio="1/1"
          />
          <div className="flex justify-end gap-2 pt-4">
            <button type="button" onClick={() => setProductModalOpen(false)} className="px-4 py-2 border rounded-lg">
              Cancel
            </button>
            <button type="button" disabled={saving} onClick={saveProduct} className="px-4 py-2 text-white rounded-lg" style={{ backgroundColor: BRAND }}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin inline" /> : null} Save
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
