import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The share card shown when a link is posted on WhatsApp, LinkedIn or Facebook. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "#102A56", color: "white", backgroundImage: "linear-gradient(rgba(37,99,235,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.35) 1px, transparent 1px)", backgroundSize: "48px 48px" }}>
        <div style={{ fontSize: 30, letterSpacing: 6, color: "#D4A843", textTransform: "uppercase" }}>{site.name}</div>
        <div style={{ marginTop: 24, fontSize: 84, lineHeight: 1.08, fontWeight: 700 }}>{site.tagline}</div>
        <div style={{ marginTop: 32, fontSize: 32, color: "#EAF2FF" }}>Interview training · Resume preparation · NIOS coaching · Personality development</div>
      </div>
    ),
    size,
  );
}
