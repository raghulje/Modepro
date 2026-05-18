import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { api } from "../../../../utils/api";
import Modal from "../../../../components/cms/Modal";
import FormField from "../../../../components/cms/FormField";
import DragDropList from "../../../../components/cms/DragDropList";
import ImageSelector from "../../../../components/cms/ImageSelector";
import { resolveImagePath } from "../../../../utils/imageUrl";

const BRAND = "#0798bc";
type SectionTab = "banner" | "images";

interface BannerSlide {
  id: number;
  imagePath: string;
  altText: string;
  orderIndex: number;
}

interface GalleryImage {
  id: number;
  thumbPath: string;
  fullPath: string;
  orderIndex: number;
}

export default function GalleryPageManagement() {
  const [activeSection, setActiveSection] = useState<SectionTab>("banner");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [bannerSlides, setBannerSlides] = useState<BannerSlide[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerSlide | null>(null);
  const [bannerForm, setBannerForm] = useState({ imagePath: "", altText: "" });
  const [showImageModal, setShowImageModal] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [imageForm, setImageForm] = useState({ thumbPath: "", fullPath: "" });

  const load = async () => {
    setLoading(true);
    setMessage(null);
    try {
      if (activeSection === "banner") {
        const res = await api.get<BannerSlide[]>("/gallery/banner-slides");
        setBannerSlides((res.data as BannerSlide[]) || []);
      } else {
        const res = await api.get<GalleryImage[]>("/gallery/images");
        setGalleryImages((res.data as GalleryImage[]) || []);
      }
    } catch (err: unknown) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to load" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [activeSection]);

  const persistOrder = async (items: Array<{ id: number; orderIndex: number }>, banner: boolean) => {
    const base = banner ? "/gallery/banner-slides" : "/gallery/images";
    for (const item of items) {
      await api.put(`${base}/${item.id}`, { orderIndex: item.orderIndex });
    }
  };

  const saveBanner = async () => {
    if (!bannerForm.imagePath) return alert("Image required");
    setSaving(true);
    try {
      if (editingBanner) {
        await api.put(`/gallery/banner-slides/${editingBanner.id}`, bannerForm);
      } else {
        await api.post("/gallery/banner-slides", { ...bannerForm, orderIndex: bannerSlides.length });
      }
      setShowBannerModal(false);
      await load();
      setMessage({ type: "success", text: "Banner slide saved" });
    } catch (err: unknown) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  const saveGalleryImage = async () => {
    if (!imageForm.thumbPath || !imageForm.fullPath) return alert("Thumb and full image required");
    setSaving(true);
    try {
      if (editingImage) {
        await api.put(`/gallery/images/${editingImage.id}`, imageForm);
      } else {
        await api.post("/gallery/images", { ...imageForm, orderIndex: galleryImages.length });
      }
      setShowImageModal(false);
      await load();
      setMessage({ type: "success", text: "Gallery image saved" });
    } catch (err: unknown) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "banner" as const, label: "Banner Slides" },
    { id: "images" as const, label: "Gallery Images" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#1F2937]">Gallery</h2>
        <p className="text-sm text-[#6B7280] mt-1">Banner carousel and photo grid</p>
      </div>

      <div className="flex gap-2 mb-4 border-b border-[#E5E7EB] pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSection(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
              activeSection === tab.id ? "text-white" : "text-[#6B7280]"
            }`}
            style={activeSection === tab.id ? { backgroundColor: BRAND } : undefined}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {message && (
        <div
          className={`mb-4 px-4 py-3 rounded-lg text-sm ${
            message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: BRAND }} />
        </div>
      ) : activeSection === "banner" ? (
        <div className="space-y-4">
          <button
            type="button"
            className="px-4 py-2 text-white rounded-lg"
            style={{ backgroundColor: BRAND }}
            onClick={() => {
              setEditingBanner(null);
              setBannerForm({ imagePath: "", altText: "" });
              setShowBannerModal(true);
            }}
          >
            + Add banner slide
          </button>
          <DragDropList
            items={bannerSlides}
            keyExtractor={(s) => s.id}
            onReorder={async (items) => {
              const ordered = items.map((s, i) => ({ ...s, orderIndex: i }));
              setBannerSlides(ordered);
              await persistOrder(ordered, true);
            }}
            renderItem={(slide) => (
              <div className="flex items-center gap-4 flex-1">
                <img src={resolveImagePath(slide.imagePath)} alt="" className="w-24 h-14 object-cover rounded" />
                <div className="flex-1">
                  <p className="font-medium">{slide.altText || "Banner"}</p>
                </div>
                <button type="button" className="px-3 py-1 border rounded-lg text-sm" onClick={() => {
                  setEditingBanner(slide);
                  setBannerForm({ imagePath: slide.imagePath, altText: slide.altText || "" });
                  setShowBannerModal(true);
                }}>Edit</button>
                <button type="button" className="px-3 py-1 text-red-600 border border-red-200 rounded-lg text-sm" onClick={async () => {
                  if (confirm("Delete?")) { await api.delete(`/gallery/banner-slides/${slide.id}`); await load(); }
                }}>Delete</button>
              </div>
            )}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <button
            type="button"
            className="px-4 py-2 text-white rounded-lg"
            style={{ backgroundColor: BRAND }}
            onClick={() => {
              setEditingImage(null);
              setImageForm({ thumbPath: "", fullPath: "" });
              setShowImageModal(true);
            }}
          >
            + Add gallery image
          </button>
          <DragDropList
            items={galleryImages}
            keyExtractor={(i) => i.id}
            onReorder={async (items) => {
              const ordered = items.map((img, idx) => ({ ...img, orderIndex: idx }));
              setGalleryImages(ordered);
              await persistOrder(ordered, false);
            }}
            renderItem={(img) => (
              <div className="flex items-center gap-4 flex-1">
                <img src={resolveImagePath(img.thumbPath)} alt="" className="w-16 h-16 object-cover rounded" />
                <div className="flex-1 text-sm text-gray-600 truncate">{img.fullPath}</div>
                <button type="button" className="px-3 py-1 border rounded-lg text-sm" onClick={() => {
                  setEditingImage(img);
                  setImageForm({ thumbPath: img.thumbPath, fullPath: img.fullPath });
                  setShowImageModal(true);
                }}>Edit</button>
                <button type="button" className="px-3 py-1 text-red-600 border border-red-200 rounded-lg text-sm" onClick={async () => {
                  if (confirm("Delete?")) { await api.delete(`/gallery/images/${img.id}`); await load(); }
                }}>Delete</button>
              </div>
            )}
          />
        </div>
      )}

      <Modal isOpen={showBannerModal} onClose={() => setShowBannerModal(false)} title={editingBanner ? "Edit banner" : "Add banner"}>
        <div className="space-y-4">
          <ImageSelector label="Image" required value={bannerForm.imagePath || null} onChange={(v) => setBannerForm((p) => ({ ...p, imagePath: v || "" }))} />
          <FormField label="Alt text"><input className="w-full px-3 py-2 border rounded-lg" value={bannerForm.altText} onChange={(e) => setBannerForm((p) => ({ ...p, altText: e.target.value }))} /></FormField>
          <button type="button" onClick={saveBanner} disabled={saving} className="px-4 py-2 text-white rounded-lg" style={{ backgroundColor: BRAND }}>Save</button>
        </div>
      </Modal>

      <Modal isOpen={showImageModal} onClose={() => setShowImageModal(false)} title={editingImage ? "Edit image" : "Add image"}>
        <div className="space-y-4">
          <ImageSelector label="Thumbnail" required value={imageForm.thumbPath || null} onChange={(v) => setImageForm((p) => ({ ...p, thumbPath: v || "" }))} aspectRatio="1/1" />
          <ImageSelector label="Full size" required value={imageForm.fullPath || null} onChange={(v) => setImageForm((p) => ({ ...p, fullPath: v || "" }))} />
          <button type="button" onClick={saveGalleryImage} disabled={saving} className="px-4 py-2 text-white rounded-lg" style={{ backgroundColor: BRAND }}>Save</button>
        </div>
      </Modal>
    </div>
  );
}
