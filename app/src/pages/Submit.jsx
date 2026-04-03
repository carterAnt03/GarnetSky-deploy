import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createRecipe } from "../services/recipeService";
import { TAGS } from "../data/tags";

export default function SubmitPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [time, setTime] = useState("");
  const [tags, setTags] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [ingredientsText, setIngredientsText] = useState("");
  const [instructionsText, setInstructionsText] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle");
  const [createdRecipe, setCreatedRecipe] = useState(null);

  const isSubmitting = status === "submitting";

  function toggleTag(tag) {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function resetForm() {
    setTitle(""); setDesc(""); setTime(""); setTags([]);
    setImageUrl(""); setIngredientsText(""); setInstructionsText("");
    setError(""); setStatus("idle"); setCreatedRecipe(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!user) { setError("You must be logged in to submit a recipe."); return; }
    if (!title.trim() || !desc.trim()) { setError("Please enter at least a title and short description."); return; }

    try {
      setStatus("submitting");
      const recipe = await createRecipe({
        authorId: user.id,
        title: title.trim(),
        desc: desc.trim(),
        time: time.trim() || null,
        tags: tags.join(","),
        imageUrl: imageUrl.trim() || null,
        ingredientsText,
        instructionsText,
      });

      if (!recipe || !recipe.id) {
        throw new Error("The recipe was saved but the server returned an unexpected response.");
      }

      setCreatedRecipe(recipe);
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("idle");
      setError(err.message || "Failed to submit recipe.");
    }
  }

  if (status === "success" && createdRecipe) {
    return (
      <main>
        <section className="section">
          <h1 className="page-title">Recipe Published!</h1>
          <div className="card cream" style={{ maxWidth: 600, margin: "0 auto" }}>
            <p style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
              <strong>{createdRecipe.title}</strong> has been saved successfully.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <Link className="pill-btn" to={`/recipe/${createdRecipe.id}`}>View recipe</Link>
              <Link className="pill-btn" to="/search">Browse all recipes</Link>
              <button className="pill-btn" type="button" onClick={resetForm}>Submit another</button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="section">
        <button className="pill-btn" type="button" onClick={() => navigate(-1)}>← Back</button>
        <h1 className="page-title">New Recipe</h1>

        <div className="submit-wrap">
          <div className="card cream">
            <form className="recipe-form" onSubmit={handleSubmit}>

              <div className="form-field">
                <label>Recipe Title</label>
                <input
                  type="text"
                  placeholder="Spaghetti Bolognese"
                  value={title}
                  maxLength={100}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Short Description</label>
                <input
                  type="text"
                  placeholder="A cozy, classic spaghetti dinner..."
                  value={desc}
                  maxLength={200}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Time (display)</label>
                <input
                  type="text"
                  placeholder="30 minutes"
                  value={time}
                  maxLength={40}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>
                  Tags{" "}
                  {tags.length > 0 && (
                    <span className="muted" style={{ fontSize: "0.85rem" }}>({tags.length} selected)</span>
                  )}
                </label>
                <div className="tag-picker">
                  {TAGS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`pill-btn ${tags.includes(t) ? "primary" : ""}`}
                      onClick={() => toggleTag(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-field">
                <label>Image URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/my-recipe.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Preview"
                    onError={(e) => (e.target.style.display = "none")}
                    onLoad={(e) => (e.target.style.display = "block")}
                    style={{ maxWidth: "100%", maxHeight: "180px", borderRadius: "8px", marginTop: "0.5rem", display: "none" }}
                  />
                )}
              </div>

              <div className="form-field">
                <label>
                  Ingredients <span className="muted" style={{ fontSize: "0.85rem" }}>(one per line)</span>
                </label>
                <textarea
                  rows={6}
                  placeholder={"200 g spaghetti\n1 cup tomato sauce\n2 cloves garlic"}
                  value={ingredientsText}
                  maxLength={2000}
                  style={{ resize: "none" }}
                  onChange={(e) => setIngredientsText(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>
                  Instructions <span className="muted" style={{ fontSize: "0.85rem" }}>(one step per line)</span>
                </label>
                <textarea
                  rows={6}
                  placeholder={"Cook pasta until al dente.\nSauté garlic in olive oil.\nAdd sauce and simmer."}
                  value={instructionsText}
                  maxLength={3000}
                  style={{ resize: "none" }}
                  onChange={(e) => setInstructionsText(e.target.value)}
                />
              </div>

              {error && <p className="error-text">{error}</p>}

              <button className="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Publishing..." : "Publish"}
              </button>
            </form>
          </div>

          <div className="card instructions rose">
            <h2>Tips</h2>
            <ul className="bullets" style={{ color: "#6b7280" }}>
              <li>Use the tag picker to help others find your recipe.</li>
              <li>Add one ingredient per line for a clean list.</li>
              <li>Write each instruction as a single step.</li>
              <li>Paste an image URL for a photo preview.</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
