export interface EmbroideryCollection {
  label: string;
  path: string;
  tag: string;
  isNew?: boolean;
}

export const EMBROIDERY_COLLECTIONS: EmbroideryCollection[] = [
  {
    label: "Anime",
    path: "/embroidery/anime",
    tag: "embroidery-anime",
  },
  {
    label: "Baby clothing",
    path: "/embroidery/baby-clothing",
    tag: "embroidery-baby-clothing",
  },
  {
    label: "Father's Day",
    path: "/embroidery/fathers-day",
    tag: "embroidery-fathers-day",
  },
  {
    label: "Mother's Day",
    path: "/embroidery/mothers-day",
    tag: "embroidery-mothers-day",
  },
  {
    label: "Seasonal & Holidays",
    path: "/embroidery/seasonal-holidays",
    tag: "embroidery-seasonal-holidays",
  },
  {
    label: "Custom Design Studio",
    path: "/embroidery/custom-designs",
    tag: "embroidery-custom-designs",
    isNew: true,
  },
];
