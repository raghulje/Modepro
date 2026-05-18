import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { api } from "../../../../utils/api";
import Modal from "../../../../components/cms/Modal";
import FormField from "../../../../components/cms/FormField";
import DragDropList from "../../../../components/cms/DragDropList";
import ImageSelector from "../../../../components/cms/ImageSelector";
import StringListEditor from "../../../../components/cms/StringListEditor";
import { resolveImagePath } from "../../../../utils/imageUrl";

const BRAND = "#0798bc";

type SectionTab = "welcome" | "hero" | "features";

interface WelcomeData {
  imagePath: string | null;
  title: string;
  titleHighlight: string;
  paragraphs: string[];
  ctaText: string;
  ctaHref: string;
}

interface HeroSlide {
  id: number;
  imagePath: string;
  altText: string;
  orderIndex: number;
  isActive: boolean;
}

interface FeatureCard {
  id: number;
  imagePath: string | null;
  images: string[] | null;
  title: string;
  ctaText: string;
  ctaHref: string;
  orderIndex: number;
}

export default function HomePageManagement() {
  const [activeSection, setActiveSection] = useState<SectionTab>("welcome");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [welcome, setWelcome] = useState<WelcomeData>({
    imagePath: null,
    title: "",
    titleHighlight: "",
    paragraphs: [""],
    ctaText: "",
    ctaHref: "",
  });

  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [featureCards, setFeatureCards] = useState<FeatureCard[]>([]);

  const [showHeroModal, setShowHeroModal] = useState(false);
  const [editingHero, setEditingHero] = useState<HeroSlide | null>(null);
  const [heroForm, setHeroForm] = useState({ imagePath: "", altText: "", isActive: true });

  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [editingFeature, setEditingFeature] = useState<FeatureCard | null>(null);
  const [featureForm, setFeatureForm] = useState({
    imagePath: "",
    images: [] as string[],
    useMultiImages: false,
    title: "",
    ctaText: "Read More",
    ctaHref: "",
  });

  const load = async () => {
    setLoading(true);
    setMessage(null);
    try {
      if (activeSection === "welcome") {
        const raw = await api.get<WelcomeData>("/home/welcome");
        if (raw.data) {
          const w = raw.data as WelcomeData;
          setWelcome({
            imagePath: w.imagePath || null,
            title: w.title || "",
            titleHighlight: w.titleHighlight || "",
            paragraphs: w.paragraphs?.length ? w.paragraphs : [""],
            ctaText: w.ctaText || "",
            ctaHref: w.ctaHref || "",
          });
        }
      } else if (activeSection === "hero") {
        const res = await api.get<HeroSlide[]>("/home/hero-slides");
        setHeroSlides((res.data as HeroSlide[]) || []);
      } else {
        const res = await api.get<FeatureCard[]>("/home/feature-cards");
        setFeatureCards((res.data as FeatureCard[]) || []);
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

  const saveWelcome = async () => {
    setSaving(true);
    try {
      await api.put("/home/welcome", welcome);
      setMessage({ type: "success", text: "Welcome section saved" });
    } catch (err: unknown) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  const persistOrder = async (
    items: Array<{ id: number; orderIndex: number }>,
    type: "hero" | "features"
  ) => {
    const base = type === "hero" ? "/home/hero-slides" : "/home/feature-cards";
    for (const item of items) {
      await api.put(`${base}/${item.id}`, { orderIndex: item.orderIndex });
    }
  };

  const openHeroModal = (slide?: HeroSlide) => {
    if (slide) {
      setEditingHero(slide);
      setHeroForm({ imagePath: slide.imagePath, altText: slide.altText || "", isActive: slide.isActive });
    } else {
      setEditingHero(null);
      setHeroForm({ imagePath: "", altText: "", isActive: true });
    }
    setShowHeroModal(true);
  };

  const saveHeroSlide = async () => {
    if (!heroForm.imagePath) {
      alert("Image is required");
      return;
    }
    setSaving(true);
    try {
      if (editingHero) {
        await api.put(`/home/hero-slides/${editingHero.id}`, heroForm);
      } else {
        await api.post("/home/hero-slides", {
          ...heroForm,
          orderIndex: heroSlides.length,
        });
      }
      setShowHeroModal(false);
      await load();
      setMessage({ type: "success", text: "Hero slide saved" });
    } catch (err: unknown) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  const deleteHeroSlide = async (id: number) => {
    if (!confirm("Delete this hero slide?")) return;
    await api.delete(`/home/hero-slides/${id}`);
    await load();
  };

  const openFeatureModal = (card?: FeatureCard) => {
    if (card) {
      setEditingFeature(card);
      const multi = Boolean(card.images?.length);
      setFeatureForm({
        imagePath: card.imagePath || "",
        images: card.images?.length ? card.images : [""],
        useMultiImages: multi,
        title: card.title,
        ctaText: card.ctaText || "Read More",
        ctaHref: card.ctaHref || "",
      });
    } else {
      setEditingFeature(null);
      setFeatureForm({
        imagePath: "",
        images: [""],
        useMultiImages: false,
        title: "",
        ctaText: "Read More",
        ctaHref: "",
      });
    }
    setShowFeatureModal(true);
  };

  const saveFeatureCard = async () => {
    if (!featureForm.title) {
      alert("Title is required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        imagePath: featureForm.useMultiImages ? null : featureForm.imagePath || null,
        images: featureForm.useMultiImages
          ? featureForm.images.map((s) => s.trim()).filter(Boolean)
          : null,
        title: featureForm.title,
        ctaText: featureForm.ctaText,
        ctaHref: featureForm.ctaHref,
      };
      if (editingFeature) {
        await api.put(`/home/feature-cards/${editingFeature.id}`, payload);
      } else {
        await api.post("/home/feature-cards", { ...payload, orderIndex: featureCards.length });
      }
      setShowFeatureModal(false);
      await load();
      setMessage({ type: "success", text: "Feature card saved" });
    } catch (err: unknown) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  const deleteFeatureCard = async (id: number) => {
    if (!confirm("Delete this feature card?")) return;
    await api.delete(`/home/feature-cards/${id}`);
    await load();
  };

  const tabs: { id: SectionTab; label: string }[] = [
    { id: "welcome", label: "Welcome" },
    { id: "hero", label: "Hero Slides" },
    { id: "features", label: "Feature Cards" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#1F2937]">Home Page</h2>
          <p className="text-sm text-[#6B7280] mt-1">
            Manage welcome section, hero carousel, and feature cards
          </p>
        </div>
        {activeSection === "welcome" && (
          <button
            type="button"
            onClick={saveWelcome}
            disabled={saving || loading}
            className="px-4 py-2 text-white rounded-lg disabled:opacity-50 flex items-center gap-2"
            style={{ backgroundColor: BRAND }}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Save
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-4 border-b border-[#E5E7EB] pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSection(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
              activeSection === tab.id ? "text-white" : "text-[#6B7280] hover:bg-[#F9FAFB]"
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
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: BRAND }} />
        </div>
      ) : activeSection === "welcome" ? (
        <div className="space-y-6 max-w-3xl">
          <ImageSelector
            label="Welcome image"
            value={welcome.imagePath}
            onChange={(v) => setWelcome((p) => ({ ...p, imagePath: v }))}
          />
          <FormField label="Title">
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={welcome.title}
              onChange={(e) => setWelcome((p) => ({ ...p, title: e.target.value }))}
            />
          </FormField>
          <FormField label="Highlighted phrase">
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={welcome.titleHighlight}
              onChange={(e) => setWelcome((p) => ({ ...p, titleHighlight: e.target.value }))}
            />
          </FormField>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Paragraphs</span>
              <button
                type="button"
                className="text-sm text-[#0798bc]"
                onClick={() => setWelcome((p) => ({ ...p, paragraphs: [...p.paragraphs, ""] }))}
              >
                + Add paragraph
              </button>
            </div>
            {welcome.paragraphs.map((para, i) => (
              <div key={i} className="flex gap-2">
                <textarea
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                  value={para}
                  onChange={(e) => {
                    const next = [...welcome.paragraphs];
                    next[i] = e.target.value;
                    setWelcome((p) => ({ ...p, paragraphs: next }));
                  }}
                />
                <button
                  type="button"
                  className="text-red-500 text-sm"
                  onClick={() =>
                    setWelcome((p) => ({
                      ...p,
                      paragraphs: p.paragraphs.filter((_, idx) => idx !== i),
                    }))
                  }
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="CTA text">
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={welcome.ctaText}
                onChange={(e) => setWelcome((p) => ({ ...p, ctaText: e.target.value }))}
              />
            </FormField>
            <FormField label="CTA link">
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={welcome.ctaHref}
                onChange={(e) => setWelcome((p) => ({ ...p, ctaHref: e.target.value }))}
              />
            </FormField>
          </div>
        </div>
      ) : activeSection === "hero" ? (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => openHeroModal()}
            className="px-4 py-2 text-white rounded-lg"
            style={{ backgroundColor: BRAND }}
          >
            + Add hero slide
          </button>
          <DragDropList
            items={heroSlides}
            keyExtractor={(s) => s.id}
            onReorder={async (items) => {
              const ordered = items.map((s, i) => ({ ...s, orderIndex: i }));
              setHeroSlides(ordered);
              await persistOrder(ordered, "hero");
            }}
            renderItem={(slide) => (
              <div className="flex items-center gap-4 flex-1">
                <img
                  src={resolveImagePath(slide.imagePath)}
                  alt={slide.altText}
                  className="w-24 h-14 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{slide.altText || "Hero slide"}</p>
                  <p className="text-xs text-gray-500 truncate">{slide.imagePath}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => openHeroModal(slide)}
                    className="px-3 py-1 text-sm border rounded-lg"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteHeroSlide(slide.id)}
                    className="px-3 py-1 text-sm text-red-600 border border-red-200 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => openFeatureModal()}
            className="px-4 py-2 text-white rounded-lg"
            style={{ backgroundColor: BRAND }}
          >
            + Add feature card
          </button>
          <DragDropList
            items={featureCards}
            keyExtractor={(c) => c.id}
            onReorder={async (items) => {
              const ordered = items.map((c, i) => ({ ...c, orderIndex: i }));
              setFeatureCards(ordered);
              await persistOrder(ordered, "features");
            }}
            renderItem={(card) => (
              <div className="flex items-center gap-4 flex-1">
                {card.imagePath ? (
                  <img
                    src={resolveImagePath(card.imagePath)}
                    alt={card.title}
                    className="w-24 h-14 object-cover rounded"
                  />
                ) : (
                  <div className="w-24 h-14 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
                    No image
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{card.title}</p>
                  <p className="text-xs text-gray-500">
                    {card.ctaText} → {card.ctaHref}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => openFeatureModal(card)}
                    className="px-3 py-1 text-sm border rounded-lg"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteFeatureCard(card.id)}
                    className="px-3 py-1 text-sm text-red-600 border border-red-200 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          />
        </div>
      )}

      <Modal
        isOpen={showHeroModal}
        onClose={() => setShowHeroModal(false)}
        title={editingHero ? "Edit hero slide" : "Add hero slide"}
      >
        <div className="space-y-4">
          <ImageSelector
            label="Slide image"
            required
            value={heroForm.imagePath || null}
            onChange={(v) => setHeroForm((p) => ({ ...p, imagePath: v || "" }))}
          />
          <FormField label="Alt text">
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={heroForm.altText}
              onChange={(e) => setHeroForm((p) => ({ ...p, altText: e.target.value }))}
            />
          </FormField>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={heroForm.isActive}
              onChange={(e) => setHeroForm((p) => ({ ...p, isActive: e.target.checked }))}
            />
            Active on site
          </label>
          <div className="flex justify-end gap-2 pt-4">
            <button type="button" onClick={() => setShowHeroModal(false)} className="px-4 py-2 border rounded-lg">
              Cancel
            </button>
            <button
              type="button"
              onClick={saveHeroSlide}
              disabled={saving}
              className="px-4 py-2 text-white rounded-lg"
              style={{ backgroundColor: BRAND }}
            >
              Save slide
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showFeatureModal}
        onClose={() => setShowFeatureModal(false)}
        title={editingFeature ? "Edit feature card" : "Add feature card"}
      >
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={featureForm.useMultiImages}
              onChange={(e) => setFeatureForm((p) => ({ ...p, useMultiImages: e.target.checked }))}
            />
            Gallery-style card (multiple images)
          </label>
          {featureForm.useMultiImages ? (
            <StringListEditor
              label="Image paths (e.g. /images/gal-hm-img1.jpg)"
              items={featureForm.images}
              onChange={(images) => setFeatureForm((p) => ({ ...p, images }))}
              placeholder="/images/..."
            />
          ) : (
            <ImageSelector
              label="Card image"
              value={featureForm.imagePath || null}
              onChange={(v) => setFeatureForm((p) => ({ ...p, imagePath: v || "" }))}
            />
          )}
          <FormField label="Title" required>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={featureForm.title}
              onChange={(e) => setFeatureForm((p) => ({ ...p, title: e.target.value }))}
            />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="CTA text">
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={featureForm.ctaText}
                onChange={(e) => setFeatureForm((p) => ({ ...p, ctaText: e.target.value }))}
              />
            </FormField>
            <FormField label="CTA link">
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                value={featureForm.ctaHref}
                onChange={(e) => setFeatureForm((p) => ({ ...p, ctaHref: e.target.value }))}
              />
            </FormField>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button type="button" onClick={() => setShowFeatureModal(false)} className="px-4 py-2 border rounded-lg">
              Cancel
            </button>
            <button
              type="button"
              onClick={saveFeatureCard}
              disabled={saving}
              className="px-4 py-2 text-white rounded-lg"
              style={{ backgroundColor: BRAND }}
            >
              Save card
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
