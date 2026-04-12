import { useState } from "react";
import { Link } from "react-router-dom";
import { getCuisineClass } from "../theme/cuisineThemes";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";

export default function RecipeCard({ r }) {
  const { user } = useAuth();
  const { favIds, toggleFavorite } = useFavorites();
  const cuisineClass = getCuisineClass(r.tags);
  const fav = favIds.has(r.id);
  const [busy, setBusy] = useState(false);

  async function handleStar(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    setBusy(true);
    try {
      await toggleFavorite(r.id);
    } catch {
      // silent fail
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="recipe-card-wrap">
      <Link to={`/recipe/${r.id}`} className={`recipe-card card ${cuisineClass}`}>
        <img src={r.thumb} alt={r.title} />
        <div className="card-body">
          <h3>{r.title}</h3>
          <p className="muted">{r.desc}</p>
        </div>
      </Link>
      {user && (
        <button
          type="button"
          className={`star-btn ${fav ? "starred" : ""}`}
          onClick={handleStar}
          disabled={busy}
          title={fav ? "Remove from favorites" : "Add to favorites"}
        >
          ★
        </button>
      )}
    </div>
  );
}
