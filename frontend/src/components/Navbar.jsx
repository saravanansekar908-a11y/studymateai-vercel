import { useEffect, useState } from "react";
import { FaUserCircle, FaBars } from "react-icons/fa";
import { getCurrentUser } from "../api/auth";
import { getAiStatus } from "../api/ai";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [aiStatus, setAiStatus] = useState(null);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);

    const currentUser = getCurrentUser();
    setUser(currentUser);

    getAiStatus()
      .then((data) => setAiStatus(data))
      .catch(() => {});

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMobileSidebar = () => {
    window.dispatchEvent(new CustomEvent("toggle-mobile-sidebar"));
  };

  return (
    <header
      style={{
        height: "64px",
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(12px)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: isMobile ? "0 16px" : "0 32px",
        borderBottom: "1px solid #E2E8F0",
        position: "sticky",
        top: 0,
        zIndex: 40,
        boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {isMobile && (
          <button
            onClick={toggleMobileSidebar}
            style={{
              background: "#F1F5F9",
              border: "1px solid #CBD5E1",
              color: "#1E293B",
              padding: "8px 10px",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="Toggle menu"
          >
            <FaBars size={18} />
          </button>
        )}

        <h2
          style={{
            margin: 0,
            fontSize: isMobile ? "15px" : "18px",
            fontWeight: "700",
            color: "#0F172A",
            letterSpacing: "-0.3px",
          }}
        >
          {isMobile ? "StudyMate AI" : "StudyMate AI Workspace"}
        </h2>

        {!isMobile && aiStatus && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 10px",
              background: aiStatus.live_gemini ? "#ECFDF5" : "#EFF6FF",
              color: aiStatus.live_gemini ? "#059669" : "#2563EB",
              border: `1px solid ${aiStatus.live_gemini ? "#A7F3D0" : "#BFDBFE"}`,
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: aiStatus.live_gemini ? "#10B981" : "#3B82F6",
                boxShadow: `0 0 8px ${aiStatus.live_gemini ? "#10B981" : "#3B82F6"}`,
              }}
            />
            {aiStatus.live_gemini ? "Gemini Pro Live" : "Fast AI Engine Active"}
          </span>
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#F8FAFC",
            padding: "5px 12px",
            borderRadius: "30px",
            border: "1px solid #E2E8F0",
          }}
        >
          <FaUserCircle size={isMobile ? 22 : 26} color="#64748B" />
          <div style={{ textAlign: "left" }}>
            <div
              style={{
                fontSize: isMobile ? "12px" : "13px",
                fontWeight: "600",
                color: "#1E293B",
                lineHeight: "1.2",
                maxWidth: isMobile ? "90px" : "140px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user?.full_name || "Student"}
            </div>
            {!isMobile && (
              <div
                style={{
                  fontSize: "11px",
                  color: "#64748B",
                  textTransform: "capitalize",
                }}
              >
                {localStorage.getItem("studymate_role") || "Student"}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}