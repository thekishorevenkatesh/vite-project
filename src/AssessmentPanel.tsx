import { Html } from "@react-three/drei";
import { useAssessment } from "./AssessmentContext";

export function AssessmentPanel() {
  const { steps } = useAssessment();

  return (
    <Html position={[-1.8, 1.6, 0]}>
      <div style={panelStyle}>
        <div style={titleStyle}>Assessment Steps</div>

        {steps.map(step => (
          <div
            key={step.id}
            style={{
              ...stepStyle,
              opacity: step.status === "locked" ? 0.4 : 1,
              color: step.status === "completed" ? "#4caf50" : "#ffffff",
            }}
          >
            {step.label}
          </div>
        ))}
      </div>
    </Html>
  );
}

const panelStyle: React.CSSProperties = {
  background: "rgba(17, 17, 17, 0.95)",
  borderRadius: "12px",
  padding: "16px 20px",
  width: "260px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const titleStyle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 600,
  marginBottom: "12px",
  color: "#ffffff",
};

const stepStyle: React.CSSProperties = {
  fontSize: "13px",
  padding: "6px 0",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
};
