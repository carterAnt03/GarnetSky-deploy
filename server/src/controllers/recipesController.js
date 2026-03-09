const pool = require('../config/database');

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

    let query = 'SELECT slug, title, description, time, tags, thumb FROM recipes';

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY id ASC';

    const result = await pool.query(query, values);

    const recipes = result.rows.map(row => ({
      id: row.slug,
      title: row.title,
      desc: row.description,
      time: row.time,
      tags: row.tags || [],
      thumb: row.thumb
    }));

    res.json({ recipes });
  } catch (err) {
    console.error('listRecipes error:', err);
    res.status(500).json({
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred while fetching recipes'
      }
    });
  }
}

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
          message: 'Recipe not found'
        }
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
      instructions: row.instructions || []
    };

    res.json({ recipe });
  } catch (err) {
    console.error('getRecipeBySlug error:', err);
    res.status(500).json({
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred while fetching the recipe'
      }
    });
  }
}

async function createRecipe(req, res) {
  try {
    const {
      title,
      desc,
      time,
      tags,
      imageUrl,
      ingredientsText,
      instructionsText
    } = req.body;

    // Always use the authenticated user's ID from the JWT — never trust the client
    const authorId = req.user.id;

    if (!title || !desc) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'title and desc are required'
        }
      });
    }

    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const slug = `${baseSlug}-${Date.now().toString(36)}`;
    const tagArray = tags
      ? tags.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    const ingredients = ingredientsText
      ? ingredientsText.split('\n').map(s => s.trim()).filter(Boolean)
      : [];

    const instructions = instructionsText
      ? instructionsText.split('\n').map(s => s.trim()).filter(Boolean)
      : [];

    const result = await pool.query(
      `
      INSERT INTO recipes (
        author_id, title, description, time, tags,
        thumb, slug, ingredients, instructions
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING slug, title, description, time, tags, thumb
    `,
      [
        authorId,
        title,
        desc,
        time || null,
        tagArray,
        imageUrl || null,
        slug,
        ingredients,
        instructions
      ]
    );

    const row = result.rows[0];

    const recipe = {
      id: row.slug,
      title: row.title,
      desc: row.description,
      time: row.time,
      tags: row.tags || [],
      thumb: row.thumb
    };

    res.status(201).json({ recipe });
  } catch (err) {
    console.error('createRecipe error:', err);
    res.status(500).json({
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred while creating the recipe'
      }
    });
  }
}

module.exports = {
  listRecipes,
  getRecipeBySlug,
  createRecipe
};
