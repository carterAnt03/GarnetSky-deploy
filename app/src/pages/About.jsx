// src/pages/About.jsx

export default function About() {
  return (
    <main>
      <section className="section">
        <h1 className="page-title">About Us</h1>
        <p className="muted">
          GarnetSky Recipes is a simple, student-built cooking app created for a
          University of South Carolina course project. Our goal is to make it
          easy and fun for anyone to discover, search, and share delicious meals.
        </p>

        <div className="card cream" style={{ marginTop: "1rem" }}>
          <h2>Our Mission</h2>
          <p>
            We believe food brings people together. Whether you're learning to
            cook for the first time, experimenting with new flavors, or returning
            to favorite comfort meals, our little recipe hub is designed to make
            inspiration easy to find.
          </p>
        </div>

        <div className="card rose">
          <h2>What We Built</h2>
          <ul className="bullets">
            <li>A full recipe search engine with tags & keywords</li>
            <li>User authentication with signup, login, and logout</li>
            <li>Submit-your-own recipes feature</li>
            <li>Favorites, detailed instructions, and ingredient breakdowns</li>
            <li>A cozy, food-inspired visual theme</li>
          </ul>
        </div>

        <div className="card cream">
          <h2>Who We Are</h2>
          <p>
            We are students learning to design, build, and deploy full-stack
            applications. This project showcases practical experience with
            modern web technologies including React, API routing, authentication,
            and responsive UI design.
          </p>
        </div>

        <p className="muted" style={{ marginTop: "1rem" }}>
          Thank you for visiting our project! Feel free to explore the recipes,
          try out the search features, or submit your own favorite dish.
        </p>
      </section>
    </main>
  );
}
