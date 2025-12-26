"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "@/styles/admin/components.css";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("from") || "/admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        // Redirect back to where they were trying to go
        router.push(redirectTo);
        router.refresh();
      } else {
        setError("Incorrect password. Please try again.");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1 className="login-title">Admin Control Room</h1>
          <p className="login-subtitle">Enter password to access dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Admin Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="Enter admin password"
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="login-error">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-button gold"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="button-spinner"></span>
                Authenticating...
              </>
            ) : (
              "Access Dashboard"
            )}
          </button>

          <div className="login-hint">
            <p className="hint-text">
              <strong>Note:</strong> Contact site administrator for password
            </p>
          </div>
        </form>

        <div className="login-footer">
          <p className="footer-text">
            Daily Instruct © 2024 • Admin Control Room
          </p>
        </div>
      </div>
    </div>
  );
}