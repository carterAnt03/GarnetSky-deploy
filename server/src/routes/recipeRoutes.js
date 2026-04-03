const express = require('express');
const {
  listRecipes,
  getRecipeBySlug,
  createRecipe,
  getMyRecipes,
  deleteRecipe,
  updateRecipe,
} = require('../controllers/recipesController');

const { requireAuth } = require('../middleware/auth');
const { createRecipeSchema, validate } = require('../utils/validation');

const router = express.Router();

// List/search recipes
router.get('/', listRecipes);

// Create recipe
router.post('/', requireAuth, createRecipe);

// Get current user's recipes
router.get('/mine', requireAuth, getMyRecipes);

// Get recipe by slug
router.get('/:slug', getRecipeBySlug);

router.put('/:slug', requireAuth, updateRecipe);
router.delete('/:slug', requireAuth, deleteRecipe);

module.exports = router;
