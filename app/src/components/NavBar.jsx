import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const location = useLocation();
  const { user, logOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  function Tab({ to, children }) {
    const isActive = location.pathname === to;
    return (
      <Link to={to} className={`pill ${isActive ? "active" : ""}`}>
        {children}
      </Link>
    );
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="nav-bar">
      <div className="nav-inner">
        <Link to="/" className="brand">
          GarnetSky Recipes
        </Link>

        <nav className="tabs">
          <Tab to="/">Home</Tab>
          <Tab to="/search">All Recipes</Tab>
          <Tab to="/favorites">Favorites</Tab>

          {user ? (
            <>
              {user.role === "admin" && <Tab to="/admin">Admin</Tab>}
              <div className="user-dropdown" ref={dropdownRef}>
                <button
                  className="pill pill-plain"
                  type="button"
                  onClick={() => setDropdownOpen((o) => !o)}
                >
                  Hi, {user.username} ▾
                </button>
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <Link to="/my-recipes" onClick={() => setDropdownOpen(false)}>
                      My Recipes
                    </Link>
                    <button
                      type="button"
                      onClick={() => { logOut(); setDropdownOpen(false); }}
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
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
