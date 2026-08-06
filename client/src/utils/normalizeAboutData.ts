import type { aboutData } from "@/mocks/aboutData";
import { asStringArray } from "@/utils/safeArrays";

export type AboutData = typeof aboutData;

export function normalizeAboutData(data: AboutData): AboutData {
  return {
    ...data,
    whoWeAre: data.whoWeAre
      ? {
          ...data.whoWeAre,
          paragraphs: asStringArray(data.whoWeAre.paragraphs),
        }
      : data.whoWeAre,
    infoCards: (data.infoCards ?? []).map((card) => {
      const paragraphs = asStringArray(
        "paragraphs" in card ? (card as { paragraphs?: unknown }).paragraphs : undefined
      );
      if (paragraphs.length > 0) {
        return { ...card, paragraphs };
      }
      return {
        ...card,
        description: ("description" in card ? card.description : "") ?? "",
      };
    }),
  };
}
