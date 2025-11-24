// src/services/authService.js
import bcrypt from "bcryptjs";

const USERS_KEY = "gs_users";
const CURRENT_USER_KEY = "gs_current_user";

function getUsers() {
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentUser() {
  const raw = localStorage.getItem(CURRENT_USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function logOut() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

// 1.1 + 1.3: Sign up, store hashed password, enforce unique email/username
export async function signUp({ email, username, password }) {
  const users = getUsers();

  if (users.some((u) => u.email === email)) {
    throw new Error("Email is already in use.");
  }
  if (users.some((u) => u.username === username)) {
    throw new Error("Username is already in use.");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const newUser = {
    id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
    email,
    username,
    passwordHash: hash,
  };

  users.push(newUser);
  saveUsers(users);

  const safeUser = { id: newUser.id, username: newUser.username };
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
  return safeUser;
}

// 1.2: Log in using email OR username + password
export async function logIn({ identifier, password }) {
  const users = getUsers();

  const user = users.find(
    (u) => u.email === identifier || u.username === identifier
  );
  if (!user) {
    throw new Error("No account found with that email/username.");
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    throw new Error("Incorrect password.");
  }

  const safeUser = { id: user.id, username: user.username };
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
  return safeUser;
}
