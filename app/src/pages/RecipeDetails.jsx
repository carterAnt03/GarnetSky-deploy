// src/pages/RecipeDetails.jsx

import { useEffect, useState } from "react";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import {
  getRecipe,
  getFavorites,
  addFavorite,
  removeFavorite,
  deleteRecipe,
} from "../services/recipeService";
import { useAuth } from "../context/AuthContext";
import { getCuisineClass } from "../theme/cuisineThemes";
import ConfirmModal from "../components/ConfirmModal";

export default function RecipeDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [favBusy, setFavBusy] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();

  async function confirmDelete() {
    setShowDeleteConfirm(false);
    try {
      await deleteRecipe(id);
      navigate("/");
    } catch (err) {
      setDeleteError(err.message || "Failed to delete recipe.");
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function loadRecipeAndFavoriteState() {
      try {
        setError("");
        setLoading(true);
        setRecipe(null);

        if (!id || id === "undefined" || id === "null") {
          throw new Error("Invalid recipe link.");
        }

        const data = await getRecipe(id);
        if (!cancelled) {
          setRecipe(data);
        }

        if (user) {
          try {
            const favorites = await getFavorites();
            if (!cancelled) {
              const found = favorites.some((f) => f.id === id);
              setIsFavorite(found);
            }
          } catch (favErr) {
            console.error("Failed to load favorites", favErr);
          }
        } else {
          if (!cancelled) setIsFavorite(false);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError(err.message || "Error loading recipe.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
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
      navigate("/login");
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

  if (loading) {
    return (
      <main>
        <section className="section">
          <p>Loading recipe…</p>
        </section>
      </main>
    );
  }

  if (error && !recipe) {
    return (
      <main>
        <section className="section">
          <p className="error-text" style={{ marginBottom: "1rem" }}>{error}</p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button
              className="pill-btn"
              type="button"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
            <Link className="pill-btn" to="/search">Browse recipes</Link>
          </div>
        </section>
      </main>
    );
  }

  if (!recipe) {
    return (
      <main>
        <section className="section">
          <h1 className="page-title">Recipe not found</h1>
          <p className="muted" style={{ marginBottom: "1rem" }}>
            We couldn't find a recipe with that ID.
          </p>
          <Link className="pill-btn" to="/search">Browse recipes</Link>
        </section>
      </main>
    );
  }

  const cuisineClass = getCuisineClass(recipe.tags);

    return (
      <main>
        {showDeleteConfirm && (
          <ConfirmModal
            message="Are you sure you want to delete this recipe?"
            onConfirm={confirmDelete}
            onCancel={() => setShowDeleteConfirm(false)}
          />
        )}
        <section className={`section details ${cuisineClass}`}>
        {/* Hero / summary */}
        <div className="details-header">
          {recipe.thumb && (
            <img src={recipe.thumb} alt={recipe.title} />
          )}

          <div>
            <h1 className="page-title">{recipe.title}</h1>

            {recipe.authorUsername && (
              <p className="muted" style={{ marginTop: "0.25rem" }}>
                By {recipe.authorUsername}
              </p>
            )}

              <p className="muted">
                {recipe.time && <>Time: {recipe.time}</>}
              </p>

              {recipe.tags && recipe.tags.length > 0 && (
                <div style={{ marginTop: "0.5rem" }}>
                  {recipe.tags.map((tag) => (
                    <span key={tag} className="cuisine-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

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
              {user && recipe.authorId === user.id && (
                <>
                  <Link
                    className="primary"
                    to={`/recipe/${id}/edit`}
                    style={{ padding: "0.6rem 1.2rem", borderRadius: "999px", textDecoration: "none", fontWeight: 600 }}
                  >
                    Edit Recipe
                  </Link>
                  <button
                    className="primary"
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    style={{ background: "#c0392b" }}
                  >
                    Delete Recipe
                  </button>
                </>
              )}
            </div>
            {deleteError && <p className="error-text">{deleteError}</p>}

            {recipe.desc && (
              <p style={{ marginTop: "1rem", lineHeight: 1.5 }}>
                {recipe.desc}
              </p>
            )}
          </div>
        </div>

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
