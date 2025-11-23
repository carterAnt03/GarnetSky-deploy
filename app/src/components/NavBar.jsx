import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { pathname } = useLocation();
  const { user, logOut } = useAuth();

  const Tab = ({ to, children }) => (
    <Link
      className={`pill ${pathname === to ? "active" : ""}`}
      to={to}
    >
      {children}
    </Link>
  );

  return (
    <header className="nav-bar">
      <div className="nav-inner">
        {/* Brand / Site Title */}
        <span className="brand">GarnetSky Recipes</span>

        {/* Navigation Tabs */}
        <nav className="tabs">
          <Tab to="/">Home</Tab>
          <Tab to="/search">Search</Tab>
          <Tab to="/submit">Submit</Tab>
          <Tab to="/favorites">Favorites</Tab>

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
