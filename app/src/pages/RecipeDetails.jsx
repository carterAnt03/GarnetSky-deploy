// src/pages/RecipeDetails.jsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getRecipe,
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../services/recipeService";
import { useAuth } from "../context/AuthContext";
import { getCuisineClass } from "../theme/cuisineThemes";

export default function RecipeDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [favBusy, setFavBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadRecipeAndFavoriteState() {
      try {
        setError("");

        // 1. Load the recipe
        const data = await getRecipe(id);
        if (!cancelled) {
          setRecipe(data);
        }

        // 2. Load favorites (if logged in) and see if this one is included
        if (user) {
          try {
            const favorites = await getFavorites();
            if (!cancelled) {
              const found = favorites.some((f) => f.id === id);
              setIsFavorite(found);
            }
          } catch (favErr) {
            console.error("Failed to load favorites", favErr);
            // don't block page load if favorites fail
          }
        } else {
          if (!cancelled) setIsFavorite(false);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError(err.message || "Error loading recipe.");
        }
      }
    }

    loadRecipeAndFavoriteState();

    return () => {
      cancelled = true;
    };
  }, [id, user]);

  async function handleToggleFavorite() {
    if (!user) {
      alert("Please log in to save recipes to your favorites.");
      return;
    }

    try {
      setFavBusy(true);
      setError("");

      if (isFavorite) {
        await removeFavorite(id);
        setIsFavorite(false);
      } else {
        await addFavorite(id);
        setIsFavorite(true);
      }
    } catch (err) {
      console.error("Favorite toggle failed", err);
      setError(err.message || "Could not update favorites.");
    } finally {
      setFavBusy(false);
    }
  }

  if (error && !recipe) {
    return (
      <main>
        <section className="section">
          <p className="error-text">{error}</p>
        </section>
      </main>
    );
  }

  if (!recipe) {
    return (
      <main>
        <section className="section">
          <p>Loading recipe…</p>
        </section>
      </main>
    );
  }
  // Detect cuisine from tags to apply the matching color theme to the page
  const cuisineClass = getCuisineClass(recipe.tags);

    return (
      <main>
        <section className={`section details ${cuisineClass}`}>
        {/* Hero / summary */}
        <div className="details-header">
          {recipe.thumb && (
            <img src={recipe.thumb} alt={recipe.title} />
          )}

          <div>
            <h1 className="page-title">{recipe.title}</h1>

            {/* time + tags / meta */}
              <p className="muted">
                {recipe.time && <>Time: {recipe.time}</>}
              </p>

              {/* Render each tag as a styled pill — cuisine tags get accent color */}
              {recipe.tags && recipe.tags.length > 0 && (
                <div style={{ marginTop: "0.5rem" }}>
                  {recipe.tags.map((tag) => (
                    <span key={tag} className="cuisine-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

            {/* Favorite button */}
            <div style={{ marginTop: "0.9rem", display: "flex", gap: "0.5rem" }}>
              <button
                className="primary"
                type="button"
                onClick={handleToggleFavorite}
                disabled={favBusy}
              >
                {favBusy
                  ? "Saving..."
                  : isFavorite
                  ? "Remove from favorites"
                  : "Add to favorites"}
              </button>
            </div>

            {/* 3.1 – rich description */}
            {recipe.desc && (
              <p style={{ marginTop: "1rem", lineHeight: 1.5 }}>
                {recipe.desc}
              </p>
            )}
          </div>
        </div>

        {/* 3.3 – Ingredients list */}
        <section className="card cream">
          <h2>Ingredients</h2>
          {recipe.ingredients && recipe.ingredients.length > 0 ? (
            <ul className="bullets">
              {recipe.ingredients.map((ing, idx) => (
                <li key={idx}>{ing}</li>
              ))}
            </ul>
          ) : (
            <p className="muted">No ingredients listed for this recipe yet.</p>
          )}
        </section>

        {/* 3.2 – Step-by-step tutorial */}
        <section className="card rose">
          <h2>Step-by-step instructions</h2>
          {recipe.instructions && recipe.instructions.length > 0 ? (
            <ol className="bullets">
              {recipe.instructions.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          ) : (
            <p className="muted">No instructions available yet.</p>
          )}
        </section>
      </section>
    </main>
  );
}
