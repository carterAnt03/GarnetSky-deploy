// src/pages/Contact.jsx
export default function Contact() {
  function handleSubmit(e) {
    e.preventDefault(); // for now we just pretend to send
    alert("Thanks for reaching out! We’ll get back to you soon.");
  }

  return (
    <main>
      <section className="section">
        <h1 className="page-title">Contact Us</h1>
        <p className="muted">
          Have feedback, found a bug, or want to suggest a new recipe feature?
          We&apos;d love to hear from you.
        </p>

        <div className="contact-layout">
          {/* Left side: contact info */}
          <div className="card contact-card">
            <h2>Get in touch</h2>
            <p className="muted">
              This is a class project for GarnetSky Recipes. If you have
              questions about the app or need help logging in, use the form or
              email us directly.
            </p>

            <ul className="bullets">
              <li>
                <strong>Email:</strong> support@garnetsky-recipes.example
              </li>
              <li>
                <strong>Office hours:</strong> Mon–Fri, 9am–5pm (EST)
              </li>
            </ul>
          </div>

          {/* Right side: simple form */}
          <div className="card contact-card">
            <h2>Send a message</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
              <label>
                Your name
                <input
                  type="text"
                  name="name"
                  placeholder="Jane Doe"
                  required
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                />
              </label>

              <label>
                Message
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Tell us what’s on your mind…"
                  required
                />
              </label>

              <button className="primary" type="submit">
                Send message
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
