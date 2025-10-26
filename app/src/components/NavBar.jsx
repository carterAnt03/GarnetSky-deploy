import { Link, useLocation } from "react-router-dom";

export default function NavBar() {
  const { pathname } = useLocation();

  const Tab = ({ to, children }) => (
    <Link className={`pill ${pathname === to ? "active" : ""}`} to={to}>
      {children}
    </Link>
  );

  return (
    <header className="nav-wrap card">
      <div className="brand">Home</div>
      <nav className="tabs">
        <Tab to="/search">Search</Tab>
        <Tab to="/login">Login</Tab>
        <Tab to="/submit">Submit</Tab>
        <Tab to="/favorites">Favorites</Tab>
      </nav>
    </header>
  );
}