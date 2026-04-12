// src/services/recipeService.js

import { api } from "../api";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(`${API_BASE}/api/v1/upload`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error?.message || "Image upload failed");
  }
  const data = await res.json();
  return data.url;
}

// ----------------- Recipes API -----------------

export async function searchRecipes({ query = "", tag = "" } = {}) {
  const params = new URLSearchParams();
  if (query && query.trim()) params.set("q", query.trim());
  if (tag && tag.trim()) params.set("tag", tag.trim());

  const qs = params.toString();
  const data = await api(`/api/v1/recipes${qs ? `?${qs}` : ""}`);
  return Array.isArray(data?.recipes) ? data.recipes : [];
}

export async function getRecipe(id) {
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
    const data = await api('/api/v1/favorites');
    return data.recipes;
  }

// Add a recipe to the current user's favorites
export async function addFavorite(recipeId) {
    await api(`/api/v1/favorites/${recipeId}`, { method: 'POST' });
  }

// Remove a recipe from the current user's favorites
export async function removeFavorite(recipeId) {
    await api(`/api/v1/favorites/${recipeId}`, { method: 'DELETE' });
  }

export async function deleteRecipe(recipeId) {
  await api(`/api/v1/recipes/${recipeId}`, { method: 'DELETE' });
}

export async function updateRecipe(id, payload) {
  await api(`/api/v1/recipes/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify({
      title: payload.title,
      desc: payload.desc,
      time: payload.time,
      tags: payload.tags,
      imageUrl: payload.imageUrl,
      ingredientsText: payload.ingredientsText,
      instructionsText: payload.instructionsText,
    }),
  });
}

  