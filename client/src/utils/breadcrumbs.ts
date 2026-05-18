export type BreadcrumbItem = { label: string; href: string };

/** Always returns a safe array for BreadcrumbBar and hooks. */
export function normalizeBreadcrumbs(value: unknown): BreadcrumbItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((row): row is Record<string, unknown> => row != null && typeof row === "object")
    .map((row) => ({
      label: String(row.label ?? ""),
      href: String(row.href ?? ""),
    }))
    .filter((c) => c.label.length > 0);
}

export function mergeWithMock<T extends Record<string, unknown>>(mock: T, api: Partial<T> | null | undefined): T {
  if (!api || typeof api !== "object") return { ...mock };
  const merged = { ...mock, ...api } as T;
  const mockCrumb = mock.breadcrumb;
  const apiCrumb = api.breadcrumb;
  merged.breadcrumb = (
    Array.isArray(apiCrumb) && apiCrumb.length > 0
      ? normalizeBreadcrumbs(apiCrumb)
      : normalizeBreadcrumbs(mockCrumb)
  ) as T["breadcrumb"];
  return merged;
}
