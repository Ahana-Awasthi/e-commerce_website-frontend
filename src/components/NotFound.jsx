import React from "react";

export default function ErrorPage() {
  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.code}>404</div>

        <h1 style={styles.title}>
          Oops! This page didn’t show up to work today.
        </h1>

        <p style={styles.subtitle}>
          We knocked.  We even asked the server politely.
          <br />
          Nothing. It just… isn’t here.
        </p>

        <div style={styles.actions}>
          <button
            style={styles.primary}
            onClick={() => window.location.reload()}
          >
            Retry  
          </button>

          <button
            style={styles.secondary}
            onClick={() => (window.location.href = "/")}
          >
            Back to Home
          </button>
        </div>

        <p style={styles.footer}>
          If this keeps happening, contact us at shopora@gmail.com
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    height: "80vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    fontFamily: "system-ui",
    padding: 20,
  },
  card: {
    maxWidth: 520,
    width: "100%",
    background: "#111827",
    borderRadius: 16,
    padding: 30,
    textAlign: "center",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
  },
  code: {
    fontSize: 70,
    fontWeight: "800",
    color: "#a78bfa",
    marginBottom: 10,
  },
  title: {
    color: "#ffffff",
    fontSize: 22,
    marginBottom: 10,
  },
  subtitle: {
    color: "#9ca3af",
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 1.5,
  },
  actions: {
    display: "flex",
    gap: 10,
    justifyContent: "center",
    marginBottom: 15,
  },
  primary: {
    background: "#7c3aed",
    border: "none",
    color: "white",
    padding: "10px 14px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 600,
  },
  secondary: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "#e5e7eb",
    padding: "10px 14px",
    borderRadius: 10,
    cursor: "pointer",
  },
  footer: {
    fontSize: 12,
    color: "#6b7280",
  },
};
