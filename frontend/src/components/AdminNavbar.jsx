import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";

export default function AdminNavbar() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function logout() {
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("studymate_token");
    localStorage.removeItem("studymate_role");
    navigate("/login");
  }

  function toggleSidebar() {
    window.dispatchEvent(new CustomEvent("toggle-admin-sidebar"));
  }

  return (
    <div
      style={{
        height: "68px",
        background: "#ffffff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: isMobile ? "0 16px" : "0 30px",
        borderBottom: "1px solid #E5E7EB",
        boxShadow: "0 2px 8px rgba(0,0,0,.05)",
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}
    >
      {/* Left */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {isMobile && (
          <button
            onClick={toggleSidebar}
            style={{
              background: "#F3F4F6",
              border: "1px solid #D1D5DB",
              padding: "8px 10px",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FaBars size={16} color="#1F2937" />
          </button>
        )}

        <h2
          style={{
            color: "#2563EB",
            margin: 0,
            fontSize: isMobile ? "16px" : "20px",
            fontWeight: "700",
          }}
        >
          🛡 {isMobile ? "Admin" : "StudyMate Admin"}
        </h2>
      </div>

      {/* Right */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: isMobile ? "10px" : "18px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: isMobile ? "32px" : "36px",
              height: isMobile ? "32px" : "36px",
              borderRadius: "50%",
              background: "#2563EB",
              color: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            A
          </div>

          {!isMobile && (
            <span
              style={{
                fontWeight: "600",
                fontSize: "14px",
                color: "#1F2937",
              }}
            >
              Administrator
            </span>
          )}
        </div>

        <button
          onClick={logout}
          style={{
            background: "#EF4444",
            color: "white",
            border: "none",
            padding: isMobile ? "7px 12px" : "9px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: isMobile ? "12px" : "14px",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}