const { pool } = require('../db');

  async function addFavorite(req, res) {
    const { recipeId } = req.params; // this is actually the slug
    const userId = req.user.id;
    try {
      const recipeResult = await pool.query(`SELECT id FROM recipes WHERE slug = $1`, [recipeId]);
      if (!recipeResult.rows.length) return res.status(404).json({ error: { code: 'NOT_FOUND',
  message: 'Recipe not found' } });
      const uuid = recipeResult.rows[0].id;
      await pool.query(
        `INSERT INTO favorites (user_id, recipe_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [userId, uuid]
      );
      res.status(201).json({ favorited: true });
    } catch (err) {
      console.error('addFavorite error:', err);
      res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Failed to add favorite' } });
    }
  }

  async function removeFavorite(req, res) {
    const { recipeId } = req.params; // slug
    const userId = req.user.id;
    try {
      const recipeResult = await pool.query(`SELECT id FROM recipes WHERE slug = $1`, [recipeId]);
      if (!recipeResult.rows.length) return res.status(404).json({ error: { code: 'NOT_FOUND',
  message: 'Recipe not found' } });
      const uuid = recipeResult.rows[0].id;
      await pool.query(
        `DELETE FROM favorites WHERE user_id = $1 AND recipe_id = $2`,
        [userId, uuid]
      );
      res.status(200).json({ favorited: false });
    } catch (err) {
      console.error('removeFavorite error:', err);
      res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Failed to remove favorite' }
  });
    }
  }

  async function getFavorites(req, res) {
    const userId = req.user.id;
    try {
      const result = await pool.query(
        `SELECT r.slug, r.title, r.description, r.time, r.tags, r.thumb
         FROM favorites f
         JOIN recipes r ON r.id = f.recipe_id
         WHERE f.user_id = $1
         ORDER BY f.created_at DESC`,
        [userId]
      );
      const recipes = result.rows.map(r => ({
        id: r.slug,
        title: r.title,
        desc: r.description,
        time: r.time,
        tags: r.tags || [],
        thumb: r.thumb,
      }));
      res.json({ recipes });
    } catch (err) {
      console.error('getFavorites error:', err);
      res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Failed to get favorites' }
  });
    }
  }

  module.exports = { addFavorite, removeFavorite, getFavorites };