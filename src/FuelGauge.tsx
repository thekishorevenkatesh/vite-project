import { useEffect, useState } from "react";

type FuelGaugeProps = {
  fuel: number;
  size?: number; // optional
};

export function FuelGauge({ fuel, size }: FuelGaugeProps) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const gaugeWidth = size ?? Math.min(160, windowWidth * 0.15); // use size if provided
  const padding = Math.max(8, windowWidth * 0.01);
  const fontSize = Math.min(14, windowWidth * 0.008);
  const barHeight = Math.max(8, gaugeWidth * 0.06);

  return (
    <div
      style={{
        position: "absolute",
        top: padding,
        right: padding,
        width: gaugeWidth,
        background: "rgba(0,0,0,0.7)",
        padding: padding,
        borderRadius: 8,
        color: "#fff",
        fontSize: fontSize,
        zIndex: 10,
        pointerEvents: "auto",
        fontFamily: "Open Sans, sans-serif",
      }}
    >
      <div style={{ marginBottom: padding / 2 }}>Fuel</div>

      <div
        style={{
          width: "100%",
          height: barHeight,
          background: "#333",
          borderRadius: barHeight / 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${fuel}%`,
            height: "100%",
            background: fuel === 100 ? "#00e676" : "#ffae00",
            transition: "width 0.4s ease",
          }}
        />
      </div>

      <div style={{ marginTop: padding / 2, textAlign: "right" }}>{fuel}%</div>
    </div>
  );
}
