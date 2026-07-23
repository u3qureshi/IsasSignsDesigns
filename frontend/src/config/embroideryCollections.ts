export interface EmbroideryCollection {
  label: string;
  path: string;
  category: string;
}

export const EMBROIDERY_COLLECTIONS: EmbroideryCollection[] = [
  {
    label: "Anime",
    path: "/embroidery/anime",
    category: "embroidery-anime",
  },
  {
    label: "Baby clothing",
    path: "/embroidery/baby-clothing",
    category: "embroidery-baby-clothing",
  },
  {
    label: "Father's Day",
    path: "/embroidery/fathers-day",
    category: "embroidery-fathers-day",
  },
  {
    label: "Mother's Day",
    path: "/embroidery/mothers-day",
    category: "embroidery-mothers-day",
  },
  {
    label: "Seasonal & Holidays",
    path: "/embroidery/seasonal-holidays",
    category: "embroidery-seasonal-holidays",
  },
  {
    label: "Custom Designs",
    path: "/embroidery/custom-designs",
    category: "embroidery-custom-designs",
  },
];
