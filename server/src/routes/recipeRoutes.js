const express = require('express');

const { listRecipes, getRecipeBySlug } = require('../controllers/recipesController');

const router = express.Router();

// GET /api/v1/recipes
router.get('/', listRecipes);

// GET /api/v1/recipes/:slug
router.get('/:slug', getRecipeBySlug);

module.exports = router;
