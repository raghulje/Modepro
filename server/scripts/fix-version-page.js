const fs = require("fs");
const path = require("path");

const p = path.join(__dirname, "../../client/src/pages/admin/dashboard/components/VersionHistoryPage.tsx");
let c = fs.readFileSync(p, "utf8");

c = c.replace(/<\/?motionlessVersionHistoryPage\s*\/?>/g, (m) => {
  if (m === "<motionlessVersionHistoryPage />") return "__TIMELINE__";
  if (m.startsWith("</")) return "</motionlessVersionHistoryPage>";
  return m;
});
c = c.replace(/<\/motionlessVersionHistoryPage>/g, "</div>");

const timeline = `{loading ? (
        <div className="flex justify-center py-12 bg-white rounded-lg border">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: BRAND }} />
        </div>
      ) : versions.length === 0 ? (
        <p className="text-center py-12 bg-white rounded-lg border text-gray-500">No version history yet.</p>
      ) : (
        <motionlessVersionHistoryPage />
      )}`;

// Fix timeline inner - use only div
const timelineFixed = timeline.replace(/<\/?motionlessVersionHistoryPage\s*\/?>/g, (m) =>
  m.startsWith("</") ? "</motionlessVersionHistoryPage>" : "<motionlessVersionHistoryPage>"
).replace(/<\/motionlessVersionHistoryPage>/g, "</div>").replace(/<motionlessVersionHistoryPage \/>/g, `<motionlessVersionHistoryPage />`);

// This is getting messy - write timeline without any bad tags
const timelineGood = `{loading ? (
        <div className="flex justify-center py-12 bg-white rounded-lg border">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: BRAND }} />
        </div>
      ) : versions.length === 0 ? (
        <p className="text-center py-12 bg-white rounded-lg border text-gray-500">No version history yet.</p>
      ) : (
        <motionlessVersionHistoryPage />
      )}`;
