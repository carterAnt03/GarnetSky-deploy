import { useState } from "react";
import { Link } from "react-router-dom";
import { getCuisineClass } from "../theme/cuisineThemes";
import { addFavorite, removeFavorite } from "../services/recipeService";
import { useAuth } from "../context/AuthContext";

export default function RecipeCard({ r, isFavorite: initialFav = false }) {
  const { user } = useAuth();
  const cuisineClass = getCuisineClass(r.tags);
  const [fav, setFav] = useState(initialFav);
  const [busy, setBusy] = useState(false);

  async function handleStar(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    setBusy(true);
    try {
      if (fav) {
        await removeFavorite(r.id);
        setFav(false);
      } else {
        await addFavorite(r.id);
        setFav(true);
      }
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
