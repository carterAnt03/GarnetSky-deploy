// src/services/recipeService.js
// Frontend wrapper around the recipes API

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

export async function searchRecipes({ query = "", tag = "" } = {}) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (tag) params.set("tag", tag);

  const url = `${API_BASE}/recipes${params.toString() ? `?${params.toString()}` : ""}`;

  const res = await fetch(url, { method: "GET" });
  const data = await handleJsonResponse(res);
  return data.recipes ?? [];
}

export async function getRecipe(id) {
  const res = await fetch(`${API_BASE}/recipes/${encodeURIComponent(id)}`, {
    method: "GET",
  });

  const data = await handleJsonResponse(res);
  return data.recipe ?? null;
}

export async function createRecipe(payload) {
  const res = await fetch(`${API_BASE}/recipes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await handleJsonResponse(res);
  return data.recipe; // { id, title, desc, time, tags, thumb }
}
