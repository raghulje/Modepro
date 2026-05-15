export const DEFAULT_COUNTRY_DIAL_CODE = "+91";

export function normalizeDialCode(dial: string): string {
  let d = String(dial || "").trim();
  if (!d) return "+91";
  if (!d.startsWith("+")) d = `+${d.replace(/\D/g, "")}`;
  return d;
}
