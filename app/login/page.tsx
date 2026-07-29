"use client";


export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import "@/styles/admin/components.css";
import "@/styles/admin/admin.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("from") || "/hq";
  const supabase = createClient();

  useEffect(() => {
    // FORCE HIDE public layout elements
    const mainNavbar = document.querySelector('.navbar') as HTMLElement | null;
    const mainFooter = document.querySelector('.footer') as HTMLElement | null;
    const mainElement = document.querySelector('main') as HTMLElement | null;
    
    if (mainNavbar) mainNavbar.style.display = 'none';
    if (mainFooter) mainFooter.style.display = 'none';
    
    document.body.classList.add('admin-page');
    document.body.style.background = '#0a0a0a';
    document.body.style.color = '#ffffff';
    
    return () => {
      if (mainNavbar) mainNavbar.style.display = '';
      if (mainFooter) mainFooter.style.display = '';
      document.body.classList.remove('admin-page');
      document.body.style.background = '';
      document.body.style.color = '';
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
      } else {
        // Redirect back to where they were trying to go
        router.push(redirectTo);
        router.refresh();
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
            <label className="form-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="Enter admin email"
              required
              disabled={loading}
              style={{ marginBottom: '16px' }}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
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