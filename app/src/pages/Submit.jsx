import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createRecipe, uploadImage } from "../services/recipeService";
import { TAGS } from "../data/tags";
import RichEditor from "../components/RichEditor";

function htmlToLines(html) {
  return html
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .join("\n");
}

export default function SubmitPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [time, setTime] = useState("");
  const [tags, setTags] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [imageMode, setImageMode] = useState("upload"); // "url" | "upload"
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
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
    setImageUrl(""); setImageMode("url"); setImagePreview(""); setUploading(false);
    setIngredientsText(""); setInstructionsText("");
    setError(""); setStatus("idle"); setCreatedRecipe(null);
  }

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    setUploading(true);
    setError("");
    try {
      const url = await uploadImage(file);
      setImageUrl(url);
    } catch (err) {
      setError(err.message || "Image upload failed.");
    } finally {
      setUploading(false);
    }
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
        ingredientsText: htmlToLines(ingredientsText),
        instructionsText: htmlToLines(instructionsText),
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
                <label>Image</label>
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <button
                    type="button"
                    className={`pill-btn ${imageMode === "upload" ? "primary" : ""}`}
                    style={{ padding: "0.3rem 0.9rem", fontSize: "0.85rem" }}
                    onClick={() => { setImageMode("upload"); setImageUrl(""); }}
                  >
                    Upload from device
                  </button>
                  <button
                    type="button"
                    className={`pill-btn ${imageMode === "url" ? "primary" : ""}`}
                    style={{ padding: "0.3rem 0.9rem", fontSize: "0.85rem" }}
                    onClick={() => { setImageMode("url"); setImagePreview(""); }}
                  >
                    Link
                  </button>
                </div>
                {imageMode === "url" ? (
                  <input
                    type="url"
                    placeholder="https://example.com/my-recipe.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                ) : (
                  <label style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.4rem",
                    padding: "1.5rem",
                    border: "2px dashed #d1d5db",
                    borderRadius: "12px",
                    cursor: uploading ? "default" : "pointer",
                    background: "#fff",
                    color: "#6b7280",
                    fontSize: "0.9rem",
                    transition: "border-color 0.15s",
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (file) handleFileChange({ target: { files: [file] } });
                  }}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    <span>{uploading ? "Uploading…" : "Click or drag an image here"}</span>
                    <span style={{ fontSize: "0.8rem" }}>PNG, JPG, WEBP up to 5 MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={uploading}
                      style={{ display: "none" }}
                    />
                  </label>
                )}
                {uploading && <p className="muted" style={{ margin: "0.25rem 0 0" }}>Uploading…</p>}
                {(imageMode === "url" ? imageUrl : imagePreview) && (
                  <img
                    src={imageMode === "url" ? imageUrl : imagePreview}
                    alt="Preview"
                    onError={(e) => (e.target.style.display = "none")}
                    onLoad={(e) => (e.target.style.display = "block")}
                    style={{ maxWidth: "100%", maxHeight: "180px", borderRadius: "8px", marginTop: "0.5rem", display: "none" }}
                  />
                )}
              </div>

              <div className="form-field">
                <label>Ingredients</label>
                <RichEditor
                  value={ingredientsText}
                  onChange={setIngredientsText}
                  placeholder="200 g spaghetti&#10;1 cup tomato sauce&#10;2 cloves garlic"
                />
              </div>

              <div className="form-field">
                <label>Instructions</label>
                <RichEditor
                  value={instructionsText}
                  onChange={setInstructionsText}
                  placeholder="Cook pasta until al dente.&#10;Sauté garlic in olive oil.&#10;Add sauce and simmer."
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
              <li>Drag and drop an image or upload from your device. You can also switch to a URL link.</li>
              <li>Use the tag picker to help others find your recipe.</li>
              <li>Use the text editor to format ingredients and instructions — bullet or numbered lists work great.</li>
              <li>Write each instruction as a single step for clarity.</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
