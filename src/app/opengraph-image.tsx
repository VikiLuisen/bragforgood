import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "bragforgood — Yeah, but for good.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0a0a0b 0%, #111113 50%, #0a0a0b 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #34d399, #059669)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: 800,
              color: "#0a0a0b",
            }}
          >
            b
          </div>
          <span
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#e4e4e7",
              letterSpacing: "-0.5px",
            }}
          >
            bragforgood
          </span>
        </div>

        <div
          style={{
            fontSize: "64px",
            fontWeight: 800,
            color: "#fafafa",
            textAlign: "center",
            lineHeight: 1.1,
            letterSpacing: "-2px",
          }}
        >
          Wait, you&apos;re bragging?
        </div>

        <div
          style={{
            fontSize: "48px",
            fontWeight: 700,
            background: "linear-gradient(90deg, #34d399, #059669)",
            backgroundClip: "text",
            color: "transparent",
            marginTop: "16px",
          }}
        >
          Yeah, but for good.
        </div>

        <div
          style={{
            fontSize: "20px",
            color: "#71717a",
            marginTop: "32px",
            textAlign: "center",
          }}
        >
          The only place where showing off makes the world better.
        </div>
      </div>
    ),
    { ...size }
  );
}
