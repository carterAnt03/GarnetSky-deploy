import { Link } from "react-router-dom";

export default function RecipeCard({ r }) {
  return (
    <Link to={`/recipe/${r.id}`} className="recipe-card card">
      <img src={r.thumb} alt={r.title} />
      <div className="card-body">
        <h3>{r.title}</h3>
        <p className="muted">{r.desc}</p>
      </div>
    
    </Link>
  );
}
