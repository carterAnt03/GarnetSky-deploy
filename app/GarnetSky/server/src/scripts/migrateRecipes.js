/**
 * Simple migration/seed script for recipes.
 *
 * Creates the `recipes` table (if it does not exist) and inserts
 * a small set of demo recipes roughly matching the frontend data.
 */

const pool = require('../config/database');

const RECIPES = [
  {
    slug: 'spaghetti',
    title: 'Spaghetti',
    time: '30 Minutes',
    tags: ['Vegan', '4 ingredients', 'Easy'],
    description: 'A simple, comforting pasta with tomato sauce.',
    thumb:
      'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80',
    ingredients: [
      '8 oz spaghetti',
      '2 cups tomato sauce',
      '2 cloves garlic, minced',
      '2 tbsp olive oil',
    ],
    instructions: [
      'Cook spaghetti according to package directions; drain.',
      'Sauté garlic in olive oil, then add tomato sauce and simmer for 5–10 minutes.',
      'Toss pasta with sauce and serve.',
    ],
  },
  {
    slug: 'carbonara',
    title: 'Spaghetti Carbonara',
    time: '25 Minutes',
    tags: ['Pork', 'Creamy', 'Italian'],
    description: 'Classic carbonara with eggs, Parmesan, and crispy pancetta.',
    thumb:
      'https://images.unsplash.com/photo-1603133872878-684f208fb84a?auto=format&fit=crop&w=800&q=80',
    ingredients: [
      '8 oz spaghetti',
      '2 eggs',
      '1/2 cup grated Parmesan',
      '4 oz pancetta or bacon',
      'Salt & pepper',
    ],
    instructions: [
      'Cook pasta until al dente, reserving 1/2 cup of the pasta water.',
      'Crisp pancetta in a pan and set aside.',
      'Whisk eggs and Parmesan together in a bowl.',
      'Toss hot pasta with pancetta, then quickly stir in egg mixture, using pasta water as needed to create a silky sauce.',
    ],
  },
  {
    slug: 'curry',
    title: 'Weeknight Chickpea Curry',
    time: '35 Minutes',
    tags: ['Vegetarian', 'Gluten-free', 'Spicy'],
    description: 'A cozy coconut chickpea curry for busy nights.',
    thumb:
      'https://images.unsplash.com/photo-1604908176997-1251884b08a3?auto=format&fit=crop&w=800&q=80',
    ingredients: [
      '1 tbsp oil',
      '1 onion, diced',
      '2 tbsp curry paste',
      '1 can chickpeas, drained',
      '1 can coconut milk',
      'Salt to taste',
    ],
    instructions: [
      'Sauté onion in oil until soft.',
      'Stir in curry paste and cook for 1 minute.',
      'Add chickpeas and coconut milk, then simmer for 15 minutes.',
      'Serve over rice with your favorite toppings.',
    ],
  },
  {
    slug: 'caesar',
    title: 'Simple Caesar Salad',
    time: '15 Minutes',
    tags: ['Salad', 'Quick'],
    description: 'Crisp romaine with creamy Caesar dressing.',
    thumb:
      'https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Romaine lettuce', 'Croutons', 'Parmesan cheese', 'Caesar dressing'],
    instructions: [
      'Wash and chop romaine.',
      'Toss with Caesar dressing until lightly coated.',
      'Top with croutons and shaved Parmesan, then serve immediately.',
    ],
  },
  {
    slug: 'choc-chip',
    title: 'Chocolate Chip Cookies',
    time: '30 Minutes',
    tags: ['Dessert'],
    description: 'Soft and chewy cookies loaded with warm chocolate chips.',
    thumb:
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    ingredients: [
      '2 1/4 cups flour',
      '1 cup butter, softened',
      '3/4 cup sugar',
      '3/4 cup brown sugar',
      '1 egg + 1 egg yolk',
      '1 1/2 cups chocolate chips',
    ],
    instructions: [
      'Cream butter and sugars together until light and fluffy.',
      'Beat in egg and egg yolk, then mix in dry ingredients until just combined.',
      'Fold in chocolate chips.',
      'Scoop onto baking sheet and bake at 350°F for 10–12 minutes.',
    ],
  },
];

async function migrate() {
  console.log('Running recipes migration...');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS recipes (
      id SERIAL PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      time TEXT,
      tags TEXT[],
      thumb TEXT,
      ingredients TEXT[],
      instructions TEXT[]
    );
  `);

  for (const r of RECIPES) {
    await pool.query(
      `INSERT INTO recipes (slug, title, description, time, tags, thumb, ingredients, instructions)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (slug) DO UPDATE SET
         title = EXCLUDED.title,
         description = EXCLUDED.description,
         time = EXCLUDED.time,
         tags = EXCLUDED.tags,
         thumb = EXCLUDED.thumb,
         ingredients = EXCLUDED.ingredients,
         instructions = EXCLUDED.instructions;`,
      [
        r.slug,
        r.title,
        r.description,
        r.time,
        r.tags,
        r.thumb,
        r.ingredients,
        r.instructions,
      ]
    );
  }

  console.log('✅ Recipes migration complete.');
}

migrate()
  .catch((err) => {
    console.error('❌ Recipes migration failed:', err);
  })
  .finally(() => {
    pool.end();
  });
