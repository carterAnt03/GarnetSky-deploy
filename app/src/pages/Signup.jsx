import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    username: "",
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
      await signUp(form); // calls authService.signUp
      navigate("/"); // go to home after sign up
    } catch (err) {
      setError(err.message || "Could not create account.");
    }
  }

  return (
    <main>
      <section className="section">
        <h1 className="page-title">Sign Up</h1>
        <div className="card auth-card">
          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Username
              <input
                name="username"
                value={form.username}
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
              Create account
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
