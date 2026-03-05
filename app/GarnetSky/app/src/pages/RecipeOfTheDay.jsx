import { useEffect, useState } from "react";                                                                                                     
  import { Link } from "react-router-dom";                                                                                                         
  import { RECIPES } from "../data/recipes";                                                                                                       
  import { searchRecipes } from "../services/recipeService";                                                                                       
  import { getDailyRecipe } from "../utils/dailyRecipe";                                                                                           

  export default function RecipeOfTheDay() {
    // Default to today's local recipe while the API loads
    const [recipe, setRecipe] = useState(getDailyRecipe(RECIPES));

    useEffect(() => {
      let cancelled = false;

      async function loadDaily() {
        try {
          // Fetch from backend and apply the same daily rotation logic
          const list = await searchRecipes({});
          if (!cancelled && list.length > 0) {
            setRecipe(getDailyRecipe(list));
          }
        } catch (err) {
          // Falls back to the local recipe already set as default
          console.error("Failed to load recipe of the day", err);
        }
      }

      loadDaily();

      return () => {
        cancelled = true;
      };
    }, []);

    return (
      <main>
        <section className="section">
          <h1 className="page-title">Recipe of the Day</h1>
          <p className="muted">A new recipe every day — check back tomorrow for another.</p>

          <div className="featured card">
            <img src={recipe.thumb} alt={recipe.title} />
            <div>
              <h2>{recipe.title}</h2>
              <div className="muted">
                Time: {recipe.time} &nbsp;•&nbsp; {recipe.tags.join(" | ")}
              </div>
              <p>{recipe.desc}</p>
              <div className="actions">
                {/* Link to the full recipe detail page */}
                <Link className="pill-btn" to={`/recipe/${recipe.id}`}>
                  View Full Recipe
                </Link>
                <Link className="pill-btn" to="/search">
                  Browse All Recipes
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }