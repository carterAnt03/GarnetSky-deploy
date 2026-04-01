import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createRecipe } from "../services/recipeService";

export default function SubmitPage() {
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [time, setTime] = useState("");
  const [tags, setTags] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [ingredientsText, setIngredientsText] = useState("");
  const [instructionsText, setInstructionsText] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | success
  const [createdRecipe, setCreatedRecipe] = useState(null);

  const isSubmitting = status === "submitting";

  function resetForm() {
    setTitle("");
    setDesc("");
    setTime("");
    setTags("");
    setImageUrl("");
    setIngredientsText("");
    setInstructionsText("");
    setError("");
    setStatus("idle");
    setCreatedRecipe(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("You must be logged in to submit a recipe.");
      return;
    }

    if (!title.trim() || !desc.trim()) {
      setError("Please enter at least a title and short description.");
      return;
    }

    try {
      setStatus("submitting");

      const recipe = await createRecipe({
        authorId: user.id,
        title: title.trim(),
        desc: desc.trim(),
        time: time.trim() || null,
        tags: tags,
        imageUrl: imageUrl.trim() || null,
        ingredientsText,
        instructionsText,
      });

      if (!recipe || !recipe.id) {
        throw new Error(
          "The recipe was saved but the server returned an unexpected response. " +
          "Check the Search page — your recipe should appear there."
        );
      }

      setCreatedRecipe(recipe);
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("idle");
      setError(err.message || "Failed to submit recipe.");
    }
  }

  // Success screen after recipe is saved
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
              <Link className="pill-btn" to={`/recipe/${createdRecipe.id}`}>
                View recipe
              </Link>
              <Link className="pill-btn" to="/search">
                Browse all recipes
              </Link>
              <button className="pill-btn" type="button" onClick={resetForm}>
                Submit another recipe
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="section">
        <h1 className="page-title">Submit New Recipe</h1>

        <div className="submit-wrap">
          {/* Left: form */}
          <div className="card cream">
            <form className="auth-form" onSubmit={handleSubmit}>
              <label>
                Recipe Title
                <input
                  type="text"
                  placeholder="Spaghetti Bolognese"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </label>

              <label>
                Short Description
                <input
                  type="text"
                  placeholder="A cozy, classic spaghetti dinner..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </label>

              <label>
                Time (display)
                <input
                  type="text"
                  placeholder="30 minutes"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </label>

              <label>
                Tags (comma-separated)
                <input
                  type="text"
                  placeholder="pasta, italian, easy"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </label>

               <label>                                                                                          
                Image URL
                <input
                  type="url"
                  placeholder="https://example.com/my-delicious-pasta.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </label>

              {imageUrl && (
                <div style={{ marginTop: "0.5rem" }}>
                  <img
                    src={imageUrl}
                    alt="Recipe preview"
                    onError={(e) => (e.target.style.display = "none")}
                    onLoad={(e) => (e.target.style.display = "block")}
                    style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "8px", display: "none" }}
                  />
                </div>
              )}

              <label>
                Ingredients <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                  (one per line)
                </span>
                <textarea
                  rows={6}
                  placeholder={
                    "200 g spaghetti\n200 g ground beef\n1 cup tomato sauce\n1 onion, diced\n2 cloves garlic, minced\nSalt and pepper to taste"
                  }
                  value={ingredientsText}
                  onChange={(e) => setIngredientsText(e.target.value)}
                />
              </label>

              <label>
                Instructions <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                  (one step per line)
                </span>
                <textarea
                  rows={6}
                  placeholder={
                    "Cook spaghetti according to package instructions.\nSauté onion and garlic until softened.\nAdd ground beef and cook until browned.\nStir in tomato sauce and simmer for 10 minutes.\nServe sauce over spaghetti and enjoy."
                  }
                  value={instructionsText}
                  onChange={(e) => setInstructionsText(e.target.value)}
                />
              </label>

              {error && <p className="error-text">{error}</p>}

              <button className="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Publishing..." : "Publish"}
              </button>
            </form>
          </div>

          {/* Right: hint card */}
          <div className="card instructions rose">
            <h2>Instructions</h2>
            <p className="muted">
              Use the form to add a rich description, ingredients list, and clear
              step-by-step instructions. Your recipe will appear on the home and
              search pages after publishing.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
