const pool = require('../config/database');

async function listUsers(req, res) {
    try {
        const result = await pool.query(
            'SELECT id, email, username, display_name, role, created_at FROM users ORDER BY created_at DESC'
        );
        res.json({ users: result.rows });
    } catch (err) {
        console.error('listUsers error:', err);
        res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Failed to fetch users' } });
    }
}

async function deleteUser(req, res) {
    const { userId } = req.params;
    try {
        await pool.query('DELETE FROM users WHERE id = $1', [userId]);
        res.status(200).json({ deleted: true });
    } catch (err) {
        console.error('deleteUser error:', err);
        res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Failed to delete user' } });
    }
}

async function adminDeleteRecipe(req, res) {
    const { slug } = req.params;
    try {
        const result = await pool.query('DELETE FROM recipes WHERE slug = $1 RETURNING slug',
            [slug]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Recipe not found' } });
        }
        res.status(200).json({ deleted: true });
    } catch (err) {
        console.error('adminDeleteRecipe error:', err);
        res.status(500).json({
            error: { code: 'SERVER_ERROR', message: 'Failed to delete recipe' }
        });
    }
}

module.exports = { listUsers, deleteUser, adminDeleteRecipe };
