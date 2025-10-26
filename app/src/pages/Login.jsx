import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  const submit = (e) => {
    e.preventDefault();
    alert(`(Demo) Logging in as: ${email}`);
  };

  return (
    <main>
      <section className="auth-card card rose">
        <h1 className="page-title center">Login Now</h1>
        <form onSubmit={submit} className="auth-form">
          <input
            placeholder="Email or Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />
          <button className="primary">LOGIN</button>
        </form>
        <p className="muted center">
          Not a Member? <Link to="/signup">SignUp</Link>
        </p>
      </section>
    </main>
  );
}
