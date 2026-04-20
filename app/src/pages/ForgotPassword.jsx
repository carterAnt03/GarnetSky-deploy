import { useState } from "react";
import { Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error?.message || "Something went wrong.");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <main>
        <section className="section">
          <h1 className="page-title">Check your email</h1>
          <div className="card auth-card">
            <p style={{ marginBottom: "1rem" }}>
              If an account with that email exists, we've sent a password reset link. Check your inbox.
            </p>
            <Link className="pill-btn primary" to="/login">Back to Log In</Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="section">
        <h1 className="page-title">Forgot Password</h1>
        <div className="card auth-card">
          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Email address
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </label>

            {error && <p className="field-error-text">{error}</p>}

            <button className="primary" type="submit" disabled={loading}>
              {loading ? "Sending…" : "Send reset link"}
            </button>
          </form>

          <p className="muted" style={{ marginTop: "1rem", textAlign: "center" }}>
            <Link to="/login">Back to Log In</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
