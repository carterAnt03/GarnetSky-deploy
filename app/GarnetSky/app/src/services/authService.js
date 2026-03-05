// src/services/authService.js
// Auth Service - connects to the backend API instead of localStorage

import { api } from "../api";

// Check if a user is currently logged in by calling the backend
// The backend reads the JWT cookie and returns the user if valid
export async function getCurrentUser() {
  try {
    const data = await api("/api/v1/auth/me");
    return { id: data.user.id, username: data.user.username}
  } catch {
    //No active session - user is not logged in
    return null;
  }
}

// Sign up a new user and return their info
export async function signUp({email,username,password}) {
  const data = await api("/api/v1/auth/signup", {
  method: "POST",
  body: JSON.stringify({ email, username, password }),
  });

  return { id: data.user.id, username: data.user.username}
}

// Log in with email or username + password
export async function logIn({ identifier, password }) {
  const data = await api("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ identifier, password }),
  });

  return { id: data.user.id, username: data.user.username}
}

// Log out - clears the JWT cookie on the backend
export async function logOut() {
  await api("/api/v1/auth/logout",{method: "POST"});
}