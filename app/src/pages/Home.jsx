import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RECIPES } from "../data/recipes";
import { searchRecipes } from "../services/recipeService";

export default function Home() {
  const [featured, setFeatured] = useState(RECIPES[0]);

  useEffect(() => {
    let cancelled = false;

    async function loadFeatured() {
      try {
        const list = await searchRecipes({});
        if (!cancelled && list.length > 0) {
          setFeatured(list[0]);
        }
      } catch (err) {
        console.error("Failed to load featured recipe", err);
      }
    }

    loadFeatured();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main>
      <section className="section">
        <h1 className="page-title">Welcome to GarnetSky Recipes</h1>
        <p className="muted">
          A simple recipe app where you can sign up, log in, and browse a small
          collection of example dishes.
        </p>

        <div className="featured card">
          <img src={featured.thumb} alt={featured.title} />
          <div>
            <h2>{featured.title}</h2>
            <div className="muted">
              Time: {featured.time} &nbsp;•&nbsp; {featured.tags.join(" | ")}
            </div>
            <p>{featured.desc}</p>
            <div className="actions">
              <Link className="pill-btn" to="/search">
                Browse all recipes
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
