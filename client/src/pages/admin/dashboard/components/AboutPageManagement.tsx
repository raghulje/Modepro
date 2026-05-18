import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { api } from "../../../../utils/api";
import FormField from "../../../../components/cms/FormField";
import ImageSelector from "../../../../components/cms/ImageSelector";
import DragDropList from "../../../../components/cms/DragDropList";
import Modal from "../../../../components/cms/Modal";
import StringListEditor from "../../../../components/cms/StringListEditor";
import { resolveImagePath } from "../../../../utils/imageUrl";

const BRAND = "#0798bc";

type Tab = "banner" | "whoweare" | "ourpeople" | "location" | "cards";

interface WhoWeAre {
  image: string;
  alt: string;
  title: string;
  paragraphs: string[];
}

interface OurPeople {
  image: string;
  alt: string;
  title: string;
  description: string;
}

interface ManufacturingLocation {
  title: string;
  location: string;
  address: string;
  image: string;
  alt: string;
}

interface AboutPageRow {
  bannerImage: string | null;
  bannerAlt: string | null;
  pageTitle: string | null;
  whoWeAre: WhoWeAre | null;
  ourPeople: OurPeople | null;
  manufacturingLocation: ManufacturingLocation | null;
}

interface InfoCard {
  id: number;
  cardKey: string;
  title: string;
  imagePath: string | null;
  altText: string | null;
  description: string | null;
  paragraphs: string[] | null;
  orderIndex: number;
}

const defaultWho: WhoWeAre = { image: "", alt: "", title: "", paragraphs: [""] };
const defaultPeople: OurPeople = { image: "", alt: "", title: "", description: "" };
const defaultLoc: ManufacturingLocation = {
  title: "",
  location: "",
  address: "",
  image: "",
  alt: "",
};

export default function AboutPageManagement() {
  const [tab, setTab] = useState<Tab>("banner");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [bannerAlt, setBannerAlt] = useState("");
  const [pageTitle, setPageTitle] = useState("");
  const [whoWeAre, setWhoWeAre] = useState<WhoWeAre>(defaultWho);
  const [ourPeople, setOurPeople] = useState<OurPeople>(defaultPeople);
  const [mfgLocation, setMfgLocation] = useState<ManufacturingLocation>(defaultLoc);

  const [cards, setCards] = useState<InfoCard[]>([]);
  const [cardModal, setCardModal] = useState(false);
  const [editingCard, setEditingCard] = useState<InfoCard | null>(null);
  const [cardForm, setCardForm] = useState({
    cardKey: "",
    title: "",
    imagePath: "",
    altText: "",
    description: "",
    paragraphs: [] as string[],
    useParagraphs: false,
  });

  const load = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const [pageRes, cardsRes] = await Promise.all([
        api.get<AboutPageRow>("/about/page"),
        api.get<InfoCard[]>("/about/info-cards"),
      ]);
      const p = pageRes.data as AboutPageRow;
      if (p) {
        setBannerImage(p.bannerImage);
        setBannerAlt(p.bannerAlt || "");
        setPageTitle(p.pageTitle || "");
        if (p.whoWeAre) setWhoWeAre({ ...defaultWho, ...p.whoWeAre, paragraphs: p.whoWeAre.paragraphs?.length ? p.whoWeAre.paragraphs : [""] });
        if (p.ourPeople) setOurPeople({ ...defaultPeople, ...p.ourPeople });
        if (p.manufacturingLocation) setMfgLocation({ ...defaultLoc, ...p.manufacturingLocation });
      }
      setCards((cardsRes.data as InfoCard[]) || []);
    } catch (err: unknown) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to load" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const savePage = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await api.put("/about", {
        bannerImage,
        bannerAlt,
        pageTitle,
        whoWeAre,
        ourPeople,
        manufacturingLocation: mfgLocation,
      });
      setMessage({ type: "success", text: "About page saved" });
    } catch (err: unknown) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  const openCardModal = (card?: InfoCard) => {
    if (card) {
      setEditingCard(card);
      const hasParas = Boolean(card.paragraphs?.length);
      setCardForm({
        cardKey: card.cardKey,
        title: card.title,
        imagePath: card.imagePath || "",
        altText: card.altText || "",
        description: card.description || "",
        paragraphs: card.paragraphs?.length ? card.paragraphs : [""],
        useParagraphs: hasParas,
      });
    } else {
      setEditingCard(null);
      setCardForm({
        cardKey: "",
        title: "",
        imagePath: "",
        altText: "",
        description: "",
        paragraphs: [""],
        useParagraphs: false,
      });
    }
    setCardModal(true);
  };

  const saveCard = async () => {
    if (!cardForm.cardKey || !cardForm.title) {
      alert("Card key and title are required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        cardKey: cardForm.cardKey,
        title: cardForm.title,
        imagePath: cardForm.imagePath || null,
        altText: cardForm.altText || null,
        description: cardForm.useParagraphs ? null : cardForm.description || null,
        paragraphs: cardForm.useParagraphs ? cardForm.paragraphs.filter(Boolean) : null,
      };
      if (editingCard) {
        await api.put(`/about/info-cards/${editingCard.id}`, payload);
      } else {
        await api.post("/about/info-cards", { ...payload, orderIndex: cards.length });
      }
      setCardModal(false);
      await load();
      setMessage({ type: "success", text: "Info card saved" });
    } catch (err: unknown) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "banner", label: "Banner & Title" },
    { id: "whoweare", label: "Who We Are" },
    { id: "ourpeople", label: "Our People" },
    { id: "location", label: "Manufacturing" },
    { id: "cards", label: "Info Cards" },
  ];

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: BRAND }} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#1F2937]">About Page</h2>
          <p className="text-sm text-[#6B7280] mt-1">Banner, sections, and info cards</p>
        </div>
        {tab !== "cards" && (
          <button type="button" onClick={savePage} disabled={saving} className="px-4 py-2 text-white rounded-lg disabled:opacity-50 flex items-center gap-2" style={{ backgroundColor: BRAND }}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Save section
          </button>
        )}
      </div>
      {message && (
        <div className={`px-4 py-3 rounded-lg text-sm ${message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
          {message.text}
        </div>
      )}
      <div className="flex flex-wrap gap-2 border-b pb-2">{tabs.map((t) => (
        <button key={t.id} type="button" onClick={() => setTab(t.id)} className={`px-4 py-2 text-sm rounded-t-lg ${tab === t.id ? "text-white" : "text-gray-500"}`} style={tab === t.id ? { backgroundColor: BRAND } : undefined}>{t.label}</button>
      ))}</div>
      {tab === "banner" && (
        <div className="space-y-4 max-w-3xl">
          <ImageSelector label="Banner image" value={bannerImage} onChange={setBannerImage} />
          <FormField label="Banner alt"><input className="w-full px-3 py-2 border rounded-lg" value={bannerAlt} onChange={(e) => setBannerAlt(e.target.value)} /></FormField>
          <FormField label="Page title"><input className="w-full px-3 py-2 border rounded-lg" value={pageTitle} onChange={(e) => setPageTitle(e.target.value)} /></FormField>
        </div>
      )}
      {tab === "whoweare" && (
        <div className="space-y-4 max-w-3xl">
          <ImageSelector label="Section image" value={whoWeAre.image || null} onChange={(v) => setWhoWeAre((p) => ({ ...p, image: v || "" }))} />
          <FormField label="Image alt"><input className="w-full px-3 py-2 border rounded-lg" value={whoWeAre.alt} onChange={(e) => setWhoWeAre((p) => ({ ...p, alt: e.target.value }))} /></FormField>
          <FormField label="Title"><input className="w-full px-3 py-2 border rounded-lg" value={whoWeAre.title} onChange={(e) => setWhoWeAre((p) => ({ ...p, title: e.target.value }))} /></FormField>
          <StringListEditor label="Paragraphs" items={whoWeAre.paragraphs} onChange={(paragraphs) => setWhoWeAre((p) => ({ ...p, paragraphs }))} placeholder="Paragraph" />
        </div>
      )}
      {tab === "ourpeople" && (
        <div className="space-y-4 max-w-3xl">
          <ImageSelector label="Section image" value={ourPeople.image || null} onChange={(v) => setOurPeople((p) => ({ ...p, image: v || "" }))} />
          <FormField label="Image alt"><input className="w-full px-3 py-2 border rounded-lg" value={ourPeople.alt} onChange={(e) => setOurPeople((p) => ({ ...p, alt: e.target.value }))} /></FormField>
          <FormField label="Title"><input className="w-full px-3 py-2 border rounded-lg" value={ourPeople.title} onChange={(e) => setOurPeople((p) => ({ ...p, title: e.target.value }))} /></FormField>
          <FormField label="Description"><textarea className="w-full px-3 py-2 border rounded-lg" rows={4} value={ourPeople.description} onChange={(e) => setOurPeople((p) => ({ ...p, description: e.target.value }))} /></FormField>
        </div>
      )}
      {tab === "location" && (
        <div className="space-y-4 max-w-3xl">
          <FormField label="Section title"><input className="w-full px-3 py-2 border rounded-lg" value={mfgLocation.title} onChange={(e) => setMfgLocation((p) => ({ ...p, title: e.target.value }))} /></FormField>
          <FormField label="Location"><input className="w-full px-3 py-2 border rounded-lg" value={mfgLocation.location} onChange={(e) => setMfgLocation((p) => ({ ...p, location: e.target.value }))} /></FormField>
          <FormField label="Address"><textarea className="w-full px-3 py-2 border rounded-lg" rows={3} value={mfgLocation.address} onChange={(e) => setMfgLocation((p) => ({ ...p, address: e.target.value }))} /></FormField>
          <ImageSelector label="Map / location image" value={mfgLocation.image || null} onChange={(v) => setMfgLocation((p) => ({ ...p, image: v || "" }))} />
          <FormField label="Image alt"><input className="w-full px-3 py-2 border rounded-lg" value={mfgLocation.alt} onChange={(e) => setMfgLocation((p) => ({ ...p, alt: e.target.value }))} /></FormField>
        </div>
      )}
      {tab === "cards" && (
        <div className="space-y-4">
          <button type="button" onClick={() => openCardModal()} className="px-4 py-2 text-white rounded-lg" style={{ backgroundColor: BRAND }}>+ Add info card</button>
          <DragDropList items={cards} keyExtractor={(c) => c.id} onReorder={async (items) => {
            const ordered = items.map((c, i) => ({ ...c, orderIndex: i }));
            setCards(ordered);
            for (const c of ordered) await api.put(`/about/info-cards/${c.id}`, { orderIndex: c.orderIndex });
          }} renderItem={(card) => (
            <div className="flex items-center gap-4 flex-1">
              {card.imagePath ? <img src={resolveImagePath(card.imagePath)} alt="" className="w-16 h-16 object-cover rounded" /> : <div className="w-16 h-16 bg-gray-100 rounded" />}
              <div className="flex-1"><p className="font-medium">{card.title}</p><p className="text-xs text-gray-500">{card.cardKey}</p></div>
              <button type="button" className="px-3 py-1 border rounded-lg text-sm" onClick={() => openCardModal(card)}>Edit</button>
              <button type="button" className="px-3 py-1 text-red-600 border border-red-200 rounded-lg text-sm" onClick={async () => { if (confirm("Delete?")) { await api.delete(`/about/info-cards/${card.id}`); await load(); } }}>Delete</button>
            </div>
          )} />
        </div>
      )}
      <Modal isOpen={cardModal} onClose={() => setCardModal(false)} title={editingCard ? "Edit info card" : "Add info card"}>
        <div className="space-y-4">
          <FormField label="Card key (anchor id)" required><input className="w-full px-3 py-2 border rounded-lg" value={cardForm.cardKey} onChange={(e) => setCardForm((p) => ({ ...p, cardKey: e.target.value }))} disabled={!!editingCard} /></FormField>
          <FormField label="Title" required><input className="w-full px-3 py-2 border rounded-lg" value={cardForm.title} onChange={(e) => setCardForm((p) => ({ ...p, title: e.target.value }))} /></FormField>
          <ImageSelector label="Image" value={cardForm.imagePath || null} onChange={(v) => setCardForm((p) => ({ ...p, imagePath: v || "" }))} />
          <FormField label="Alt text"><input className="w-full px-3 py-2 border rounded-lg" value={cardForm.altText} onChange={(e) => setCardForm((p) => ({ ...p, altText: e.target.value }))} /></FormField>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={cardForm.useParagraphs} onChange={(e) => setCardForm((p) => ({ ...p, useParagraphs: e.target.checked }))} />Use multiple paragraphs (instead of single description)</label>
          {cardForm.useParagraphs ? (
            <StringListEditor label="Paragraphs" items={cardForm.paragraphs} onChange={(paragraphs) => setCardForm((p) => ({ ...p, paragraphs }))} />
          ) : (
            <FormField label="Description"><textarea className="w-full px-3 py-2 border rounded-lg" rows={4} value={cardForm.description} onChange={(e) => setCardForm((p) => ({ ...p, description: e.target.value }))} /></FormField>
          )}
          <button type="button" onClick={saveCard} disabled={saving} className="px-4 py-2 text-white rounded-lg" style={{ backgroundColor: BRAND }}>Save card</button>
        </div>
      </Modal>
    </div>
  );
}
