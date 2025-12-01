import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createRecipe } from "../services/recipeService";

export default function SubmitPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [time, setTime] = useState("");
  const [tags, setTags] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [ingredientsText, setIngredientsText] = useState("");
  const [instructionsText, setInstructionsText] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | success

  const isSubmitting = status === "submitting";

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
        authorId: user.id,        // 👈 from AuthContext
        title: title.trim(),
        desc: desc.trim(),
        time: time.trim() || null,
        tags: tags,               // backend will split this
        imageUrl: imageUrl.trim() || null,
        ingredientsText,
        instructionsText,
      });

      setStatus("success");

      // Navigate to the new recipe detail page
      navigate(`/recipe/${recipe.id}`);
    } catch (err) {
      console.error(err);
      setStatus("idle");
      setError(err.message || "Failed to submit recipe.");
    }
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
                  type="text"
                  placeholder="https://example.com/my-delicious-pasta.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </label>

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
