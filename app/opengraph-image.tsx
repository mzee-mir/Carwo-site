import { ImageResponse } from "next/og";

export const alt = "Carwo — bold streetwear. Browse the drop, order on WhatsApp.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0b0b0b", padding: 64 }}>
        <div style={{ display: "flex", color: "#c6ff00", fontSize: 32, fontWeight: 700, letterSpacing: 4 }}>DROP 01 — ORDER ON WHATSAPP</div>
        <div style={{ display: "flex", color: "#f2f0ea", fontSize: 300, fontWeight: 900, letterSpacing: -12, lineHeight: 0.8 }}>CARWO</div>
      </div>
    ),
    size,
  );
}
