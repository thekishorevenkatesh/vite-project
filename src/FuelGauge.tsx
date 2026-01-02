export function FuelGauge({ fuel }: { fuel: number }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        right: 20,
        width: 160,
        background: "rgba(0,0,0,0.7)",
        padding: 12,
        borderRadius: 8,
        color: "#fff",
        fontSize: 14,
        zIndex: 10, // 🔑 THIS IS THE FIX
        pointerEvents: "auto",
      }}
    >
      <div style={{ marginBottom: 6 }}>Fuel</div>

      <div
        style={{
          width: "100%",
          height: 10,
          background: "#333",
          borderRadius: 6,
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

      <div style={{ marginTop: 6, textAlign: "right" }}>
        {fuel}%
      </div>
    </div>
  );
}

