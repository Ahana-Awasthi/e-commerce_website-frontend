import React from "react";
import Navbar from "./Nav";
import CategoriesNav from "./CategoriesNav";
import Footer from "./Footer";
const styles = {
  wrapper: {
    height: "80vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    padding: "20px",
    fontFamily: "system-ui, sans-serif",
  },

  card: {
    width: "100%",
    maxWidth: "520px",
    background: "#111827",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    padding: "30px",
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
  },

  icon: {
    fontSize: "50px",
    marginBottom: "10px",
  },

  title: {
    color: "#ffffff",
    fontSize: "24px",
    marginBottom: "10px",
  },

  subtitle: {
    color: "#9ca3af",
    fontSize: "14px",
    marginBottom: "20px",
    lineHeight: "1.5",
  },

  errorBox: {
    background: "#1f2937",
    color: "#f87171",
    padding: "12px",
    borderRadius: "10px",
    fontSize: "13px",
    marginBottom: "20px",
    wordBreak: "break-word",
    border: "1px solid rgba(248,113,113,0.2)",
  },

  buttonRow: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    marginBottom: "15px",
  },

  primaryBtn: {
    background: "#4f46e5",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },

  secondaryBtn: {
    background: "transparent",
    color: "#e5e7eb",
    border: "1px solid rgba(255,255,255,0.2)",
    padding: "10px 16px",
    borderRadius: "10px",
    cursor: "pointer",
  },

  footer: {
    fontSize: "12px",
    color: "#6b7280",
  },
};
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, info) {
    console.error("🔥 App crashed:", error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
          <>
              <Navbar />
                <CategoriesNav />
          <div style={styles.wrapper}>
            <div style={styles.card}>
              <div style={styles.icon}>💥</div>

              <h1 style={styles.title}>Something went wrong</h1>

              <p style={styles.subtitle}>
                The app hit an unexpected issue. 
                Don’t worry, our team has been notified.
              </p>

              <div style={styles.errorBox}>
                {this.state.error?.message || "Unknown error"}
              </div>

              <div style={styles.buttonRow}>
                <button onClick={this.handleReload} style={styles.primaryBtn}>
                  Reload App
                </button>

                <button onClick={this.handleGoHome} style={styles.secondaryBtn}>
                  Go Home
                </button>
              </div>

              <p style={styles.footer}>
                If this keeps happening, contact our team at shopora@gmail.com
              </p>
            </div>
              </div>
              <Footer></Footer>
        </>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
