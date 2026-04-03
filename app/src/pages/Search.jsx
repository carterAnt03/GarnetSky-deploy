import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import { searchRecipes } from "../services/recipeService";
import { useAuth } from "../context/AuthContext";

export default function Search() {
  const { user } = useAuth();
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("");
  const [results, setResults] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 6;

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setPage(1);

    searchRecipes({ query: q, tag })
      .then((list) => {
        if (!ignore) {
          setResults(list);
          if (!q && !tag) {
            setAllTags(Array.from(new Set(list.flatMap((r) => r.tags || []))).sort());
          }
        }
      })
      .catch((err) => {
        console.error(err);
        if (!ignore) setResults([]);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [q, tag]);

  const hasResults = results.length > 0;
  const totalPages = hasResults ? Math.ceil(results.length / PAGE_SIZE) : 1;
  const startIndex = (page - 1) * PAGE_SIZE;
  const pageItems = results.slice(startIndex, startIndex + PAGE_SIZE);
  const showingFrom = hasResults ? startIndex + 1 : 0;
  const showingTo = hasResults
    ? Math.min(results.length, startIndex + PAGE_SIZE)
    : 0;

  return (
    <main>
      <section className="section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
          <h1 className="page-title" style={{ margin: 0 }}>All Recipes</h1>
          {user && <Link className="pill-btn primary" to="/submit">+ New Recipe</Link>}
        </div>

        <div className="search-bar">
          <input
            type="search"
            placeholder="Search by name, description, or tag…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button
            type="button"
            className="pill-btn"
            onClick={() => setQ("")}
            disabled={!q}
          >
            Clear
          </button>
        </div>

        <div className="search-filters">
          <label>
            Filter by tag:&nbsp;
            <select value={tag} onChange={(e) => setTag(e.target.value)}>
              <option value="">All tags</option>
              {allTags.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="search-meta">
          {loading ? (
            <span>Loading results…</span>
          ) : hasResults ? (
            <span>
              Showing {showingFrom}–{showingTo} of {results.length} recipes
            </span>
          ) : (
            <span>No recipes matched your search yet.</span>
          )}
        </div>

        {hasResults && (
          <div className="grid">
            {pageItems.map((r) => (
              <RecipeCard key={r.id} r={r} />
            ))}
          </div>
        )}

        {hasResults && totalPages > 1 && (
          <div className="pagination">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() =>
                setPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
