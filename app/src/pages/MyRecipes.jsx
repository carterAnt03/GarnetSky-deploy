import { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import { useAuth } from "../context/AuthContext";
  import { api } from "../api";
  import RecipeCard from "../components/RecipeCard";

  export default function MyRecipes() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
      if (!user) { navigate("/login"); return; }
      async function load() {
        try {
          const data = await api("/api/v1/recipes/mine");
          setRecipes(data.recipes);
        } catch (err) {
          setError("Failed to load your recipes.");
        } finally {
          setLoading(false);
        }
      }
      load();
    }, [user]);

    return (
      <main>
        <section className="section">
          <h1 className="page-title">My Recipes</h1>
          {loading && <p>Loading…</p>}
          {error && <p className="error-text">{error}</p>}
          {!loading && recipes.length === 0 && (
            <p className="muted">You haven't submitted any recipes yet.</p>
          )}
          <div className="recipe-grid">
            {recipes.map((r) => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </div>
        </section>
      </main>
    );
  }