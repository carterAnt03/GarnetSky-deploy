/**
 * Recipes Controller
 *
 * Handles listing and retrieving recipes from the database.
 */

const pool = require('../config/database');

/**
 * List/search recipes
 * GET /api/v1/recipes
 * Query params:
 *  - q: search string (optional)
 *  - tag: filter by tag (optional)
 */
async function listRecipes(req, res) {
  try {
    const { q, tag } = req.query;

    const values = [];
    const conditions = [];

    if (q) {
      values.push(`%${q}%`);
      const idx = values.length;
      conditions.push(
        `(title ILIKE $${idx} OR description ILIKE $${idx} OR $${idx} = ANY(tags))`
      );
    }

    if (tag) {
      values.push(tag);
      const idx = values.length;
      conditions.push(`$${idx} = ANY(tags)`);
    }

    let query =
      'SELECT slug, title, description, time, tags, thumb FROM recipes';

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY id ASC';

    const result = await pool.query(query, values);

    const recipes = result.rows.map((row) => ({
      id: row.slug,
      title: row.title,
      desc: row.description,
      time: row.time,
      tags: row.tags || [],
      thumb: row.thumb,
    }));

    res.json({ recipes });
  } catch (error) {
    console.error('listRecipes error:', error);
    res.status(500).json({
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred while fetching recipes',
      },
    });
  }
}

/**
 * Get a single recipe by slug
 * GET /api/v1/recipes/:slug
 */
async function getRecipeBySlug(req, res) {
  try {
    const { slug } = req.params;

    const result = await pool.query(
      'SELECT * FROM recipes WHERE slug = $1',
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: {
          code: 'RECIPE_NOT_FOUND',
          message: 'Recipe not found',
        },
      });
    }

    const row = result.rows[0];

    const recipe = {
      id: row.slug,
      title: row.title,
      desc: row.description,
      time: row.time,
      tags: row.tags || [],
      thumb: row.thumb,
      ingredients: row.ingredients || [],
      instructions: row.instructions || [],
    };

    res.json({ recipe });
  } catch (error) {
    console.error('getRecipeBySlug error:', error);
    res.status(500).json({
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred while fetching the recipe',
      },
    });
  }
}

// server/src/controllers/recipesController.js

/**
 * Create a new recipe
 * POST /api/v1/recipes
 *
 * Body:
 *  - authorId: UUID of the user creating the recipe (required)
 *  - title: string (required)
 *  - desc: short description (required)
 *  - time: display string like "30 minutes" (optional)
 *  - tags: comma-separated string or array (optional)
 *  - imageUrl: string (optional, used for both image_url and thumb)
 *  - ingredientsText: multiline string, one ingredient per line
 *  - instructionsText: multiline string, one step per line
 */
async function createRecipe(req, res) {
  try {
    const {
      authorId,
      title,
      desc,
      time,
      tags,
      imageUrl,
      ingredientsText,
      instructionsText,
    } = req.body;

    if (!authorId || !title || !desc) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'authorId, title, and desc are required',
        },
      });
    }

    // Generate a URL-friendly slug from the title
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Add a tiny suffix so slugs are likely unique
    const slug = `${baseSlug}-${Date.now().toString(36)}`;

    // Tags: accept either array or comma-separated string
    const tagArray = Array.isArray(tags)
      ? tags
      : (tags || '')
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);

    // Ingredients & instructions: split on newlines into arrays
    const ingredients = (ingredientsText || '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const instructions = (instructionsText || '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    // In this simple version we don't require time_minutes/servings
    const timeMinutes = null;
    const servings = null;

    const img = imageUrl || null;

    const result = await pool.query(
      `
      INSERT INTO recipes (
        author_id,
        title,
        description,
        time_minutes,
        servings,
        image_url,
        tags,
        slug,
        time,
        thumb,
        ingredients,
        instructions
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING slug, title, description, time, tags, thumb
    `,
      [
        authorId,
        title,
        desc,
        timeMinutes,
        servings,
        img,
        tagArray,
        slug,
        time || null,
        img,
        ingredients,
        instructions,
      ]
    );

    const row = result.rows[0];

    const recipe = {
      id: row.slug,
      title: row.title,
      desc: row.description,
      time: row.time,
      tags: row.tags || [],
      thumb: row.thumb,
    };

    res.status(201).json({ recipe });
  } catch (error) {
    console.error('createRecipe error:', error);
    res.status(500).json({
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred while creating the recipe',
      },
    });
  }
}

module.exports = {
  listRecipes,
  getRecipeBySlug,
  createRecipe,
};
