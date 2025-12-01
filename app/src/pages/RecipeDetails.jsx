// app/src/pages/RecipeDetails.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRecipe } from "../services/recipeService";

export default function RecipeDetails() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getRecipe(id);
        setRecipe(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error loading recipe.");
      }
    })();
  }, [id]);

  if (error) {
    return (
      <main>
        <section className="section">
          <p className="error-text">{error}</p>
        </section>
      </main>
    );
  }

  if (!recipe) {
    return (
      <main>
        <section className="section">
          <p>Loading recipe…</p>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="section details">
        {/* Hero / summary */}
        <div className="details-header">
          {recipe.thumb && (
            <img
              src={recipe.thumb}
              alt={recipe.title}
            />
          )}

          <div>
            <h1 className="page-title">{recipe.title}</h1>

            {/* time + tags / meta */}
            <p className="muted">
              {recipe.time && <>Time: {recipe.time}</>}
              {recipe.tags && recipe.tags.length > 0 && (
                <>
                  {" "}
                  • Tags: {recipe.tags.join(", ")}
                </>
              )}
            </p>

            {/* 3.1 – rich description */}
            {recipe.desc && (
              <p style={{ marginTop: "1rem", lineHeight: 1.5 }}>
                {recipe.desc}
              </p>
            )}
          </div>
        </div>

        {/* 3.3 – Ingredients list */}
        <section className="card cream">
          <h2>Ingredients</h2>
          {recipe.ingredients && recipe.ingredients.length > 0 ? (
            <ul className="bullets">
              {recipe.ingredients.map((ing, idx) => (
                <li key={idx}>{ing}</li>
              ))}
            </ul>
          ) : (
            <p className="muted">No ingredients listed for this recipe yet.</p>
          )}
        </section>

        {/* 3.2 – Step-by-step tutorial */}
        <section className="card rose">
          <h2>Step-by-step instructions</h2>
          {recipe.instructions && recipe.instructions.length > 0 ? (
            <ol className="bullets">
              {recipe.instructions.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          ) : (
            <p className="muted">No instructions available yet.</p>
          )}
        </section>
      </section>
    </main>
  );
}
