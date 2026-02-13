import { useState } from "react";
import { api } from "./api";

export default function App() {
  const [out, setOut] = useState("");
  const [lastSignup, setLastSignup] = useState(null);

  function show(data) {
    setOut(typeof data === "string" ? data : JSON.stringify(data, null, 2));
  }

  async function testHealth() {
    try {
      const data = await api("/api/v1/health", { method: "GET" });
      show(data);
    } catch (e) {
      show(`ERROR: ${e.message}`);
    }
  }

  async function signup() {
    const ts = Date.now();
    const email = `test${ts}@example.com`;
    const username = `user${ts}`;
    const password = "Password123!";

    try {
      const data = await api("/api/v1/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          username,
          display_name: "Test User", // <-- server expects display_name (snake_case)
        }),
      });

      setLastSignup({ email, username, password });
      show({ created: data, savedCredsForLogin: { email, password } });
    } catch (e) {
      show(`ERROR: ${e.message}`);
    }
  }

  async function login() {
    // If you just hit signup, we use that user automatically
    const identifier = lastSignup?.email || "test3@example.com";
    const password = lastSignup?.password || "Password123!";

    try {
      const data = await api("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({ identifier, password }),
      });
      show({ loggedInAs: identifier, response: data });
    } catch (e) {
      show(`ERROR: ${e.message}`);
    }
  }

  async function me() {
    try {
      const data = await api("/api/v1/auth/me", { method: "GET" });
      show(data);
    } catch (e) {
      show(`ERROR: ${e.message}`);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>GarnetSky Frontend Test</h1>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={testHealth}>GET /health</button>
        <button onClick={signup}>POST /signup</button>
        <button onClick={login}>POST /login</button>
        <button onClick={me}>GET /me</button>
      </div>

      {lastSignup && (
        <p style={{ marginTop: 12 }}>
          Last signup email: <code>{lastSignup.email}</code>
        </p>
      )}

      <pre style={{ marginTop: 16, background: "#111", color: "#0f0", padding: 12 }}>
        {out}
      </pre>
    </div>
  );
}
