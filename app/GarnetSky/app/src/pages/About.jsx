// src/pages/About.jsx                                                                                                                           
                                                                                                                                                   
  import { Link } from "react-router-dom";                        
                                                                                                                                                   
  export default function About() {                                                                                                                
    return (
      <main>
        <section className="section">
          <h1 className="page-title">About Us</h1>
          <p className="muted">
            GarnetSky Recipes is a student-built cooking app created for a
            University of South Carolina Capstone course. Our goal is to make it
            easy and fun for anyone to discover, search, and share delicious meals.
          </p>

          {/* Mission */}
          <div className="card cream" style={{ marginTop: "1rem" }}>
            <h2>Our Mission</h2>
            <p>
              We believe food brings people together. Whether you're learning to
              cook for the first time, experimenting with new flavors, or returning
              to favorite comfort meals, our recipe hub is designed to make
              inspiration easy to find.
            </p>
          </div>

          {/* What we built */}
          <div className="card rose">
            <h2>What We Built</h2>
            <ul className="bullets">
              <li>A full recipe search engine with tags &amp; keywords</li>
              <li>User authentication with signup, login, and logout</li>
              <li>Submit-your-own recipes feature</li>
              <li>Favorites, detailed instructions, and ingredient breakdowns</li>
              <li>A daily rotating Recipe of the Day</li>
              <li>Cuisine-based color theming on recipe cards</li>
            </ul>
          </div>

          {/* Team */}
          <div className="card cream">
            <h2>Meet the Team</h2>
            <ul className="bullets">
              <li>Aidan McClelland — ajm54@email.sc.edu</li>
              <li>Jonah Mosquera — mosquerj@email.sc.edu</li>
              <li>Carter Antley — ctantley@email.sc.edu</li>
              <li>Jason Pope — jjpope@email.sc.edu</li>
              <li>Ayden Mathews — aydenwm@email.sc.edu</li>
            </ul>
          </div>

          {/* Contact overview */}
          <div className="card rose">
            <h2>Contact</h2>
            <p>
              Have a question or want to get in touch? Visit our{" "}
              <Link to="/contact">Contact page</Link> and we'll get back to you.
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