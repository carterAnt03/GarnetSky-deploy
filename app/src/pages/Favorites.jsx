import { useEffect, useState } from "react";
import RecipeCard from "../components/RecipeCard";
import { getFavorites } from "../services/recipeService";
import { useAuth } from "../context/AuthContext";

export default function Favorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadFavorites() {
      try {
        setLoading(true);
        setError("");
        const list = await getFavorites();
        if (!cancelled) setFavorites(list);
      } catch (err) {
        console.error("Failed to load favorites", err);
        if (!cancelled) setError(err.message || "Could not load favorites.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (user) {
      loadFavorites();
    } else {
      setLoading(false);
      setFavorites([]);
    }

    return () => { cancelled = true; };
  }, [user]);

  const filtered = favorites.filter((r) =>
    r.title.toLowerCase().includes(q.toLowerCase()) ||
    (r.tags && r.tags.some((t) => t.toLowerCase().includes(q.toLowerCase())))
  );

  return (
    <main>
      <section className="section">
        <h1 className="page-title">Your Favorites</h1>

        {!user && (
          <p className="muted">Log in to save recipes to your personal favorites list.</p>
        )}

        {loading && <p>Loading your favorites…</p>}
        {error && <p className="error-text">{error}</p>}

        {!loading && !error && user && favorites.length === 0 && (
          <p className="muted">
            You don&apos;t have any favorite recipes yet. Browse recipes and tap &quot;Add to favorites&quot; to save them here.
          </p>
        )}

        {favorites.length > 0 && (
          <>
            <div className="search-bar">
              <div className="search-input-wrap">
                <span className="search-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </span>
                <input
                  type="search"
                  placeholder="Search your favorites…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
              <button type="button" className="pill-btn" onClick={() => setQ("")} disabled={!q}>
                Clear
              </button>
            </div>

            {filtered.length > 0 ? (
              <div className="grid">
                {filtered.map((r) => (
                  <RecipeCard key={r.id} r={r} />
                ))}
              </div>
            ) : (
              <p className="muted">No favorites match your search.</p>
            )}
          </>
        )}
      </section>
    </main>
  );
}
