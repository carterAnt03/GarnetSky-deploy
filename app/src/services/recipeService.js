// src/services/recipeService.js
// Frontend-only "API" for recipes + favorites using localStorage.

import { RECIPES } from "../data/recipes";

// Keys for localStorage
const EXTRA_RECIPES_KEY = "gs_extra_recipes";
const CURRENT_USER_KEY = "gs_currentUser";

// ----------------- helpers -----------------

function loadExtraRecipes() {
  try {
    const raw = localStorage.getItem(EXTRA_RECIPES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveExtraRecipes(list) {
  localStorage.setItem(EXTRA_RECIPES_KEY, JSON.stringify(list));
}

function getAllRecipesInternal() {
  const extras = loadExtraRecipes();
  return [...RECIPES, ...extras];
}

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

// Pretend it's async like a real API
function delay(ms = 150) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ----------------- Recipes API -----------------

// Search recipes by query + tag
export async function searchRecipes({ query = "", tag = "" } = {}) {
  await delay();
  const q = query.trim().toLowerCase();
  const t = tag.trim().toLowerCase();

  return getAllRecipesInternal().filter((r) => {
    const matchesQuery =
      !q ||
      r.title.toLowerCase().includes(q) ||
      (r.desc && r.desc.toLowerCase().includes(q)) ||
      (r.tags && r.tags.some((tag) => tag.toLowerCase().includes(q)));

    const matchesTag =
      !t || (r.tags && r.tags.some((tag) => tag.toLowerCase() === t));

    return matchesQuery && matchesTag;
  });
}

// Get a single recipe by ID
export async function getRecipe(id) {
  await delay();
  const all = getAllRecipesInternal();
  const found = all.find((r) => r.id === id);
  if (!found) throw new Error("Recipe not found.");
  return found;
}

// Create a new recipe (saved in localStorage)
export async function createRecipe(payload) {
  await delay();

  const extras = loadExtraRecipes();

  const id =
    payload.id ||
    payload.slug ||
    payload.title?.toLowerCase().replace(/\s+/g, "-") +
      "-" +
      Date.now().toString(36);

  const newRecipe = {
    id,
    title: payload.title ?? "Untitled recipe",
    time: payload.time ?? "",
    tags: payload.tags ?? [],
    desc: payload.desc ?? "",
    thumb: payload.thumb ?? null,
    ingredients: payload.ingredients ?? [],
    instructions: payload.instructions ?? [],
  };

  extras.push(newRecipe);
  saveExtraRecipes(extras);

  return newRecipe;
}

// ----------------- Favorites API (per user via localStorage) -----------------

// Get the current user's favorite recipes
export async function getFavorites() {
  await delay();

  const user = getCurrentUserSync();
  if (!user) return [];

  const all = getAllRecipesInternal();
  const favoriteIds = loadFavoriteIdsForUser(user.id);

  return all.filter((r) => favoriteIds.includes(r.id));
}

// Add a recipe to the current user's favorites
export async function addFavorite(recipeId) {
  await delay();

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
  await delay();

  const user = getCurrentUserSync();
  if (!user) throw new Error("You must be logged in to update favorites.");

  let ids = loadFavoriteIdsForUser(user.id);
  ids = ids.filter((id) => id !== recipeId);
  saveFavoriteIdsForUser(user.id, ids);
  return true;
}
