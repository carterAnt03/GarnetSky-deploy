import { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import { useAuth } from "../context/AuthContext";
  import { api } from "../api";

  export default function AdminPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [error, setError] = useState("");

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

    async function handleDeleteUser(userId) {
      if (!window.confirm("Delete this user?")) return;
      try {
        await api(`/api/v1/admin/users/${userId}`, { method: "DELETE" });
        setUsers((prev) => prev.filter((u) => u.id !== userId));
      } catch (err) {
        setError("Failed to delete user.");
      }
    }

    async function handleDeleteRecipe(slug) {
      if (!window.confirm("Delete this recipe?")) return;
      try {
        await api(`/api/v1/admin/recipes/${slug}`, { method: "DELETE" });
        setRecipes((prev) => prev.filter((r) => r.id !== slug));
      } catch (err) {
        setError("Failed to delete recipe.");
      }
    }

    if (!user) return null;

    return (
      <main>
        <section className="section">
          <h1 className="page-title">Admin Dashboard</h1>
          {error && <p className="error-text">{error}</p>}

          <h2 style={{ marginTop: "2rem" }}>Users</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>Username</th>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>Email</th>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>Role</th>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderTop: "1px solid #e5e7eb" }}>
                  <td style={{ padding: "0.5rem" }}>{u.username}</td>
                  <td style={{ padding: "0.5rem" }}>{u.email}</td>
                  <td style={{ padding: "0.5rem" }}>{u.role}</td>
                  <td style={{ padding: "0.5rem" }}>
                    {u.id !== user.id && (
                      <button
                        className="primary"
                        style={{ background: "#c0392b" }}
                        onClick={() => handleDeleteUser(u.id)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 style={{ marginTop: "3rem" }}>Recipes</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>Title</th>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recipes.map((r) => (
                <tr key={r.id} style={{ borderTop: "1px solid #e5e7eb" }}>
                  <td style={{ padding: "0.5rem" }}>{r.title}</td>
                  <td style={{ padding: "0.5rem" }}>
                    <button
                      className="primary"
                      style={{ background: "#c0392b" }}
                      onClick={() => handleDeleteRecipe(r.id)}
                    >
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