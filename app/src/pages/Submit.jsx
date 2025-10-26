import { useState } from "react";

export default function Submit() {
  const [form, setForm] = useState({ title: "", desc: "", ingredients: "" });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    alert(`(Demo) Submitted: ${form.title}`);
  };

  return (
    <main>
      <section className="submit-wrap">
        <div className="card cream">
          <h1 className="page-title">Submit New Recipe</h1>
          <form onSubmit={submit} className="submit-form">
            <label>Recipe Title</label>
            <input
              name="title"
              value={form.title}
              onChange={onChange}
              placeholder="Insert Text"
            />
            <label>Short Description</label>
            <input
              name="desc"
              value={form.desc}
              onChange={onChange}
              placeholder="Insert Text"
            />
            <label>Ingredients</label>
            <input
              name="ingredients"
              value={form.ingredients}
              onChange={onChange}
              placeholder="Insert Text"
            />
            <div className="upload-box">⬆️</div>
            <button className="primary right">PUBLISH</button>
          </form>
        </div>

        <aside className="instructions card rose">
          <h3>INSTRUCTIONS</h3>
          <div className="lines">
            <span />
            <span />
            <span />
            <span />
          </div>
        </aside>
      </section>
    </main>
  );
}
