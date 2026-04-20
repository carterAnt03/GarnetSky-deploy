import { createContext, useContext, useEffect, useState } from "react";
import { getFavorites, addFavorite, removeFavorite } from "../services/recipeService";
import { useAuth } from "./AuthContext";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const [favIds, setFavIds] = useState(new Set());

  useEffect(() => {
    if (!user) { setFavIds(new Set()); return; }
    getFavorites()
      .then((list) => setFavIds(new Set(list.map((r) => r.id))))
      .catch(() => {});
  }, [user]);

  async function toggleFavorite(id) {
    if (favIds.has(id)) {
      await removeFavorite(id);
      setFavIds((prev) => { const next = new Set(prev); next.delete(id); return next; });
    } else {
      await addFavorite(id);
      setFavIds((prev) => new Set(prev).add(id));
    }
  }

  return (
    <FavoritesContext.Provider value={{ favIds, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
