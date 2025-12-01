const express = require('express');
const {
  listRecipes,
  getRecipeBySlug,
  createRecipe,
} = require('../controllers/recipesController');

const router = express.Router();

// List/search
router.get('/', listRecipes);

// Create
router.post('/', createRecipe);

// Details
router.get('/:slug', getRecipeBySlug);

module.exports = router;
