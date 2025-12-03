

const USERS_KEY = "gs_users";
const CURRENT_USER_KEY = "gs_currentUser";

// Small delay to feel like a real network call
function delay(ms = 150) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------- helpers ----------------

function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function saveCurrentUser(user) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

function loadCurrentUser() {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Simple ID generator for demo users
function makeUserId() {
  return "u_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// ---------------- public API ----------------

// Fetch the current user (from localStorage)
export async function getCurrentUser() {
  await delay();
  const u = loadCurrentUser();
  if (!u) return null;

  // ensure we always return the shape AuthContext expects
  return { id: u.id, username: u.username ?? u.email };
}

// Log out: clear current user in localStorage
export async function logOut() {
  await delay();
  localStorage.removeItem(CURRENT_USER_KEY);
}

// 1.1 + 1.3: Sign up, enforcing unique email + username
export async function signUp({ email, username, password }) {
  await delay();

  const trimmedEmail = email.trim().toLowerCase();
  const trimmedUsername = username.trim();

  if (!trimmedEmail || !trimmedUsername || !password) {
    throw new Error("Please fill in all fields.");
  }

  const users = loadUsers();

  const emailTaken = users.some((u) => u.email.toLowerCase() === trimmedEmail);
  if (emailTaken) {
    throw new Error("That email is already registered.");
  }

  const usernameTaken = users.some(
    (u) => u.username.toLowerCase() === trimmedUsername.toLowerCase()
  );
  if (usernameTaken) {
    throw new Error("That username is already taken.");
  }

  // NOTE: For a real app we would hash+salt the password on the server.
  // Here, for the class demo, we store it as-is in localStorage.
  const newUser = {
    id: makeUserId(),
    email: trimmedEmail,
    username: trimmedUsername,
    password, // demo only, not secure
  };

  users.push(newUser);
  saveUsers(users);
  saveCurrentUser({ id: newUser.id, username: newUser.username, email: newUser.email });

  return { id: newUser.id, username: newUser.username };
}

// 1.2: Log in using email OR username + password
export async function logIn({ identifier, password }) {
  await delay();

  const ident = identifier.trim().toLowerCase();
  const users = loadUsers();

  const found = users.find(
    (u) =>
      u.email.toLowerCase() === ident ||
      u.username.toLowerCase() === ident
  );

  if (!found || found.password !== password) {
    throw new Error("Invalid email/username or password.");
  }

  const current = { id: found.id, username: found.username, email: found.email };
  saveCurrentUser(current);

  return { id: found.id, username: found.username };
}
