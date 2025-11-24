import { useParams } from "react-router-dom";
import { RECIPES } from "../data/recipes";

export default function RecipeDetails() {
  const { id } = useParams();
  const r = RECIPES.find((x) => x.id === id) || RECIPES[0];

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
