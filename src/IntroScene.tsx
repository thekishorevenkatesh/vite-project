import { Html } from "@react-three/drei";

export function IntroScene({
  onEnter,
}: {
  onEnter: () => void;
}) {
  return (
    <Html center>
      <div style={styles.container}>
        <h1 style={styles.title}>Motorcycle Showroom</h1>

        <p style={styles.subtitle}>
          Interactive 3D Training Experience
        </p>

        <button style={styles.button} onClick={onEnter}>
          Enter Showroom
        </button>

        <p style={styles.hint}>
          Click on bike components to interact
        </p>
      </div>
    </Html>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    background: "rgba(17, 17, 17, 0.95)",
    borderRadius: "14px",
    padding: "40px 56px",
    width: "420px",
    textAlign: "center",
    boxShadow: "0 25px 60px rgba(0, 0, 0, 0.6)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
  },

  title: {
    fontSize: "30px",
    fontWeight: 600,
    color: "#ffffff",
    marginBottom: "12px",
    letterSpacing: "0.4px",
  },

  subtitle: {
    fontSize: "15px",
    color: "#b3b3b3",
    marginBottom: "32px",
    lineHeight: 1.5,
  },

  button: {
    background: "#ffffff",
    color: "#000000",
    border: "none",
    borderRadius: "6px",
    padding: "14px 28px",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    width: "100%",
  },

  hint: {
    marginTop: "24px",
    fontSize: "13px",
    color: "#8c8c8c",
  },
};
