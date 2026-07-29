"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/hq/auth", {
        method: "DELETE",
      });
      
      if (response.ok) {
        router.push("/hq/login");
        router.refresh(); // Refresh to clear auth state
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="logout-button"
      style={{
        background: "transparent",
        border: "1px solid #ffd700",
        color: "#ffd700",
        padding: "8px 16px",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "14px",
        marginLeft: "auto",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(255, 215, 0, 0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
      }}
    >
      Logout
    </button>
  );
}