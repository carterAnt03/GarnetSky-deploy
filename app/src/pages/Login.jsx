import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { logIn } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ identifier: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setFieldErrors((fe) => ({ ...fe, [e.target.name]: "" }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFieldErrors({});

    try {
      await logIn(form);
      navigate("/");
    } catch (err) {
      const code = err.data?.error?.code;
      if (code === "USER_NOT_FOUND") {
        setFieldErrors({ identifier: err.message });
      } else if (code === "INVALID_PASSWORD") {
        setFieldErrors({ password: err.message });
      } else {
        setFieldErrors({ identifier: err.message || "Login failed." });
      }
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
                className={fieldErrors.identifier ? "input-error" : ""}
                required
              />
            </label>
            {fieldErrors.identifier && (
              <p className="field-error-text">{fieldErrors.identifier}</p>
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
              Log In
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
