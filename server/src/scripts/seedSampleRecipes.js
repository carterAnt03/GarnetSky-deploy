const pool = require('../config/database');
const { SAMPLE_RECIPES } = require('../data/sampleRecipes');
function slugify(title) { return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }
function parseArg(flag) { const index = process.argv.indexOf(flag); return index >= 0 ? process.argv[index + 1] : undefined; }
async function getAuthorId() {
  const authorEmail = parseArg('--author-email') || process.env.SEED_AUTHOR_EMAIL;
  if (!authorEmail) throw new Error('Provide --author-email your-email@example.com or set SEED_AUTHOR_EMAIL.');
  const result = await pool.query('SELECT id, email FROM users WHERE email = $1 LIMIT 1', [authorEmail]);
  if (!result.rows.length) throw new Error(`No user found for ${authorEmail}. Create that user first, then rerun the seed script.`);
  return result.rows[0].id;
}
async function main() {
  const authorId = await getAuthorId();
  let inserted = 0;
  let skipped = 0;
  for (const recipe of SAMPLE_RECIPES) {
    const slug = slugify(recipe.title);
    const existing = await pool.query('SELECT id FROM recipes WHERE author_id = $1 AND slug = $2 LIMIT 1', [authorId, slug]);
    if (existing.rows.length) { skipped += 1; continue; }
    await pool.query(`INSERT INTO recipes (author_id, title, description, time, tags, thumb, slug, ingredients, instructions) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`, [authorId, recipe.title, recipe.desc, recipe.time, recipe.tags, recipe.imageUrl, slug, recipe.ingredientsText.split('\n').map((line) => line.trim()).filter(Boolean), recipe.instructionsText.split('\n').map((line) => line.trim()).filter(Boolean)]);
    inserted += 1;
  }
  console.log(`Inserted ${inserted} sample recipes.`);
  console.log(`Skipped ${skipped} recipes that already existed for this author.`);
}
main().catch((error) => { console.error('Sample recipe seeding failed:', error.message); process.exitCode = 1; }).finally(async () => { await pool.end(); });
