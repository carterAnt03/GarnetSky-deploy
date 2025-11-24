import { useEffect, useState } from "react";
import RecipeCard from "../components/RecipeCard";
import { RECIPES } from "../data/recipes";
import { searchRecipes } from "../services/recipeService";

const TAGS = Array.from(new Set(RECIPES.flatMap((r) => r.tags || [])));

export default function Search() {
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("");
  const [results, setResults] = useState(RECIPES);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 6;

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setPage(1);

    searchRecipes({ query: q, tag })
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
        <h1 className="page-title">Search Recipes</h1>
        <p className="muted">
          Search across our demo recipe collection by keyword and tag, then page
          through the results.
        </p>

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
              {TAGS.map((t) => (
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
