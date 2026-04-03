import { useState } from "react";

export default function Contact() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <main>
      <section className="section">
        <h1 className="page-title">Contact Us</h1>
        <p className="muted">
          Have feedback, found a bug, or want to suggest a feature? We'd love to hear from you.
          You can also email us directly at{" "}
          <a href="mailto:support@garnetsky-recipes.example">
            support@garnetsky-recipes.example
          </a>
          .
        </p>

        {sent ? (
          <div className="card cream" style={{ maxWidth: 560 }}>
            <h2>Message sent!</h2>
            <p className="muted">Thanks for reaching out. We'll get back to you soon.</p>
            <button className="pill-btn primary" style={{ marginTop: "0.75rem" }} onClick={() => setSent(false)}>
              Send another
            </button>
          </div>
        ) : (
          <div className="card" style={{ maxWidth: 680 }}>
            <h2 style={{ marginBottom: "1.25rem" }}>Send a message</h2>
            <form className="contact-form-inline" onSubmit={handleSubmit}>
              <div className="contact-top-row">
                <label className="contact-inline-field">
                  <span>Your name</span>
                  <input type="text" name="name" placeholder="Jane Doe" required />
                </label>
                <label className="contact-inline-field">
                  <span>Email</span>
                  <input type="email" name="email" placeholder="you@example.com" required />
                </label>
                <button className="primary" type="submit">
                  Send message
                </button>
              </div>

              <label className="contact-message-field">
                <span>Message</span>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Tell us what's on your mind…"
                  style={{ resize: "none" }}
                  required
                />
              </label>
            </form>
          </div>
        )}
      </section>
    </main>
  );
}
