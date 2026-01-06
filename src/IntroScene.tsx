import { Html } from "@react-three/drei";

export function IntroScene({ onEnter }: { onEnter: () => void }) {
  return (
    <>
      {/* 🔹 CENTER CARD */}
      <Html center>
        <div style={styles.container}>
          <h1 style={styles.title}>Motorcycle Workshop</h1>

          <p style={styles.subtitle}>
            Interactive 3D Training Experience
          </p>

          <button style={styles.button} onClick={onEnter}>
            Enter Workshop
          </button>

          <p style={styles.hint}>
            Click on bike highlighted components to interact
          </p>
        </div>
      </Html>

      {/* 🔹 FOOTER (SCREEN SPACE) */}
      <Html
        fullscreen
        transform={false}
        zIndexRange={[10, 0]}
        style={{
          pointerEvents: "none",
        }}
      >
        <div style={styles.footerWrapper}>
          <div style={styles.footer}>
            <span style={styles.poweredText}>Powered by</span>
            <img
              src="/logo-exathought.png"
              alt="ExaThought"
              style={styles.logo}
            />
          </div>
        </div>
      </Html>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  /* 🔹 Center Card */
  container: {
    background: "#1D3D9F",
    borderRadius: "14px",
    padding: "40px 56px",
    width: "420px",
    textAlign: "center",
    boxShadow: "0 25px 60px rgba(85, 84, 84, 0.6)",
  },

  title: {
    fontSize: "30px",
    fontWeight: 600,
    color: "#fff",
    marginBottom: "12px",
  },

  subtitle: {
    fontSize: "15px",
    color: "#cfcfcf",
    marginBottom: "32px",
  },

  button: {
    background: "#fff",
    color: "#000",
    border: "none",
    borderRadius: "6px",
    padding: "14px",
    fontSize: "15px",
    fontWeight: 600,
    width: "100%",
    cursor: "pointer",
  },

  hint: {
    marginTop: "24px",
    fontSize: "13px",
    color: "#fff",
  },

  /* 🔹 Footer Wrapper (important) */
  footerWrapper: {
    position: "absolute",
    inset: 0, // full screen
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingBottom: "16px",
  },

  footer: {
    display: "flex",
    alignItems: "center",
    opacity: 0.75,
  },

  poweredText: {
    fontSize: "12px",
    color: "#666",
  },

  logo: {
    height: "22px",
  },
};
