// src/pages/Favorites.jsx

import { useEffect, useState } from "react";
import RecipeCard from "../components/RecipeCard";
import { getFavorites } from "../services/recipeService";
import { useAuth } from "../context/AuthContext";

export default function Favorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadFavorites() {
      try {
        setLoading(true);
        setError("");

        const list = await getFavorites(user.id);
        if (!cancelled) {
          setFavorites(list);
        }
      } catch (err) {
        console.error("Failed to load favorites", err);
        if (!cancelled) {
          setError(err.message || "Could not load favorites.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (user) {
      loadFavorites();
    } else {
      // not logged in, so nothing to load
      setLoading(false);
      setFavorites([]);
    }

    return () => {
      cancelled = true;
    };
  }, [user]);

  const hasFavorites = favorites && favorites.length > 0;

  return (
    <main>
      <section className="section">
        <h1 className="page-title">Your Favorites</h1>

        {!user && (
          <p className="muted">
            Log in to save recipes to your personal favorites list.
          </p>
        )}

        {loading && <p>Loading your favorites…</p>}

        {error && <p className="error-text">{error}</p>}

        {!loading && !error && user && !hasFavorites && (
          <p className="muted">
            You don&apos;t have any favorite recipes yet. Browse recipes and
            tap the &quot;Favorite&quot; button to save them here.
          </p>
        )}

        {hasFavorites && (
          <div className="grid">
            {favorites.map((r) => (
              <RecipeCard key={r.id} r={r} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
