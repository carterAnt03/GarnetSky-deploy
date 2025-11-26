/**
 * Authentication Controller
 * 
 * Handles user signup, login, logout, and profile retrieval
 */

const bcrypt = require('bcrypt');
const pool = require('../config/database');
const { generateToken } = require('../utils/jwt');

/**
 * Sign up a new user
 * POST /api/v1/auth/signup
 */
async function signup(req, res) {
  try {
    const { email, username, password, display_name } = req.body;

    // Check if email or username already exists
    const existingUser = await pool.query(
      'SELECT id, email, username FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      const conflict = existingUser.rows[0];
      // Prefer a slightly more specific error code/message when possible
      if (conflict.email === email) {
        return res.status(409).json({
          error: {
            code: 'EMAIL_EXISTS',
            message: 'Email is already in use',
          },
        });
      }

      if (conflict.username === username) {
        return res.status(409).json({
          error: {
            code: 'USERNAME_EXISTS',
            message: 'Username is already in use',
          },
        });
      }

      // Fallback if we somehow got here
      return res.status(409).json({
        error: {
          code: 'USER_CONFLICT',
          message: 'A user with these credentials already exists',
        },
      });
    }

    // Hash the password with bcrypt (10 salt rounds)
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert the new user into database
    const result = await pool.query(
      `INSERT INTO users (email, username, password_hash, display_name)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, username, display_name, created_at`,
      [email, username, passwordHash, display_name || null]
    );

    const user = result.rows[0];

    // Generate JWT token
    const token = generateToken(user);

    // Set token as HTTP-only cookie
    res.cookie('authToken', token, {
      httpOnly: true, // Cannot be accessed by JavaScript
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'lax', // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return user data (without password hash)
    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        display_name: user.display_name,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred during signup',
      },
    });
  }
}

/**
 * Log in an existing user
 * POST /api/v1/auth/login
 */
async function login(req, res) {
  try {
    const { identifier, password } = req.body;

    // Find user by email OR username
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR username = $1',
      [identifier]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
      });
    }

    const user = result.rows[0];

    // Compare password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Set token as HTTP-only cookie
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return user data
    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        display_name: user.display_name,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred during login',
      },
    });
  }
}

/**
 * Log out current user
 * POST /api/v1/auth/logout
 */
function logout(req, res) {
  // Clear the auth cookie
  res.clearCookie('authToken');
  res.status(204).send();
}

/**
 * Get current user profile
 * GET /api/v1/users/me
 * Requires authentication
 */
async function getCurrentUser(req, res) {
  try {
    // req.user is set by the requireAuth middleware
    const result = await pool.query(
      'SELECT id, email, username, display_name, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
        },
      });
    }

    res.status(200).json({
      user: result.rows[0],
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred while fetching user data',
      },
    });
  }
}

module.exports = {
  signup,
  login,
  logout,
  getCurrentUser,
};
