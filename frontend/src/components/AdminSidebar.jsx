import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false);
    };

    const handleToggle = () => setMobileOpen((prev) => !prev);
    const handleClose = () => setMobileOpen(false);

    window.addEventListener("resize", handleResize);
    window.addEventListener("toggle-admin-sidebar", handleToggle);
    window.addEventListener("close-admin-sidebar", handleClose);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("toggle-admin-sidebar", handleToggle);
      window.removeEventListener("close-admin-sidebar", handleClose);
    };
  }, []);

  function handleLogout() {
    localStorage.removeItem("studymate_token");
    localStorage.removeItem("studymate_role");
    localStorage.removeItem("studymate_user");
    localStorage.removeItem("adminLoggedIn");
    navigate("/login");
  }

  const menus = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: "📊",
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: "👥",
    },
  ];

  return (
    <>
      {isMobile && mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 998,
          }}
        />
      )}

      <div
        style={{
          width: "270px",
          background: "#111827",
          color: "white",
          minHeight: "100vh",
          padding: "30px 20px",
          display: "flex",
          flexDirection: "column",
          position: isMobile ? "fixed" : "sticky",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: isMobile ? 999 : 50,
          transform: isMobile ? (mobileOpen ? "translateX(0)" : "translateX(-100%)") : "none",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "36px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "22px",
              fontWeight: "bold",
              color: "#60A5FA",
            }}
          >
            🛡 Admin Portal
          </h2>

          {isMobile && (
            <button
              onClick={() => setMobileOpen(false)}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "none",
                color: "white",
                padding: "8px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              <FaTimes size={16} />
            </button>
          )}
        </div>

        <div style={{ flex: 1 }}>
          {menus.map((menu) => (
            <Link
              key={menu.path}
              to={menu.path}
              onClick={() => isMobile && setMobileOpen(false)}
              style={{
                display: "block",
                padding: "14px 16px",
                marginBottom: "12px",
                borderRadius: "12px",
                color: "white",
                textDecoration: "none",
                background:
                  location.pathname === menu.path
                    ? "#2563EB"
                    : "transparent",
                transition: "0.2s",
                fontWeight: "500",
              }}
            >
              <span style={{ marginRight: "10px" }}>
                {menu.icon}
              </span>
              {menu.name}
            </Link>
          ))}
        </div>

        <button
          onClick={handleLogout}
          style={{
            background: "#DC2626",
            color: "white",
            border: "none",
            padding: "14px",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "15px",
            marginTop: "auto",
          }}
        >
          🚪 Logout
        </button>
      </div>
    </>
  );
}