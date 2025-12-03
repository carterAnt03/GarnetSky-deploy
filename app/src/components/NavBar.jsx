
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const location = useLocation();
  const { user, logOut } = useAuth();

  function Tab({ to, children }) {
    const isActive = location.pathname === to;

    return (
      <Link
        to={to}
        className={`pill ${isActive ? "active" : ""}`}
      >
        {children}
      </Link>
    );
  }

  return (
    <header className="nav-bar">
      <div className="nav-inner">

        {/* Brand */}
        <Link to="/" className="brand">
          GarnetSky Recipes
        </Link>

        {/* Nav Tabs */}
        <nav className="tabs">
          <Tab to="/">Home </Tab>
          <Tab to="/search">Search </Tab>
          <Tab to="/submit">Submit </Tab>
          <Tab to="/favorites">Favorites </Tab>
          <Tab to="/about">About </Tab>
          <Tab to="/contact">Contact </Tab>

          {user ? (
            <>
              <span className="pill pill-plain">Hi, {user.username}</span>
              <button
                className="pill pill-outline"
                type="button"
                onClick={logOut}
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Tab to="/login">Login</Tab>
              <Tab to="/signup">Sign Up</Tab>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
