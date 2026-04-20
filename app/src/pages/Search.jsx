import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import { searchRecipes } from "../services/recipeService";
import { useAuth } from "../context/AuthContext";
import { TAGS } from "../data/tags";
import TagDropdown from "../components/TagDropdown";

export default function Search() {
  const { user } = useAuth();
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Auto-search: fires 400ms after the user stops typing, or immediately on tag change
  useEffect(() => {
    let ignore = false;
    const timer = setTimeout(() => {
      setLoading(true);
      setPage(1);
      searchRecipes({ query: q, tag })
        .then((list) => { if (!ignore) setResults(list); })
        .catch((err) => { console.error(err); if (!ignore) setResults([]); })
        .finally(() => { if (!ignore) setLoading(false); });
    }, q ? 400 : 0);

    return () => { ignore = true; clearTimeout(timer); };
  }, [q, tag]);

  function handleClear() {
    setQ("");
    setPage(1);
  }

  const hasResults = results.length > 0;
  const totalPages = hasResults ? Math.ceil(results.length / pageSize) : 1;
  const startIndex = (page - 1) * pageSize;
  const pageItems = results.slice(startIndex, startIndex + pageSize);
  const showingFrom = hasResults ? startIndex + 1 : 0;
  const showingTo = hasResults ? Math.min(results.length, startIndex + pageSize) : 0;

  return (
    <main>
      <section className="section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
            />
          </div>
          <button type="button" className="pill-btn" onClick={handleClear} disabled={!q}>
            Clear
          </button>
        </div>

        <TagDropdown value={tag} onChange={setTag} tags={TAGS} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="search-meta" style={{ margin: 0 }}>
            {loading ? (
              <span>Loading results…</span>
            ) : hasResults ? (
              <span>Showing {showingFrom}–{showingTo} of {results.length} recipes</span>
            ) : (
              <span>No recipes matched your search yet.</span>
            )}
          </div>
          <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
            <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>Show:</span>
            {[10, 20].map((n) => (
              <button
                key={n}
                type="button"
                className={`pill-btn ${pageSize === n ? "primary" : ""}`}
                style={{ padding: "0.3rem 0.75rem", fontSize: "0.85rem" }}
                onClick={() => { setPageSize(n); setPage(1); }}
              >
                {n}
              </button>
            ))}
          </div>
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
