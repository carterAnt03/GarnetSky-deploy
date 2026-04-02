import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setFieldErrors((fe) => ({ ...fe, [e.target.name]: "" }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFieldErrors({});

    try {
      await signUp(form);
      navigate("/");
    } catch (err) {
      const code = err.data?.error?.code;
      const details = err.data?.error?.details;

      if (code === "EMAIL_EXISTS") {
        setFieldErrors({ email: "This email is already in use." });
      } else if (code === "USERNAME_EXISTS") {
        setFieldErrors({ username: "This username is already taken." });
      } else if (code === "VALIDATION_ERROR" && Array.isArray(details)) {
        const fe = {};
        for (const d of details) {
          fe[d.field] = d.message;
        }
        setFieldErrors(fe);
      } else {
        setFieldErrors({ email: err.message || "Could not create account." });
      }
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
                className={fieldErrors.email ? "input-error" : ""}
                required
              />
            </label>
            {fieldErrors.email && (
              <p className="field-error-text">{fieldErrors.email}</p>
            )}

            <label>
              Username
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                className={fieldErrors.username ? "input-error" : ""}
                required
              />
            </label>
            {fieldErrors.username && (
              <p className="field-error-text">{fieldErrors.username}</p>
            )}

            <label>
              Password
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className={fieldErrors.password ? "input-error" : ""}
                required
              />
            </label>
            {fieldErrors.password && (
              <p className="field-error-text">{fieldErrors.password}</p>
            )}

            <button className="primary" type="submit">
              Create account
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
