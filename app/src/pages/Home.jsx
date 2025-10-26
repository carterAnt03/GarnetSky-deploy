import { RECIPES } from "../data/recipes";

export default function Home() {
  const featured = RECIPES[0];

  return (
    <main>
      <section className="section">
        <h1 className="page-title">Featured Recipes</h1>

        <div className="featured card">
          <img src={featured.thumb} alt={featured.title} />
          <div>
            <h2>{featured.title}</h2>
            <div className="muted">
              Time: {featured.time} &nbsp;•&nbsp; {featured.tags.join(" | ")}
            </div>
            <div className="actions">
              <button className="icon">☆</button>
              <button className="icon">↗</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
