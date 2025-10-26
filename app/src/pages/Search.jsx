import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { RECIPES } from "../data/recipes";

export default function Search() {
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return RECIPES;
    return RECIPES.filter(r =>
      [r.title, r.desc, ...(r.tags || [])].join(" ").toLowerCase().includes(s)
    );
  }, [q]);

  return (
    <main>
      <section className="section">
        <h1 className="page-title">Search</h1>

        <div className="search-bar">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search recipes"
          />
          <button className="pill-btn" onClick={() => { /* no-op; live filter */ }}>
            Search
          </button>
        </div>

        <h2 className="h2">Recent Recipes</h2>
        <div className="grid">
          {results.map(r => (
            <Link key={r.id} to={`/recipe/${r.id}`} className="recipe-card card">
              <img src={r.thumb} alt={r.title} />
              <div className="card-body">
                <h3>{r.title}</h3>
                <p className="muted">{r.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
