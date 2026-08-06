/** Coerce JSON/null/undefined into a string array safe for .map(). */
export function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" ? item : String(item ?? "")))
    .filter((s) => s.length > 0);
}
