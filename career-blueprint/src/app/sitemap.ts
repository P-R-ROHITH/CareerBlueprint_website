import type { MetadataRoute } from "next";
import { pages, siteUrl } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((p) => ({ url: `${siteUrl}${p === "/" ? "" : p}` }));
}
