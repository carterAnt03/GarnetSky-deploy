import { useState } from "react";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  const submit = (e) => {
    e.preventDefault();
    alert(`(Demo) Creating account for: ${email}`);
  };

  return (
    <main>
      <section className="auth-card card rose">
        <h1 className="page-title center">Sign Up</h1>
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
          <button className="primary">SIGN UP</button>
        </form>
      </section>
    </main>
  );
}
