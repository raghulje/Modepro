import { productsData } from "@/mocks/productsData";

export type ContactProductOption = {
  value: string;
  label: string;
  category: string;
};

export function buildContactProductOptions(): ContactProductOption[] {
  const options: ContactProductOption[] = [
    { value: "General Enquiry", label: "General Enquiry", category: "Other" },
  ];

  for (const tab of productsData.tabs) {
    for (const group of tab.groups) {
      for (const product of group.products) {
        const name = String(product.name || "").trim();
        if (!name) continue;
        const casSuffix = product.casNo ? ` (CAS ${product.casNo})` : "";
        const display = `${name}${casSuffix}`;
        options.push({
          value: display,
          label: display,
          category: `${tab.label} — ${group.name}`,
        });
      }
    }
  }

  return options;
}

export function groupProductOptionsByCategory(
  options: ContactProductOption[] = buildContactProductOptions()
): Map<string, ContactProductOption[]> {
  const map = new Map<string, ContactProductOption[]>();
  for (const opt of options) {
    const list = map.get(opt.category) ?? [];
    list.push(opt);
    map.set(opt.category, list);
  }
  return map;
}
