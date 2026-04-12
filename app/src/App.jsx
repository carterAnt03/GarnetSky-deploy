import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import { FavoritesProvider } from "./context/FavoritesContext";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Search from "./pages/Search";
import Submit from "./pages/Submit";
import Favorites from "./pages/Favorites";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RecipeDetails from "./pages/RecipeDetails";
import MyRecipes from "./pages/MyRecipes";
import Admin from "./pages/Admin";
import EditRecipe from "./pages/EditRecipe";

// Optional: keep your API test page accessible at /__test
import TestApi from "./pages/TestApi";

function NotFound() {
  return (
    <div className="section">
      <h1 className="page-title">404</h1>
      <p className="muted">That page doesn’t exist.</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <FavoritesProvider>
      <div className="app-shell">
        <NavBar />

        <div className="content-area">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/submit" element={<Submit />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/recipe/:id" element={<RecipeDetails />} />
            <Route path="/recipe/:id/edit" element={<EditRecipe />} />
            <Route path="/my-recipes" element={<MyRecipes />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="/admin" element={<Admin />} />

            {/* Keep your test harness here */}
            <Route path="/__test" element={<TestApi />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </div>
      </FavoritesProvider>
    </BrowserRouter>
  );
}