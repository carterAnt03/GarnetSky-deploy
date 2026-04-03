import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { searchRecipes } from "../services/recipeService";
import { getDailyRecipe } from "../utils/dailyRecipe";

export default function Home() {
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadDaily() {
      try {
        const list = await searchRecipes({});
        if (!cancelled && list.length > 0) {
          setRecipe(getDailyRecipe(list));
        }
      } catch (err) {
        console.error("Failed to load recipe of the day", err);
      }
    }

    loadDaily();
    return () => { cancelled = true; };
  }, []);

  return (
    <main>
      <section className="section">
        <h1 className="page-title">Recipe of the Day</h1>
        <p className="muted">A new recipe every day — check back tomorrow for another.</p>

        {recipe ? (
          <div className="featured card">
            <img src={recipe.thumb} alt={recipe.title} />
            <div>
              <h2>{recipe.title}</h2>
              <div className="muted">
                Time: {recipe.time} &nbsp;•&nbsp; {recipe.tags.join(" | ")}
              </div>
              <p>{recipe.desc}</p>
              <div className="actions">
                <Link className="pill-btn" to={`/recipe/${recipe.id}`}>
                  View Full Recipe
                </Link>
                <Link className="pill-btn" to="/search">
                  Browse All Recipes
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <p className="muted">Loading today's recipe…</p>
        )}
      </section>
    </main>
  );
}
