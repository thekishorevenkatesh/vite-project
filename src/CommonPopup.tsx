import { Html } from "@react-three/drei";

type Props = {
  message: string | null;
};

export function CommonPopup({ message }: Props) {
  if (!message) return null;

  return (
    <Html fullscreen>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          padding: "12px 18px",
          background: "rgba(200,0,0,0.9)",
          color: "#fff",
          borderRadius: 8,
          fontSize: 14,
          whiteSpace: "nowrap",
          pointerEvents: "none",
          userSelect: "none",
          boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
        }}
      >
        {message}
      </div>
    </Html>
  );
}
