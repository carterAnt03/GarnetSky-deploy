import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getRecipe, updateRecipe } from "../services/recipeService";
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

export default function EditRecipe() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [time, setTime] = useState("");
  const [tags, setTags] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [ingredientsText, setIngredientsText] = useState("");
  const [instructionsText, setInstructionsText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const recipe = await getRecipe(id);
        if (!user || recipe.authorId !== user.id) {
          navigate(`/recipe/${id}`);
          return;
        }
        setTitle(recipe.title || "");
        setDesc(recipe.desc || "");
        setTime(recipe.time || "");
        setTags(recipe.tags || []);
        setImageUrl(recipe.thumb || "");
        setIngredientsText((recipe.ingredients || []).map((i) => `<p>${i}</p>`).join(""));
        setInstructionsText((recipe.instructions || []).map((i) => `<p>${i}</p>`).join(""));
      } catch (err) {
        setError("Failed to load recipe.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, user]);

  function toggleTag(tag) {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!title.trim() || !desc.trim()) {
      setError("Title and description are required.");
      return;
    }
    try {
      setSaving(true);
      await updateRecipe(id, {
        title: title.trim(),
        desc: desc.trim(),
        time: time.trim() || null,
        tags: tags.join(","),
        imageUrl: imageUrl.trim() || null,
        ingredientsText: htmlToLines(ingredientsText),
        instructionsText: htmlToLines(instructionsText),
      });
      navigate(`/recipe/${id}`);
    } catch (err) {
      setError(err.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <main><section className="section"><p>Loading…</p></section></main>;

  return (
    <main>
      <section className="section">
        <button className="pill-btn" type="button" onClick={() => navigate(-1)}>← Back</button>
        <h1 className="page-title">Edit Recipe</h1>

        <div className="submit-wrap">
          <div className="card cream">
            <form className="recipe-form" onSubmit={handleSubmit}>

              <div className="form-field">
                <label>Recipe Title</label>
                <input type="text" value={title} maxLength={100} onChange={(e) => setTitle(e.target.value)} />
              </div>

              <div className="form-field">
                <label>Short Description</label>
                <input type="text" value={desc} maxLength={200} onChange={(e) => setDesc(e.target.value)} />
              </div>

              <div className="form-field">
                <label>Time (display)</label>
                <input type="text" value={time} maxLength={40} onChange={(e) => setTime(e.target.value)} />
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
                <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
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
                <label>Ingredients</label>
                <RichEditor value={ingredientsText} onChange={setIngredientsText} />
              </div>

              <div className="form-field">
                <label>Instructions</label>
                <RichEditor value={instructionsText} onChange={setInstructionsText} />
              </div>

              {error && <p className="error-text">{error}</p>}

              <button className="primary" type="submit" disabled={saving}>
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </form>
          </div>

          <div className="card instructions rose">
            <h2>Tips</h2>
            <ul className="bullets" style={{ color: "#6b7280" }}>
              <li>Changes are saved immediately when you click Save.</li>
              <li>Update tags to help others discover your recipe.</li>
              <li>Each ingredient and step should be on its own line.</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
