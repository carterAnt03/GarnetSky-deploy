/**
 * Authentication Middleware
 * 
 * This middleware checks if a user is authenticated by verifying their JWT token.
 * Use this to protect routes that require a logged-in user.
 */

const { verifyToken } = require('../utils/jwt');

/**
 * Middleware to require authentication
 * Checks for JWT token in cookies and verifies it
 */
function requireAuth(req, res, next) {
  try {
    // Get token from cookie
    const token = req.cookies.authToken;

    if (!token) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required. Please log in.',
        },
      });
    }

    // Verify and decode the token
    const decoded = verifyToken(token);

    // Add user info to request object so other functions can use it
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      username: decoded.username,
    };

    // Continue to the next middleware/route handler
    next();
  } catch (error) {
    return res.status(401).json({
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid or expired token. Please log in again.',
      },
    });
  }
}

/**
 * Optional authentication middleware
 * Adds user info if token exists, but doesn't require it
 */
function optionalAuth(req, res, next) {
  try {
    const token = req.cookies.authToken;

    if (token) {
      const decoded = verifyToken(token);
      req.user = {
        id: decoded.userId,
        email: decoded.email,
      };
    }
  } catch (error) {
    // Token invalid, but that's okay for optional auth
    // Just continue without user info
  }

  next();
}

module.exports = {
  requireAuth,
  optionalAuth,
};
