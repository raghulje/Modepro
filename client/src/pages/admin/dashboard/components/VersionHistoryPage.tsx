import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { api } from "../../../../utils/api";
import Modal from "../../../../components/cms/Modal";

const BRAND = "#0798bc";

interface VersionRow {
  id: number;
  entityType: string;
  entityId: number;
  page: string;
  section: string;
  versionNumber: number;
  createdBy: string;
  createdAt: string;
  changes: string[];
  data: Record<string, unknown>;
}

interface VersionStats {
  totalVersions: number;
  pagesTracked: number;
  latestUpdate: string | null;
}

export default function VersionHistoryPage() {
  const [selectedPage, setSelectedPage] = useState("all");
  const [selectedSection, setSelectedSection] = useState("all");
  const [versions, setVersions] = useState<VersionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoringId, setRestoringId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [stats, setStats] = useState<VersionStats>({
    totalVersions: 0,
    pagesTracked: 0,
    latestUpdate: null,
  });
  const [compareMode, setCompareMode] = useState(false);
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const [previewVersion, setPreviewVersion] = useState<VersionRow | null>(null);
  const [compareResult, setCompareResult] = useState<{
    differences: Array<{ field: string; oldValue: unknown; newValue: unknown }>;
  } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setMessage(null);
    try {
      const params = new URLSearchParams({ limit: "100", offset: "0" });
      if (selectedPage !== "all") params.set("page", selectedPage);
      if (selectedSection !== "all") params.set("section", selectedSection);

      const [histRes, statsRes] = await Promise.all([
        api.get<{ versions: VersionRow[] }>(`/all?${params}`),
        api.get<VersionStats>("/stats"),
      ]);

      if (histRes.success && histRes.data) {
        const rows = (histRes.data as { versions?: VersionRow[] }).versions || [];
        setVersions(
          rows.map((v) => ({
            ...v,
            createdAt: typeof v.createdAt === "string" ? v.createdAt : String(v.createdAt),
          }))
        );
      }
      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data as VersionStats);
      }
    } catch (err: unknown) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to load versions" });
    } finally {
      setLoading(false);
    }
  }, [selectedPage, selectedSection]);

  useEffect(() => {
    load();
  }, [load]);

  const pages = ["all", ...Array.from(new Set(versions.map((v) => v.page)))];
  const sections =
    selectedPage === "all"
      ? ["all"]
      : ["all", ...Array.from(new Set(versions.filter((v) => v.page === selectedPage).map((v) => v.section)))];

  const handleRestore = async (version: VersionRow) => {
    if (
      !confirm(
        `Restore "${version.page} → ${version.section}" to version ${version.versionNumber}? Current content will be overwritten.`
      )
    ) {
      return;
    }
    setRestoringId(version.id);
    setMessage(null);
    try {
      const res = await api.post(`/restore/${version.id}`, {});
      if (res.success) {
        setMessage({
          type: "success",
          text: `Restored to version ${version.versionNumber}. A new version snapshot was recorded.`,
        });
        await load();
      }
    } catch (err: unknown) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Restore failed" });
    } finally {
      setRestoringId(null);
    }
  };

  const toggleCompare = (id: number) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return prev;
      return [...prev, id];
    });
  };

  const runCompare = async () => {
    if (compareIds.length !== 2) return;
    try {
      const res = await api.post<{ differences: Array<{ field: string; oldValue: unknown; newValue: unknown }> }>(
        "/compare",
        { versionId1: compareIds[0], versionId2: compareIds[1] }
      );
      if (res.success && res.data) {
        setCompareResult({ differences: (res.data as { differences: [] }).differences || [] });
      }
    } catch (err: unknown) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Compare failed" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#1F2937]">Version History</h2>
            <p className="text-sm text-[#6B7280] mt-1">View, compare, and restore previous content snapshots</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={compareMode}
                onChange={(e) => {
                  setCompareMode(e.target.checked);
                  if (!e.target.checked) {
                    setCompareIds([]);
                    setCompareResult(null);
                  }
                }}
              />
              Compare mode
            </label>
            {compareMode && compareIds.length === 2 && (
              <button
                type="button"
                onClick={runCompare}
                className="px-4 py-2 text-white rounded-lg text-sm"
                style={{ backgroundColor: BRAND }}
              >
                Compare selected
              </button>
            )}
          </div>
        </div>
      </div>

      {message && (
        <div
          className={`px-4 py-3 rounded-lg text-sm ${
            message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Page</label>
          <select
            value={selectedPage}
            onChange={(e) => {
              setSelectedPage(e.target.value);
              setSelectedSection("all");
            }}
            className="w-full px-3 py-2 border rounded-lg"
          >
            {pages.map((p) => (
              <option key={p} value={p}>
                {p === "all" ? "All pages" : p}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          >
            {sections.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All sections" : s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {compareResult && compareResult.differences.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
          <p className="font-medium mb-2">Comparison ({compareResult.differences.length} field changes)</p>
          <ul className="space-y-1 max-h-40 overflow-y-auto">
            {compareResult.differences.map((d, i) => (
              <li key={i} className="text-gray-700">
                <strong>{d.field}</strong> changed
              </li>
            ))}
          </ul>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12 bg-white rounded-lg border">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: BRAND }} />
        </div>
      ) : versions.length === 0 ? (
        <p className="text-center py-12 bg-white rounded-lg border text-gray-500">
          No version history yet. Edit and save CMS content to create versions.
        </p>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
          {versions.map((version) => (
            <div
              key={version.id}
              className="border rounded-lg p-4 flex flex-wrap gap-4 items-start justify-between"
            >
              {compareMode && (
                <input
                  type="checkbox"
                  checked={compareIds.includes(version.id)}
                  onChange={() => toggleCompare(version.id)}
                  disabled={!compareIds.includes(version.id) && compareIds.length >= 2}
                />
              )}
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 text-white text-xs font-bold rounded" style={{ backgroundColor: BRAND }}>
                    v{version.versionNumber}
                  </span>
                  <span className="font-medium capitalize">
                    {version.page} / {version.section}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(version.createdAt).toLocaleString()} · {version.createdBy}
                </p>
                {version.changes.length > 0 && (
                  <ul className="mt-2 text-xs text-gray-600 list-disc pl-4">
                    {version.changes.map((ch, i) => (
                      <li key={i}>{ch}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewVersion(version)}
                  className="px-3 py-1.5 border rounded-lg text-sm"
                >
                  Preview
                </button>
                <button
                  type="button"
                  onClick={() => handleRestore(version)}
                  disabled={restoringId === version.id}
                  className="px-3 py-1.5 text-white rounded-lg text-sm disabled:opacity-50"
                  style={{ backgroundColor: BRAND }}
                >
                  {restoringId === version.id ? "Restoring..." : "Restore this version"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <p className="text-sm text-gray-600">Total versions</p>
          <p className="text-2xl font-bold">{stats.totalVersions}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <p className="text-sm text-gray-600">Entity types tracked</p>
          <p className="text-2xl font-bold">{stats.pagesTracked}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <p className="text-sm text-gray-600">Latest update</p>
          <p className="text-sm font-bold mt-1">
            {stats.latestUpdate ? new Date(stats.latestUpdate).toLocaleString() : "—"}
          </p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-900">
        <p className="font-medium">Content looks wrong?</p>
        <p className="mt-1 text-amber-800">
          Re-import <code className="bg-amber-100 px-1 rounded">database/modepro_seed_data.sql</code> after setup
          (see <code className="bg-amber-100 px-1 rounded">database/IMPORT.md</code>). Regenerate seed from mocks with{" "}
          <code className="bg-amber-100 px-1 rounded">node server/scripts/generate-seed-sql.js</code>.
        </p>
      </div>

      <Modal isOpen={!!previewVersion} onClose={() => setPreviewVersion(null)} title="Version snapshot" size="xl">
        {previewVersion && (
          <pre className="text-xs bg-gray-50 p-4 rounded-lg overflow-auto max-h-[60vh]">
            {JSON.stringify(previewVersion.data, null, 2)}
          </pre>
        )}
      </Modal>
    </div>
  );
}


