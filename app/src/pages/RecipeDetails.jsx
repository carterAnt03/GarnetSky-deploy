import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { RECIPES } from "../data/recipes";
import { getRecipe } from "../services/recipeService";

export default function RecipeDetails() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const r = await getRecipe(id);
        if (!cancelled) {
          setRecipe(r ?? RECIPES.find((x) => x.id === id) ?? RECIPES[0]);
        }
      } catch (err) {
        console.error("Failed to load recipe", err);
        if (!cancelled) {
          setRecipe(RECIPES.find((x) => x.id === id) ?? RECIPES[0]);
          setError("Unable to load recipe from server; showing demo data.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <main>
        <section className="section">
          <p>Loading recipe…</p>
        </section>
      </main>
    );
  }

  const r = recipe;

  return (
    <main>
      <section className="section">
        <h1 className="page-title">{r.title}</h1>

        <div className="details card">
          <div className="details-header">
            <div>
              <div className="muted">
                ⏱ {r.time} • {r.tags.join(" • ")}
              </div>
              <p>{r.desc}</p>
            </div>
            <img src={r.thumb} alt={r.title} />
          </div>

          <div className="instructions">
            <h3>INSTRUCTIONS</h3>
            <ol>
              {r.instructions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </main>
  );
}
