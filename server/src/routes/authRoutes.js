const express = require('express');

const { signup, login, logout, getCurrentUser, forgotPassword, resetPassword } = require('../controllers/authController');
const { signupSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, validate } = require('../utils/validation');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// POST /api/v1/auth/signup
router.post('/signup', validate(signupSchema), signup);

// POST /api/v1/auth/login
router.post('/login', validate(loginSchema), login);

// POST /api/v1/auth/logout
router.post('/logout', logout);

// GET /api/v1/auth/me - current user profile
router.get('/me', requireAuth, getCurrentUser);

// POST /api/v1/auth/forgot-password
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);

// POST /api/v1/auth/reset-password
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);

module.exports = router;
