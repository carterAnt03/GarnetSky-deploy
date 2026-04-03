import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import { searchRecipes } from "../services/recipeService";
import { useAuth } from "../context/AuthContext";
import { TAGS } from "../data/tags";

export default function Search() {
  const { user } = useAuth();
  const [q, setQ] = useState("");
  const [activeQ, setActiveQ] = useState("");
  const [tag, setTag] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 6;

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setPage(1);

    searchRecipes({ query: activeQ, tag })
      .then((list) => {
        if (!ignore) setResults(list);
      })
      .catch((err) => {
        console.error(err);
        if (!ignore) setResults([]);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => { ignore = true; };
  }, [activeQ, tag]);

  function handleSearch() {
    setActiveQ(q);
    setPage(1);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSearch();
  }

  function handleClear() {
    setQ("");
    setActiveQ("");
    setPage(1);
  }

  const hasResults = results.length > 0;
  const totalPages = hasResults ? Math.ceil(results.length / PAGE_SIZE) : 1;
  const startIndex = (page - 1) * PAGE_SIZE;
  const pageItems = results.slice(startIndex, startIndex + PAGE_SIZE);
  const showingFrom = hasResults ? startIndex + 1 : 0;
  const showingTo = hasResults ? Math.min(results.length, startIndex + PAGE_SIZE) : 0;

  return (
    <main>
      <section className="section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
          <h1 className="page-title" style={{ margin: 0 }}>All Recipes</h1>
          {user && <Link className="pill-btn primary" to="/submit">+ New Recipe</Link>}
        </div>

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
              placeholder="Search by name, description, or tag…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <button type="button" className="pill-btn primary" onClick={handleSearch}>
            Search
          </button>
          <button type="button" className="pill-btn" onClick={handleClear} disabled={!q && !activeQ}>
            Clear
          </button>
        </div>

        <div className="tag-dropdown-wrap">
          <select
            className="tag-select"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          >
            <option value="">All Tags</option>
            {TAGS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {tag && (
            <button type="button" className="pill-btn" onClick={() => setTag("")}>
              Clear Filter
            </button>
          )}
        </div>

        <div className="search-meta">
          {loading ? (
            <span>Loading results…</span>
          ) : hasResults ? (
            <span>Showing {showingFrom}–{showingTo} of {results.length} recipes</span>
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
            <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              Next
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
