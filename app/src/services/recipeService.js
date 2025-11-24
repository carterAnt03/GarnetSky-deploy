// src/services/recipeService.js
import { RECIPES } from "../data/recipes";

export async function searchRecipes({ query = "", tag = "" } = {}) {
  const s = query.trim().toLowerCase();

  let list = RECIPES;

  if (s) {
    list = list.filter((r) =>
      [r.title, r.desc, ...(r.tags || [])]
        .join(" ")
        .toLowerCase()
        .includes(s)
    );
  }

  if (tag) {
    list = list.filter((r) => (r.tags || []).includes(tag));
  }

  // Simulate a little network latency
  await new Promise((resolve) => setTimeout(resolve, 150));

  return list;
}
