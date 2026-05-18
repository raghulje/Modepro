import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { api } from "../../../../utils/api";
import CmsPageEditor, { type CmsSlug } from "../../../../components/cms/CmsPageEditor";
import { rndData } from "../../../../mocks/rndData";
import { manufacturingData } from "../../../../mocks/manufacturingData";
import { qualityData } from "../../../../mocks/qualityData";
import { ehsData } from "../../../../mocks/ehsData";
import { capabilitiesData } from "../../../../mocks/capabilitiesData";
import { careersData } from "../../../../mocks/careersData";
import { contactData } from "../../../../mocks/contactData";

const CMS_SLUGS: { value: CmsSlug; label: string }[] = [
  { value: "rnd", label: "R&D" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "quality", label: "Quality" },
  { value: "ehs", label: "EHS" },
  { value: "capabilities", label: "Capabilities" },
  { value: "careers", label: "Careers" },
  { value: "contact", label: "Contact" },
];

const BRAND = "#0798bc";

const MOCK_DEFAULTS: Record<CmsSlug, Record<string, unknown>> = {
  rnd: { ...rndData } as Record<string, unknown>,
  manufacturing: { ...manufacturingData } as Record<string, unknown>,
  quality: { ...qualityData } as Record<string, unknown>,
  ehs: { ...ehsData } as Record<string, unknown>,
  capabilities: { ...capabilitiesData } as Record<string, unknown>,
  careers: { ...careersData } as Record<string, unknown>,
  contact: { ...contactData } as Record<string, unknown>,
};

function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = { ...target };
  for (const key of Object.keys(source)) {
    const sv = source[key];
    const tv = out[key];
    if (
      sv &&
      typeof sv === "object" &&
      !Array.isArray(sv) &&
      tv &&
      typeof tv === "object" &&
      !Array.isArray(tv)
    ) {
      out[key] = deepMerge(tv as Record<string, unknown>, sv as Record<string, unknown>);
    } else if (sv !== undefined) {
      out[key] = sv;
    }
  }
  return out;
}

export default function CmsPagesManagement() {
  const [slug, setSlug] = useState<CmsSlug>(CMS_SLUGS[0].value);
  const [content, setContent] = useState<Record<string, unknown>>(MOCK_DEFAULTS[slug]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const load = useCallback(async (pageSlug: CmsSlug) => {
    setLoading(true);
    setMessage(null);
    const fallback = MOCK_DEFAULTS[pageSlug];
    try {
      const res = await api.get<Record<string, unknown>>(`/cms-pages/${pageSlug}`);
      const payload = res.data && typeof res.data === "object" ? (res.data as Record<string, unknown>) : {};
      setContent(deepMerge({ ...fallback }, payload));
    } catch {
      setContent({ ...fallback });
      setMessage({
        type: "error",
        text: "Loaded defaults (page may not exist in database yet)",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(slug);
  }, [slug, load]);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await api.put(`/cms-pages/${slug}`, { content });
      setMessage({ type: "success", text: `Page "${slug}" saved` });
    } catch (err: unknown) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#1F2937]">CMS Pages</h2>
          <p className="text-sm text-[#6B7280] mt-1">Edit structured content for each slug</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={slug}
            onChange={(e) => setSlug(e.target.value as CmsSlug)}
            className="px-4 py-2 border border-[#D1D5DB] rounded-lg focus:ring-2 focus:ring-[#0798bc] outline-none cursor-pointer"
          >
            {CMS_SLUGS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || loading}
            className="px-4 py-2 text-white rounded-lg disabled:opacity-50 flex items-center gap-2"
            style={{ backgroundColor: BRAND }}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Save
          </button>
        </div>
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
      ) : (
        <div className="border border-[#E5E7EB] rounded-lg p-4 md:p-6 bg-[#FAFAFA]">
          <CmsPageEditor slug={slug} content={content} onChange={setContent} />
        </div>
      )}
    </div>
  );
}
