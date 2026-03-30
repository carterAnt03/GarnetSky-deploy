// src/services/recipeService.js
// Recipes are fetched from the backend API, with a fallback to local demo data.
// Favorites are stored client-side (localStorage) for the beta milestone.

import { RECIPES } from "../data/recipes";
import { api } from "../api";

// Keys for localStorage
const CURRENT_USER_KEY = "gs_currentUser";

// ----------------- helpers -----------------

function getCurrentUserSync() {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function favoriteKeyForUser(userId) {
  return `gs_favorites_${userId}`;
}

function loadFavoriteIdsForUser(userId) {
  try {
    const raw = localStorage.getItem(favoriteKeyForUser(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveFavoriteIdsForUser(userId, ids) {
  localStorage.setItem(favoriteKeyForUser(userId), JSON.stringify(ids));
}

function filterLocalRecipes({ query = "", tag = "" } = {}) {
  const q = query.trim().toLowerCase();
  const t = tag.trim().toLowerCase();

  return RECIPES.filter((r) => {
    const matchesQuery =
      !q ||
      r.title.toLowerCase().includes(q) ||
      (r.desc && r.desc.toLowerCase().includes(q)) ||
      (r.tags && r.tags.some((tg) => tg.toLowerCase().includes(q)));

    const matchesTag =
      !t || (r.tags && r.tags.some((tg) => tg.toLowerCase() === t));

    return matchesQuery && matchesTag;
  });
}

async function listRemoteRecipes({ query = "", tag = "" } = {}) {
  const params = new URLSearchParams();
  if (query && query.trim()) params.set("q", query.trim());
  if (tag && tag.trim()) params.set("tag", tag.trim());

  const qs = params.toString();
  const data = await api(`/api/v1/recipes${qs ? `?${qs}` : ""}`);
  return Array.isArray(data?.recipes) ? data.recipes : [];
}

// ----------------- Recipes API -----------------

// Search recipes by query + tag
// - Remote recipes are authoritative for submitted content
// - Local RECIPES are used as a demo fallback
export async function searchRecipes({ query = "", tag = "" } = {}) {
  try {
    const [remote, local] = await Promise.all([
      listRemoteRecipes({ query, tag }),
      Promise.resolve(filterLocalRecipes({ query, tag })),
    ]);

    // Merge, preferring remote when IDs collide
    const merged = new Map();
    for (const r of local) merged.set(r.id, r);
    for (const r of remote) merged.set(r.id, r);
    return Array.from(merged.values());
  } catch (err) {
    console.warn("searchRecipes: remote failed, falling back to local", err);
    return filterLocalRecipes({ query, tag });
  }
}

// Get a single recipe by ID (slug)
// First try local demo data; if not found, fetch from backend.
export async function getRecipe(id) {
  const local = RECIPES.find((r) => r.id === id);
  if (local) return local;

  const data = await api(`/api/v1/recipes/${encodeURIComponent(id)}`);
  if (!data?.recipe) throw new Error("Recipe not found.");
  return data.recipe;
}

// Create a new recipe via the backend API
// Sends the form data as a POST request and returns the saved recipe.
export async function createRecipe(payload) {
  const data = await api("/api/v1/recipes", {
    method: "POST",
    body: JSON.stringify({
      authorId: payload.authorId,
      title: payload.title,
      desc: payload.desc,
      time: payload.time,
      tags: payload.tags, // comma-separated string
      imageUrl: payload.imageUrl,
      ingredientsText: payload.ingredientsText,
      instructionsText: payload.instructionsText,
    }),
  });

  // Backend returns: { recipe: { id: <slug>, title, desc, time, tags, thumb } }
  return data.recipe;
}

// ----------------- Favorites API (per user via localStorage) -----------------

// Get the current user's favorite recipes
export async function getFavorites() {
  const user = getCurrentUserSync();
  if (!user) return [];

  // Use searchRecipes so favorites can include remote submitted recipes.
  const all = await searchRecipes({});
  const favoriteIds = loadFavoriteIdsForUser(user.id);
  return all.filter((r) => favoriteIds.includes(r.id));
}

// Add a recipe to the current user's favorites
export async function addFavorite(recipeId) {
  const user = getCurrentUserSync();
  if (!user) throw new Error("You must be logged in to favorite recipes.");

  const ids = loadFavoriteIdsForUser(user.id);
  if (!ids.includes(recipeId)) {
    ids.push(recipeId);
    saveFavoriteIdsForUser(user.id, ids);
  }
  return true;
}

// Remove a recipe from the current user's favorites
export async function removeFavorite(recipeId) {
  const user = getCurrentUserSync();
  if (!user) throw new Error("You must be logged in to update favorites.");

  let ids = loadFavoriteIdsForUser(user.id);
  ids = ids.filter((id) => id !== recipeId);
  saveFavoriteIdsForUser(user.id, ids);
  return true;
}
