import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <section className="hero">
        <div className="hero-content">
          <h1>GarnetSky ☁️</h1>
          <p className="tagline">Discover, Save, and Share Amazing Recipes</p>
          <p className="description">
            Your personal recipe collection in the cloud. Save your favorite recipes,
            organize them your way, and never lose a great dish again.
          </p>
          <div className="cta-buttons">
            <Link to="/signup" className="btn btn-primary">Get Started Free</Link>
            <Link to="/login" className="btn btn-secondary">Login</Link>
          </div>
        </div>
      </section>

      <section className="video-section">
        <h2>See GarnetSky in Action</h2>
        <div className="video-container">
          <div className="video-placeholder">
            Demo Video Coming Soon!
          </div>
        </div>
      </section>

      <section className="features">
        <h2>Why Use GarnetSky?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="screenshot-placeholder">
              <img src="/screenshots/recipe-list.png" alt="Recipe list view" />
            </div>
            <h3>Organize Your Recipes</h3>
            <p>Browse, search, and filter your collection all in one place.</p>
          </div>
          <div className="feature-card">
            <div className="screenshot-placeholder">
              <img src="/screenshots/recipe-detail.png" alt="Recipe detail view" />
            </div>
            <h3>Detailed Recipe View</h3>
            <p>See ingredients, instructions, cooking time, and servings at a glance.</p>
          </div>
          <div className="feature-card">
            <div className="screenshot-placeholder">
              <img src="/screenshots/favorites.png" alt="Favorites view" />
            </div>
            <h3>Save Your Favorites</h3>
            <p>Bookmark recipes you love and access them anytime, anywhere.</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Start Cooking?</h2>
        <p>Join GarnetSky today and never lose track of a great recipe again.</p>
        <Link to="/signup" className="btn btn-primary">Sign Up Now</Link>
      </section>
    </div>
  );
};

export default LandingPage;