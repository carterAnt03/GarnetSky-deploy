const express = require('express');
  const { listUsers, deleteUser, adminDeleteRecipe } = require('../controllers/adminController');
  const { requireAuth, isAdmin } = require('../middleware/auth');

  const router = express.Router();

  router.get('/users', requireAuth, isAdmin, listUsers);
  router.delete('/users/:userId', requireAuth, isAdmin, deleteUser);
  router.delete('/recipes/:slug', requireAuth, isAdmin, adminDeleteRecipe);

  module.exports = router;