import { useState, useEffect } from "react";
import { searchRecipes } from "../services/recipeService";

export default function useFetchRecipes(query = "", tag = "") {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        setLoading(true);
        const list = await searchRecipes({ query, tag });
        if (!ignore) setRecipes(list);
      } catch (err) {
        if (!ignore) setError(err.message || "Failed to load recipes");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [query, tag]);

  return { recipes, loading, error };
}
