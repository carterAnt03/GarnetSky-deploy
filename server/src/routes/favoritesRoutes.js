const express = require('express');
  const { addFavorite, removeFavorite, getFavorites } =
  require('../controllers/favoritesController');
  const { requireAuth } = require('../middleware/auth');

  const router = express.Router();

  router.get('/', requireAuth, getFavorites);
  router.post('/:recipeId', requireAuth, addFavorite);
  router.delete('/:recipeId', requireAuth, removeFavorite);

  module.exports = router;