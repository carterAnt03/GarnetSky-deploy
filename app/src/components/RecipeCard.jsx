import { Link } from "react-router-dom";                                                                                                         
  import { getCuisineClass } from "../theme/cuisineThemes";                                                                                        
                                                                                                                                                   
  export default function RecipeCard({ r }) {                     
    // Detect cuisine from tags and get the matching CSS theme class
    const cuisineClass = getCuisineClass(r.tags);

    return (
      // Append the cuisine class so the card gets the correct accent border color
      <Link to={`/recipe/${r.id}`} className={`recipe-card card ${cuisineClass}`}>
        <img src={r.thumb} alt={r.title} />
        <div className="card-body">
          <h3>{r.title}</h3>
          <p className="muted">{r.desc}</p>
        </div>
      </Link>
    );
  }