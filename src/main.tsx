import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Layout1 from "./pages/Layout1";
import Layout2 from "./pages/Layout2";
import Layout3 from "./pages/Layout3";
import Layout4 from "./pages/Layout4";
import Layout5A from "./pages/Layout5A";
import Layout5B from "./pages/Layout5B";
import Layout5C from "./pages/Layout5C";
import Layout5CSticky from "./pages/Layout5CSticky";
import Layout5D from "./pages/Layout5D";
import "./index.css";

function Router() {
  const [currentPath, setCurrentPath] = useState(window.location.hash || window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      const hash = window.location.hash.replace(/^#/, "");
      const path = hash || window.location.pathname;
      setCurrentPath(path);
    };

    window.addEventListener("hashchange", handleLocationChange);
    window.addEventListener("popstate", handleLocationChange);
    handleLocationChange();

    return () => {
      window.removeEventListener("hashchange", handleLocationChange);
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, []);

  // Normalize path
  const normalized = currentPath.toLowerCase().replace(/^\/+/, "").replace(/^#\/?/, "");

  // Quick switch floating badge
  const SwitcherBar = (
    <div style={{
      position: "fixed",
      bottom: "16px",
      right: "16px",
      zIndex: 9999,
      background: "rgba(18, 17, 16, 0.92)",
      backdropFilter: "blur(14px)",
      border: "1px solid rgba(255, 255, 255, 0.18)",
      boxShadow: "0 10px 35px rgba(0,0,0,0.5)",
      borderRadius: "9999px",
      padding: "6px 12px",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      fontSize: "0.78rem",
      fontFamily: "system-ui, sans-serif",
      flexWrap: "wrap",
      maxWidth: "95vw"
    }}>
      <span style={{ color: "#a8a29e", padding: "0 4px", fontWeight: 700 }}>Layouts:</span>
      <a href="#/" style={{ color: normalized === "" ? "#dda957" : "#fff", fontWeight: normalized === "" ? 700 : 400, textDecoration: "none", padding: "3px 8px", borderRadius: "9999px", background: normalized === "" ? "rgba(221,169,87,0.2)" : "transparent" }}>Origineel</a>
      <a href="#/subsectie1" style={{ color: normalized === "subsectie1" ? "#dda957" : "#fff", fontWeight: normalized === "subsectie1" ? 700 : 400, textDecoration: "none", padding: "3px 8px", borderRadius: "9999px", background: normalized === "subsectie1" ? "rgba(221,169,87,0.2)" : "transparent" }}>1. Grid</a>
      <a href="#/subsectie2" style={{ color: normalized === "subsectie2" ? "#dda957" : "#fff", fontWeight: normalized === "subsectie2" ? 700 : 400, textDecoration: "none", padding: "3px 8px", borderRadius: "9999px", background: normalized === "subsectie2" ? "rgba(221,169,87,0.2)" : "transparent" }}>2. Editorial</a>
      <a href="#/subsectie3" style={{ color: normalized === "subsectie3" ? "#dda957" : "#fff", fontWeight: normalized === "subsectie3" ? 700 : 400, textDecoration: "none", padding: "3px 8px", borderRadius: "9999px", background: normalized === "subsectie3" ? "rgba(221,169,87,0.2)" : "transparent" }}>3. Sidebar</a>
      <a href="#/subsectie4" style={{ color: normalized === "subsectie4" ? "#dda957" : "#fff", fontWeight: normalized === "subsectie4" ? 700 : 400, textDecoration: "none", padding: "3px 8px", borderRadius: "9999px", background: normalized === "subsectie4" ? "rgba(221,169,87,0.2)" : "transparent" }}>4. Accordion</a>
      
      <span style={{ color: "#555", margin: "0 2px" }}>|</span>

      {/* 5A, 5B, 5C, 5C-Sticky, 5D */}
      <a href="#/5a" style={{ color: normalized === "5a" ? "#e2b168" : "#fff", fontWeight: normalized === "5a" ? 700 : 500, textDecoration: "none", padding: "3px 8px", borderRadius: "9999px", background: normalized === "5a" ? "rgba(226,177,104,0.25)" : "transparent" }}>5A (Dark)</a>
      <a href="#/5b" style={{ color: normalized === "5b" ? "#e2b168" : "#fff", fontWeight: normalized === "5b" ? 700 : 500, textDecoration: "none", padding: "3px 8px", borderRadius: "9999px", background: normalized === "5b" ? "rgba(226,177,104,0.25)" : "transparent" }}>5B (Wit)</a>
      <a href="#/5c" style={{ color: (normalized === "5c" || normalized === "subsectie5") ? "#e2b168" : "#fff", fontWeight: (normalized === "5c" || normalized === "subsectie5") ? 700 : 500, textDecoration: "none", padding: "3px 8px", borderRadius: "9999px", background: (normalized === "5c" || normalized === "subsectie5") ? "rgba(226,177,104,0.25)" : "transparent" }}>5C (Long Fade)</a>
      <a href="#/5c-sticky" style={{ color: normalized === "5c-sticky" ? "#e2b168" : "#fff", fontWeight: normalized === "5c-sticky" ? 700 : 500, textDecoration: "none", padding: "3px 8px", borderRadius: "9999px", background: normalized === "5c-sticky" ? "rgba(226,177,104,0.25)" : "transparent" }}>5C (Sticky)</a>
      <a href="#/5d" style={{ color: normalized === "5d" ? "#e2b168" : "#fff", fontWeight: normalized === "5d" ? 700 : 500, textDecoration: "none", padding: "3px 8px", borderRadius: "9999px", background: normalized === "5d" ? "rgba(226,177,104,0.25)" : "transparent" }}>5D (Papier)</a>
    </div>
  );

  let PageComponent = App;
  if (normalized === "subsectie1") PageComponent = Layout1;
  else if (normalized === "subsectie2") PageComponent = Layout2;
  else if (normalized === "subsectie3") PageComponent = Layout3;
  else if (normalized === "subsectie4") PageComponent = Layout4;
  else if (normalized === "5a") PageComponent = Layout5A;
  else if (normalized === "5b") PageComponent = Layout5B;
  else if (normalized === "5c" || normalized === "subsectie5") PageComponent = Layout5C;
  else if (normalized === "5c-sticky") PageComponent = Layout5CSticky;
  else if (normalized === "5d") PageComponent = Layout5D;

  return (
    <>
      <PageComponent />
      {SwitcherBar}
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);
