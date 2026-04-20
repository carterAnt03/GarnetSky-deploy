// src/App.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layout
import NavBar from "./components/NavBar";

// Pages
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Submit from "./pages/Submit";
import Favorites from "./pages/Favorites";
import RecipeDetails from "./pages/RecipeDetails";
import EditRecipe from "./pages/EditRecipe";
import MyRecipes from "./pages/MyRecipes";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Admin from "./pages/Admin";
import TestApi from "./pages/TestApi";

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
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
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
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/__test" element={<TestApi />} />
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;