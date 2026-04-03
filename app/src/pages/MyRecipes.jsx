import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";
import RecipeCard from "../components/RecipeCard";

export default function MyRecipes() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    async function load() {
      try {
        const data = await api("/api/v1/recipes/mine");
        setRecipes(data.recipes ?? []);
      } catch (err) {
        setError("Failed to load your recipes.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const filtered = recipes.filter((r) =>
    r.title.toLowerCase().includes(q.toLowerCase()) ||
    (r.tags && r.tags.some((t) => t.toLowerCase().includes(q.toLowerCase())))
  );

  return (
    <main>
      <section className="section">
        <h1 className="page-title">My Recipes</h1>

        {loading && <p>Loading…</p>}
        {error && <p className="error-text">{error}</p>}

        {!loading && recipes.length === 0 && (
          <p className="muted">You haven't submitted any recipes yet.</p>
        )}

        {recipes.length > 0 && (
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
                  placeholder="Search your recipes…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
              <button type="button" className="pill-btn" onClick={() => setQ("")} disabled={!q}>
                Clear
              </button>
            </div>

            {filtered.length > 0 ? (
              <div className="recipe-grid">
                {filtered.map((r) => (
                  <RecipeCard key={r.id} r={r} />
                ))}
              </div>
            ) : (
              <p className="muted">No recipes match your search.</p>
            )}
          </>
        )}
      </section>
    </main>
  );
}
