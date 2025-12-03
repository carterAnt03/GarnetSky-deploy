// src/App.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layout
import NavBar from "./components/NavBar";

// Pages
import Home from "./pages/Home";
import Search from "./pages/Search";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Submit from "./pages/Submit";
import Favorites from "./pages/Favorites";
import RecipeDetails from "./pages/RecipeDetails";
import Contact from "./pages/Contact";
import About from "./pages/About";

// Styles
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">

        {/* Global Navigation */}
        <NavBar />

        {/* Application Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/recipe/:id" element={<RecipeDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;
