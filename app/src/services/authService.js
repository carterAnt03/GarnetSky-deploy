// src/services/authService.js
// Frontend wrapper around the Express auth API

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1";

async function handleJsonResponse(res) {
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message = data?.error?.message || `Request failed with ${res.status}`;
    throw new Error(message);
  }

  return data;
}

// Fetch the current user using the cookie-based session
export async function getCurrentUser() {
  try {
    const res = await fetch(`${API_BASE}/users/me`, {
      method: "GET",
      credentials: "include",
    });

    if (res.status === 401) return null;

    const data = await handleJsonResponse(res);
    const u = data.user;
    if (!u) return null;

    return { id: u.id, username: u.username ?? u.display_name ?? u.email };
  } catch (err) {
    console.error("getCurrentUser failed", err);
    return null;
  }
}

export async function logOut() {
  try {
    await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (err) {
    console.error("logOut failed", err);
  }
}

// 1.1 + 1.3: Sign up via backend API, passwords hashed on the server
export async function signUp({ email, username, password }) {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, username, password }),
  });

  const data = await handleJsonResponse(res);
  const u = data.user;
  return { id: u.id, username: u.username ?? username };
}

// 1.2: Log in using email OR username + password via backend API
export async function logIn({ identifier, password }) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ identifier, password }),
  });

  const data = await handleJsonResponse(res);
  const u = data.user;
  return { id: u.id, username: u.username ?? u.display_name ?? u.email };
}
