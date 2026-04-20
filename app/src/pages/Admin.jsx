import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";
import ConfirmModal from "../components/ConfirmModal";

export default function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");
  const [userQ, setUserQ] = useState("");
  const [recipeQ, setRecipeQ] = useState("");
  const [confirm, setConfirm] = useState(null); // { message, onConfirm }

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }
    loadData();
  }, [user]);

  async function loadData() {
    try {
      const [usersData, recipesData] = await Promise.all([
        api("/api/v1/admin/users"),
        api("/api/v1/recipes"),
      ]);
      setUsers(usersData.users);
      setRecipes(recipesData.recipes);
    } catch (err) {
      setError("Failed to load admin data.");
    }
  }

  function handleDeleteUser(userId) {
    setConfirm({
      message: "Delete this user?",
      onConfirm: async () => {
        setConfirm(null);
        try {
          await api(`/api/v1/admin/users/${userId}`, { method: "DELETE" });
          setUsers((prev) => prev.filter((u) => u.id !== userId));
        } catch {
          setError("Failed to delete user.");
        }
      },
    });
  }

  function handleDeleteRecipe(slug) {
    setConfirm({
      message: "Delete this recipe?",
      onConfirm: async () => {
        setConfirm(null);
        try {
          await api(`/api/v1/admin/recipes/${slug}`, { method: "DELETE" });
          setRecipes((prev) => prev.filter((r) => r.id !== slug));
        } catch {
          setError("Failed to delete recipe.");
        }
      },
    });
  }

  if (!user) return null;

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(userQ.toLowerCase()) ||
    u.email.toLowerCase().includes(userQ.toLowerCase())
  );

  const filteredRecipes = recipes.filter((r) =>
    r.title.toLowerCase().includes(recipeQ.toLowerCase())
  );

  const searchIcon = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );

  return (
    <main>
      {confirm && (
        <ConfirmModal
          message={confirm.message}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}
      <section className="section">
        <h1 className="page-title">Admin Dashboard</h1>
        {error && <p className="error-text">{error}</p>}

        <h2 style={{ marginTop: "2rem" }}>Users</h2>
        <div className="search-bar" style={{ marginBottom: "0.75rem" }}>
          <div className="search-input-wrap">
            <span className="search-icon">{searchIcon}</span>
            <input
              type="search"
              placeholder="Search users…"
              value={userQ}
              onChange={(e) => setUserQ(e.target.value)}
            />
          </div>
          <button type="button" className="pill-btn" onClick={() => setUserQ("")} disabled={!userQ}>Clear</button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>Username</th>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>Email</th>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>Role</th>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id} style={{ borderTop: "1px solid #e5e7eb" }}>
                <td style={{ padding: "0.5rem" }}>{u.username}</td>
                <td style={{ padding: "0.5rem" }}>{u.email}</td>
                <td style={{ padding: "0.5rem" }}>{u.role}</td>
                <td style={{ padding: "0.5rem" }}>
                  {u.id !== user.id && (
                    <button className="primary" style={{ background: "#c0392b" }} onClick={() => handleDeleteUser(u.id)}>
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 style={{ marginTop: "3rem" }}>Recipes</h2>
        <div className="search-bar" style={{ marginBottom: "0.75rem" }}>
          <div className="search-input-wrap">
            <span className="search-icon">{searchIcon}</span>
            <input
              type="search"
              placeholder="Search recipes…"
              value={recipeQ}
              onChange={(e) => setRecipeQ(e.target.value)}
            />
          </div>
          <button type="button" className="pill-btn" onClick={() => setRecipeQ("")} disabled={!recipeQ}>Clear</button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>Title</th>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecipes.map((r) => (
              <tr key={r.id} style={{ borderTop: "1px solid #e5e7eb" }}>
                <td style={{ padding: "0.5rem" }}>{r.title}</td>
                <td style={{ padding: "0.5rem" }}>
                  <button className="primary" style={{ background: "#c0392b" }} onClick={() => handleDeleteRecipe(r.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
