import FormField from "./FormField";
import ImageSelector from "./ImageSelector";
import StringListEditor from "./StringListEditor";

export type CmsSlug =
  | "rnd"
  | "manufacturing"
  | "quality"
  | "ehs"
  | "capabilities"
  | "careers"
  | "contact";

export interface CmsPageEditorProps {
  slug: CmsSlug;
  content: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
}

type Crumb = { label: string; href: string };

function breadcrumbsFrom(v: unknown): Crumb[] {
  if (!Array.isArray(v)) return [{ label: "", href: "" }];
  const rows = v as unknown[];
  if (!rows.length) return [{ label: "", href: "" }];
  return rows.map((r) => {
    const row = r as Record<string, string>;
    return { label: row.label ?? "", href: row.href ?? "" };
  });
}

function BreadcrumbsEditor({
  value,
  onChange,
}: {
  value: unknown;
  onChange: (next: Crumb[]) => void;
}) {
  const items = breadcrumbsFrom(value);
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-700">Breadcrumb trail</p>
      {items.map((c, idx) => (
        <div key={idx} className="flex gap-2">
          <input
            placeholder="Label"
            value={c.label}
            onChange={(e) => {
              const next = items.map((it, i) => (i === idx ? { ...it, label: e.target.value } : it));
              onChange(next);
            }}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <input
            placeholder="Href"
            value={c.href}
            onChange={(e) => {
              const next = items.map((it, i) => (i === idx ? { ...it, href: e.target.value } : it));
              onChange(next);
            }}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <button
            type="button"
            className="text-red-500 text-xs px-1"
            onClick={() => onChange(items.filter((_, i) => i !== idx))}
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, { label: "", href: "" }])}
        className="text-sm text-[#0798bc] hover:underline"
      >
        + Add crumb
      </button>
    </div>
  );
}

function BannerBlock({
  banner,
  onChange,
}: {
  banner: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ImageSelector
        label="Banner image"
        value={(banner.image as string) || null}
        onChange={(p) => onChange({ ...banner, image: p ?? "" })}
      />
      <FormField label="Banner alt text">
        <input
          value={(banner.alt as string) ?? ""}
          onChange={(e) => onChange({ ...banner, alt: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </FormField>
    </div>
  );
}

/** R&D page — rndData.ts */
function RndEditor({ c, onChange }: { c: Record<string, unknown>; onChange: (next: Record<string, unknown>) => void }) {
  const banner = (c.banner || {}) as Record<string, unknown>;
  const intro = (c.intro || {}) as Record<string, unknown>;
  const majorActivities = (c.majorActivities || {}) as Record<string, unknown>;
  const analyticalDevelopment = (c.analyticalDevelopment || {}) as Record<string, unknown>;

  return (
    <div className="space-y-8">
      <BannerBlock banner={banner} onChange={(b) => onChange({ ...c, banner: b })} />
      <BreadcrumbsEditor value={c.breadcrumb} onChange={(b) => onChange({ ...c, breadcrumb: b })} />
      <FormField label="Page title">
        <input
          value={(c.pageTitle as string) ?? ""}
          onChange={(e) => onChange({ ...c, pageTitle: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </FormField>
      <div className="border border-gray-200 rounded-lg p-4 space-y-4">
        <h3 className="font-semibold text-gray-800">Intro</h3>
        <FormField label="Introduction (HTML)" hint="Use &lt;br/&gt; for line breaks">
          <textarea
            value={(intro.htmlIntro as string) ?? ""}
            onChange={(e) =>
              onChange({
                ...c,
                intro: { ...intro, htmlIntro: e.target.value },
              })}
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono text-xs"
          />
        </FormField>
        <ImageSelector
          label="Intro image"
          value={(intro.image as string) || null}
          onChange={(p) =>
            onChange({
              ...c,
              intro: { ...intro, image: p ?? "" },
            })}
        />
        <FormField label="Intro image alt">
          <input
            value={(intro.imageAlt as string) ?? ""}
            onChange={(e) =>
              onChange({
                ...c,
                intro: { ...intro, imageAlt: e.target.value },
              })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </FormField>
      </div>
      <div className="border border-gray-200 rounded-lg p-4 space-y-3">
        <FormField label="Major activities heading">
          <input
            value={(majorActivities.title as string) ?? ""}
            onChange={(e) =>
              onChange({
                ...c,
                majorActivities: { ...majorActivities, title: e.target.value },
              })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </FormField>
        <StringListEditor
          label="Activities"
          items={
            Array.isArray(majorActivities.items)
              ? (majorActivities.items as string[])
              : [""]}
          onChange={(items) =>
            onChange({
              ...c,
              majorActivities: { ...majorActivities, items },
            })}
        />
      </div>
      <div className="border border-gray-200 rounded-lg p-4 space-y-3">
        <h3 className="font-semibold text-gray-800">Analytical development</h3>
        <FormField label="Title">
          <input
            value={(analyticalDevelopment.title as string) ?? ""}
            onChange={(e) =>
              onChange({
                ...c,
                analyticalDevelopment: { ...analyticalDevelopment, title: e.target.value },
              })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </FormField>
        <FormField label="Description">
          <textarea
            value={(analyticalDevelopment.description as string) ?? ""}
            onChange={(e) =>
              onChange({
                ...c,
                analyticalDevelopment: {
                  ...analyticalDevelopment,
                  description: e.target.value,
                },
              })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </FormField>
        <FormField label="Sub-heading">
          <input
            value={(analyticalDevelopment.subTitle as string) ?? ""}
            onChange={(e) =>
              onChange({
                ...c,
                analyticalDevelopment: { ...analyticalDevelopment, subTitle: e.target.value },
              })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </FormField>
        <StringListEditor
          items={
            Array.isArray(analyticalDevelopment.items)
              ? (analyticalDevelopment.items as string[])
              : [""]}
          onChange={(items) =>
            onChange({
              ...c,
              analyticalDevelopment: { ...analyticalDevelopment, items },
            })}
        />
      </div>
    </div>
  );
}

/** manufacturingData.ts */
function ManufacturingEditor({
  c,
  onChange,
}: {
  c: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
}) {
  const banner = (c.banner || {}) as Record<string, unknown>;
  const ww = (c.whereWeAre || {}) as Record<string, unknown>;
  const fac = (c.facilities || {}) as Record<string, unknown>;
  const wh = (c.warehousing || {}) as Record<string, unknown>;
  const imgs = (c.images || {}) as Record<string, unknown>;

  return (
    <div className="space-y-8">
      <BannerBlock banner={banner} onChange={(b) => onChange({ ...c, banner: b })} />
      <BreadcrumbsEditor value={c.breadcrumb} onChange={(b) => onChange({ ...c, breadcrumb: b })} />
      <FormField label="Page title">
        <input
          value={(c.pageTitle as string) ?? ""}
          onChange={(e) => onChange({ ...c, pageTitle: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </FormField>
      <FormField label="Where we are — description">
        <textarea
          value={(ww.description as string) ?? ""}
          onChange={(e) => onChange({ ...c, whereWeAre: { ...ww, description: e.target.value } })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </FormField>
      <div className="border border-gray-200 rounded-lg p-4 space-y-3">
        <StringListEditor
          label="Facilities"
          items={Array.isArray(fac.items) ? (fac.items as string[]) : [""]}
          onChange={(items) => onChange({ ...c, facilities: { ...fac, items } })}
        />
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={!!fac.temperatureUsesSuperscript}
            onChange={(e) =>
              onChange({
                ...c,
                facilities: { ...fac, temperatureUsesSuperscript: e.target.checked },
              })}
          />
          Temperature text uses superscript in UI
        </label>
      </div>
      <div className="border border-gray-200 rounded-lg p-4">
        <StringListEditor
          label="Warehousing"
          items={Array.isArray(wh.items) ? (wh.items as string[]) : [""]}
          onChange={(items) => onChange({ ...c, warehousing: { ...wh, items } })}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-200 rounded-lg p-4">
        <ImageSelector
          label="Manufacturing image (manuImg)"
          value={(imgs.manuImg as string) || null}
          onChange={(p) => onChange({ ...c, images: { ...imgs, manuImg: p ?? "" } })}
        />
        <ImageSelector
          label="Warehouse image"
          value={(imgs.warehouseImg as string) || null}
          onChange={(p) => onChange({ ...c, images: { ...imgs, warehouseImg: p ?? "" } })}
        />
        <ImageSelector
          label="MIPL 4 image"
          value={(imgs.mipl4Img as string) || null}
          onChange={(p) => onChange({ ...c, images: { ...imgs, mipl4Img: p ?? "" } })}
        />
      </div>
    </div>
  );
}

/** qualityData.ts */
function QualityEditor({ c, onChange }: { c: Record<string, unknown>; onChange: (next: Record<string, unknown>) => void }) {
  const banner = (c.banner || {}) as Record<string, unknown>;
  const qa = (c.qualityAssurance || {}) as Record<string, unknown>;
  const qc = (c.qualityControl || {}) as Record<string, unknown>;
  const equip = (c.equipment || {}) as Record<string, unknown>;

  let imagesRaw = Array.isArray(c.images) ? [...(c.images as Record<string, string>[])] : [];
  if (!imagesRaw.length) imagesRaw = [{ src: "", alt: "" }];

  return (
    <div className="space-y-8">
      <BannerBlock banner={banner} onChange={(b) => onChange({ ...c, banner: b })} />
      <BreadcrumbsEditor value={c.breadcrumb} onChange={(b) => onChange({ ...c, breadcrumb: b })} />
      <FormField label="Page title">
        <input
          value={(c.pageTitle as string) ?? ""}
          onChange={(e) => onChange({ ...c, pageTitle: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </FormField>
      <div className="border border-gray-200 rounded-lg p-4 space-y-3">
        <FormField label="Quality assurance heading">
          <input
            value={(qa.title as string) ?? ""}
            onChange={(e) => onChange({ ...c, qualityAssurance: { ...qa, title: e.target.value } })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </FormField>
        <StringListEditor
          label="Paragraphs"
          placeholder="Paragraph…"
          items={Array.isArray(qa.paragraphs) ? (qa.paragraphs as string[]) : [""]}
          onChange={(paragraphs) => onChange({ ...c, qualityAssurance: { ...qa, paragraphs } })}
        />
      </div>
      <div className="border border-gray-200 rounded-lg p-4 space-y-2">
        <FormField label="Quality control heading">
          <input
            value={(qc.title as string) ?? ""}
            onChange={(e) => onChange({ ...c, qualityControl: { ...qc, title: e.target.value } })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </FormField>
        <FormField label="Quality control description">
          <textarea
            value={(qc.description as string) ?? ""}
            onChange={(e) => onChange({ ...c, qualityControl: { ...qc, description: e.target.value } })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </FormField>
      </div>
      <div className="border border-gray-200 rounded-lg p-4 space-y-2">
        <FormField label="Equipment section title">
          <input
            value={(equip.title as string) ?? ""}
            onChange={(e) => onChange({ ...c, equipment: { ...equip, title: e.target.value } })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </FormField>
        <StringListEditor
          label="Equipment list"
          items={Array.isArray(equip.items) ? (equip.items as string[]) : [""]}
          onChange={(items) => onChange({ ...c, equipment: { ...equip, items } })}
        />
      </div>
      <div className="border border-gray-200 rounded-lg p-4 space-y-4">
        <p className="text-sm font-medium text-gray-700">Gallery images</p>
        {imagesRaw.map((img, idx) => (
          <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-gray-100 pb-4">
            <ImageSelector
              label={`Image ${idx + 1}`}
              value={(img.src as string) || null}
              onChange={(p) => {
                const next = imagesRaw.map((it, i) => (i === idx ? { ...it, src: p ?? "" } : it));
                onChange({ ...c, images: next });
              }}
            />
            <FormField label="Alt text">
              <input
                value={img.alt ?? ""}
                onChange={(e) => {
                  const next = imagesRaw.map((it, i) => (i === idx ? { ...it, alt: e.target.value } : it));
                  onChange({ ...c, images: next });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </FormField>
            <div className="md:col-span-2 flex justify-end">
              <button
                type="button"
                className="text-xs text-red-600"
                onClick={() =>
                  onChange({
                    ...c,
                    images: imagesRaw.filter((_, i) => i !== idx),
                  })}
              >
                Remove slide
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="text-sm text-[#0798bc] hover:underline"
          onClick={() => onChange({ ...c, images: [...imagesRaw, { src: "", alt: "" }] })}
        >
          + Add image slot
        </button>
      </div>
    </div>
  );
}

/** ehsData.ts — sections.{infrastructure|policy}.{title, anchor, items} */
function EhsEditor({ c, onChange }: { c: Record<string, unknown>; onChange: (next: Record<string, unknown>) => void }) {
  const banner = (c.banner || {}) as Record<string, unknown>;
  const sections = (c.sections || {}) as Record<string, Record<string, unknown>>;
  const infra = sections.infrastructure || {};
  const policy = sections.policy || {};

  const patchSection = (key: "infrastructure" | "policy", part: Record<string, unknown>) => {
    onChange({
      ...c,
      sections: {
        ...sections,
        [key]: { ...(sections[key] || {}), ...part },
      },
    });
  };

  return (
    <div className="space-y-8">
      <BannerBlock banner={banner} onChange={(b) => onChange({ ...c, banner: b })} />
      <BreadcrumbsEditor value={c.breadcrumb} onChange={(b) => onChange({ ...c, breadcrumb: b })} />
      <FormField label="Page heading (title)">
        <input
          value={(c.title as string) ?? ""}
          onChange={(e) => onChange({ ...c, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </FormField>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {(["infrastructure", "policy"] as const).map((key) => {
          const blk = key === "infrastructure" ? infra : policy;
          return (
            <div key={key} className="border border-gray-200 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold capitalize text-gray-800">{key}</h3>
              <FormField label="Title">
                <input
                  value={(blk.title as string) ?? ""}
                  onChange={(e) => patchSection(key, { title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </FormField>
              <FormField label="Anchor id" hint="For in-page anchors, e.g. infra">
                <input
                  value={(blk.anchor as string) ?? ""}
                  onChange={(e) => patchSection(key, { anchor: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </FormField>
              <StringListEditor
                label="Bullets"
                items={Array.isArray(blk.items) ? (blk.items as string[]) : [""]}
                onChange={(items) => patchSection(key, { items })}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** capabilitiesData.ts */
function CapabilitiesEditor({
  c,
  onChange,
}: {
  c: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
}) {
  const banner = (c.banner || {}) as Record<string, unknown>;
  const table = (c.table || {}) as Record<string, unknown>;
  const headers = Array.isArray(table.headers) ? (table.headers as string[]) : ["", "", ""];
  const rowsRaw = Array.isArray(table.rows) ? [...(table.rows as Record<string, string>[])] : [];
  let rows =
    rowsRaw.length > 0
      ? rowsRaw
      : [
          {
            named: "",
            types: "",
            reagents: "",
          },
        ];

  const patchTable = (nextTable: Record<string, unknown>) =>
    onChange({
      ...c,
      table: { ...table, ...nextTable },
    });

  return (
    <div className="space-y-8">
      <BannerBlock banner={banner} onChange={(b) => onChange({ ...c, banner: b })} />
      <BreadcrumbsEditor value={c.breadcrumb} onChange={(b) => onChange({ ...c, breadcrumb: b })} />
      <FormField label="Page heading (title)">
        <input
          value={(c.title as string) ?? ""}
          onChange={(e) => onChange({ ...c, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </FormField>

      <div className="border border-gray-200 rounded-lg p-4 space-y-4 overflow-x-auto">
        <p className="text-sm font-medium text-gray-700">Reaction table</p>
        <div className="grid grid-cols-3 gap-2 min-w-[480px]">
          {headers.map((h, i) => (
            <FormField key={i} label={`Column header ${i + 1}`}>
              <input
                value={h}
                onChange={(e) => {
                  const next = headers.map((x, idx) => (idx === i ? e.target.value : x));
                  patchTable({ headers: next });
                }}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              />
            </FormField>
          ))}
        </div>
        <table className="min-w-full text-xs border-collapse">
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="border px-2 py-1 bg-gray-50 text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                {(["named", "types", "reagents"] as const).map((col) => (
                  <td key={col} className="border p-1">
                    <input
                      value={row[col] ?? ""}
                      onChange={(e) => {
                        const nextRows = rows.map((tr, ix) =>
                          ix === ri ? { ...tr, [col]: e.target.value } : tr,
                        );
                        patchTable({ rows: nextRows });
                      }}
                      className="w-full px-2 py-1 border border-gray-200 rounded-sm"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex gap-4">
          <button
            type="button"
            className="text-sm text-[#0798bc] hover:underline"
            onClick={() => patchTable({ rows: [...rows, { named: "", types: "", reagents: "" }] })}
          >
            + Add row
          </button>
          <button
            type="button"
            disabled={rows.length <= 1}
            className="text-sm text-red-600 hover:underline disabled:opacity-40"
            onClick={() => patchTable({ rows: rows.slice(0, -1) })}
          >
            Remove last row
          </button>
        </div>
      </div>
    </div>
  );
}

/** careersData.ts */
function CareersEditor({
  c,
  onChange,
}: {
  c: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
}) {
  const banner = (c.banner || {}) as Record<string, unknown>;
  const sections = (c.sections || {}) as Record<string, Record<string, unknown>>;
  const welcome = sections.welcome || {};
  const openings = sections.openings || {};

  const patch = (sk: "welcome" | "openings", part: Record<string, unknown>) => {
    onChange({
      ...c,
      sections: {
        ...sections,
        [sk]: { ...(sections[sk] || {}), ...part },
      },
    });
  };

  return (
    <div className="space-y-8">
      <BannerBlock banner={banner} onChange={(b) => onChange({ ...c, banner: b })} />
      <BreadcrumbsEditor value={c.breadcrumb} onChange={(b) => onChange({ ...c, breadcrumb: b })} />
      <FormField label="Page heading (title)">
        <input
          value={(c.title as string) ?? ""}
          onChange={(e) => onChange({ ...c, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </FormField>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-gray-200 rounded-lg p-4 space-y-3">
          <h3 className="font-semibold text-gray-800">Welcome</h3>
          <FormField label="Heading">
            <input
              value={(welcome.title as string) ?? ""}
              onChange={(e) => patch("welcome", { title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </FormField>
          <FormField label="Anchor id">
            <input
              value={(welcome.anchor as string) ?? ""}
              onChange={(e) => patch("welcome", { anchor: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </FormField>
          <FormField label="Copy">
            <textarea
              rows={5}
              value={(welcome.text as string) ?? ""}
              onChange={(e) => patch("welcome", { text: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </FormField>
        </div>
        <div className="border border-gray-200 rounded-lg p-4 space-y-3">
          <h3 className="font-semibold text-gray-800">Current openings</h3>
          <FormField label="Heading">
            <input
              value={(openings.title as string) ?? ""}
              onChange={(e) => patch("openings", { title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </FormField>
          <FormField label="Anchor id">
            <input
              value={(openings.anchor as string) ?? ""}
              onChange={(e) => patch("openings", { anchor: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </FormField>
          <FormField label="Text">
            <textarea
              rows={3}
              value={(openings.text as string) ?? ""}
              onChange={(e) => patch("openings", { text: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </FormField>
          <FormField label="Sub text">
            <input
              value={(openings.subText as string) ?? ""}
              onChange={(e) => patch("openings", { subText: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </FormField>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <FormField label="Email displayed">
              <input
                value={(openings.email as string) ?? ""}
                onChange={(e) => patch("openings", { email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </FormField>
            <FormField label="Email href">
              <input
                value={(openings.emailHref as string) ?? ""}
                onChange={(e) => patch("openings", { emailHref: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </FormField>
          </div>
        </div>
      </div>
    </div>
  );
}

/** contactData.ts */
function ContactEditor({
  c,
  onChange,
}: {
  c: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
}) {
  const banner = (c.banner || {}) as Record<string, unknown>;
  const addr = (c.address || {}) as Record<string, unknown>;
  const phone = (c.phone || {}) as Record<string, unknown>;
  const emailBlk = (c.email || {}) as Record<string, unknown>;
  const mapBlk = (c.map || {}) as Record<string, unknown>;

  let numbers = Array.isArray(phone.numbers) ? ([...(phone.numbers as string[])] ?? []) : [""];
  if (!numbers.length) numbers = [""];

  let emailRows = Array.isArray(emailBlk.addresses)
    ? [...(emailBlk.addresses as { label?: string; href?: string }[])]
    : [];
  if (!emailRows.length) emailRows = [{ label: "", href: "" }];

  return (
    <div className="space-y-8">
      <BannerBlock banner={banner} onChange={(b) => onChange({ ...c, banner: b })} />
      <BreadcrumbsEditor value={c.breadcrumb} onChange={(b) => onChange({ ...c, breadcrumb: b })} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField label="Title">
          <input
            value={(c.title as string) ?? ""}
            onChange={(e) => onChange({ ...c, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </FormField>
        <FormField label="Title highlight segment">
          <input
            value={(c.titleHighlight as string) ?? ""}
            onChange={(e) => onChange({ ...c, titleHighlight: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </FormField>
        <FormField label="Reach-us heading">
          <input
            value={(c.reachTitle as string) ?? ""}
            onChange={(e) => onChange({ ...c, reachTitle: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </FormField>
      </div>

      <div className="border border-gray-200 rounded-lg p-4 space-y-4">
        <FormField label="Address label">
          <input
            value={(addr.label as string) ?? ""}
            onChange={(e) => onChange({ ...c, address: { ...addr, label: e.target.value } })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </FormField>
        <FormField label="Address (HTML)" hint="Use line breaks via &lt;br/&gt;">
          <textarea
            rows={5}
            value={(addr.html as string) ?? ""}
            onChange={(e) => onChange({ ...c, address: { ...addr, html: e.target.value } })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono text-xs"
          />
        </FormField>
      </div>

      <div className="border border-gray-200 rounded-lg p-4 space-y-3">
        <FormField label="Phone row label">
          <input
            value={(phone.label as string) ?? ""}
            onChange={(e) => onChange({ ...c, phone: { ...phone, label: e.target.value } })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </FormField>
        <StringListEditor label="Numbers" placeholder="+91-…" items={numbers} onChange={(numbers) =>
          onChange({ ...c, phone: { ...phone, numbers } })
        }
        />
      </div>

      <div className="border border-gray-200 rounded-lg p-4 space-y-3">
        <FormField label="Email block label">
          <input
            value={(emailBlk.label as string) ?? ""}
            onChange={(e) =>
              onChange({
                ...c,
                email: { ...emailBlk, label: e.target.value, addresses: emailRows },
              })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </FormField>
        {emailRows.map((row, idx) => (
          <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              placeholder="label@..."
              value={row.label ?? ""}
              onChange={(e) => {
                const next = emailRows.map((r, i) => (i === idx ? { ...r, label: e.target.value } : r));
                onChange({ ...c, email: { ...emailBlk, addresses: next } });
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <input
              placeholder="mailto:…"
              value={row.href ?? ""}
              onChange={(e) => {
                const next = emailRows.map((r, i) => (i === idx ? { ...r, href: e.target.value } : r));
                onChange({ ...c, email: { ...emailBlk, addresses: next } });
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        ))}
        <div className="flex gap-3">
          <button
            type="button"
            className="text-sm text-[#0798bc] hover:underline"
            onClick={() =>
              onChange({
                ...c,
                email: { ...emailBlk, addresses: [...emailRows, { label: "", href: "" }] },
              })}
          >
            + Email line
          </button>
          <button
            type="button"
            className="text-sm text-red-600 hover:underline disabled:opacity-40"
            disabled={emailRows.length < 2}
            onClick={() =>
              onChange({
                ...c,
                email: {
                  ...emailBlk,
                  addresses: emailRows.filter((_, i) => i !== emailRows.length - 1),
                },
              })}
          >
            Remove last
          </button>
        </div>
      </div>

      <FormField label="Google Maps embed URL">
        <textarea
          rows={3}
          value={(mapBlk.embedSrc as string) ?? ""}
          onChange={(e) => onChange({ ...c, map: { ...mapBlk, embedSrc: e.target.value } })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono"
        />
      </FormField>
    </div>
  );
}

export default function CmsPageEditor({ slug, content, onChange }: CmsPageEditorProps) {
  const c = content;
  switch (slug) {
    case "rnd":
      return <RndEditor c={c} onChange={onChange} />;
    case "manufacturing":
      return <ManufacturingEditor c={c} onChange={onChange} />;
    case "quality":
      return <QualityEditor c={c} onChange={onChange} />;
    case "ehs":
      return <EhsEditor c={c} onChange={onChange} />;
    case "capabilities":
      return <CapabilitiesEditor c={c} onChange={onChange} />;
    case "careers":
      return <CareersEditor c={c} onChange={onChange} />;
    case "contact":
      return <ContactEditor c={c} onChange={onChange} />;
    default:
      return null;
  }
}
