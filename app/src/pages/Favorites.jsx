import { RECIPES } from "../data/recipes";

export default function Favorites() {
  const favs = [RECIPES[0], ...(RECIPES[1] ? [RECIPES[1]] : [])];

  return (
    <main>
      <section className="section">
        <h1 className="page-title">Favorites</h1>
        <div className="favorites-rail">
          {favs.map((f) => (
            <div key={f.id} className="fav-tile">
              <img src={f.thumb} alt={f.title} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
