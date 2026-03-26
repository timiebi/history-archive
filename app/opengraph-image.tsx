import { ImageResponse } from "next/og";

export const alt = "Afri Archive — African history, open access";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          background: "linear-gradient(145deg, #0c0a09 0%, #292524 45%, #1c1917 100%)",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "#fb923c",
            marginBottom: 28,
          }}
        >
          Afri Archive
        </div>
        <div
          style={{
            fontSize: 68,
            fontWeight: 800,
            lineHeight: 1.05,
            color: "#fafaf9",
            maxWidth: 900,
          }}
        >
          African history, culture & stories — open access for communities and researchers.
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 22,
            color: "#a8a29e",
            maxWidth: 720,
            lineHeight: 1.4,
          }}
        >
          Digital repatriation, curated narratives, artifacts, and timelines across the continent.
        </div>
      </div>
    ),
    { ...size },
  );
}
