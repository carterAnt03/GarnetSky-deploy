import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { logIn } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      await logIn(form); // calls authService.logIn
      navigate("/"); // back to home
    } catch (err) {
      setError(err.message || "Login failed.");
    }
  }

  return (
    <main>
      <section className="section">
        <h1 className="page-title">Log In</h1>
        <div className="card auth-card">
          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Email or Username
              <input
                name="identifier"
                value={form.identifier}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </label>

            {error && <p className="error-text">{error}</p>}

            <button className="primary" type="submit">
              Log In
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
