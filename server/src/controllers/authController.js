/**                                                             
   * Authentication Controller                                                                                                               
   *                                                                                                                              
   * Handles user signup, login, logout, and profile retrieval                                                                               
   */                                                                                                                                        
                                                                                                                                             
  const crypto = require("crypto");
  const bcrypt = require("bcrypt");
  const pool = require("../config/database");
  const { generateToken } = require("../utils/jwt");
  const { sendPasswordResetEmail } = require("../utils/email");
                                                                                                                                             
  function getAuthCookieOptions() {
    const isProd = process.env.NODE_ENV === "production";                                                                                    
                                                                  
    return {
      httpOnly: true,
      secure: isProd,                                                                                                                        
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days                                                                                             
      path: "/",                                                                                                                             
    };
  }                                                                                                                                          
                                                                  
  /**
   * Sign up a new user
   * POST /api/v1/auth/signup
   */
  async function signup(req, res) {
    try {                                                                                                                                    
      const { email, username, password, display_name } = req.body;
                                                                                                                                             
      const existingUser = await pool.query(                                                                                                 
        "SELECT id, email, username FROM users WHERE email = $1 OR username = $2",
        [email, username]                                                                                                                    
      );                                                          

      if (existingUser.rows.length > 0) {                                                                                                    
        const conflict = existingUser.rows[0];
                                                                                                                                             
        if (conflict.email === email) {                                                                                                      
          return res.status(409).json({
            error: {                                                                                                                         
              code: "EMAIL_EXISTS",                               
              message: "Email is already in use",
            },                                                                                                                               
          });
        }                                                                                                                                    
                                                                  
        if (conflict.username === username) {
          return res.status(409).json({
            error: {
              code: "USERNAME_EXISTS",
              message: "Username is already in use",
            },
          });
        }                                                                                                                                    
   
        return res.status(409).json({                                                                                                        
          error: {                                                
            code: "USER_CONFLICT",
            message: "A user with these credentials already exists",
          },
        });                                                                                                                                  
      }
                                                                                                                                             
      const passwordHash = await bcrypt.hash(password, 10);       

      const result = await pool.query(
        `INSERT INTO users (email, username, password_hash, display_name)
         VALUES ($1, $2, $3, $4)                                                                                                             
         RETURNING id, email, username, display_name, role, created_at`,
        [email, username, passwordHash, display_name || null]                                                                                
      );                                                                                                                                     
   
      const user = result.rows[0];                                                                                                           
      const token = generateToken(user);                          

      res.cookie("authToken", token, getAuthCookieOptions());                                                                                
   
      res.status(201).json({                                                                                                                 
        user: {                                                   
          id: user.id,
          email: user.email,
          username: user.username,
          display_name: user.display_name,
          role: user.role,
          created_at: user.created_at,                                                                                                       
        },
      });                                                                                                                                    
    } catch (error) {                                             
      console.error("Signup error:", error);
      res.status(500).json({
        error: {
          code: "SERVER_ERROR",
          message: "An error occurred during signup",                                                                                        
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

      const result = await pool.query(
        "SELECT * FROM users WHERE email = $1 OR username = $1",
        [identifier]                                                                                                                         
      );
                                                                                                                                             
      if (result.rows.length === 0) {                                                                                                        
        return res.status(401).json({
          error: {                                                                                                                           
            code: "USER_NOT_FOUND",
            message: "No account found with that email or username.",
          },
        });
      }

      const user = result.rows[0];                                                                                                           
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
                                                                                                                                             
      if (!isPasswordValid) {                                     
        return res.status(401).json({
          error: {
            code: "INVALID_PASSWORD",
            message: "Incorrect password.",
          },
        });
      }                                                           

      const token = generateToken(user);

      res.cookie("authToken", token, getAuthCookieOptions());

      res.status(200).json({
        user: {
          id: user.id,                                                                                                                       
          email: user.email,
          username: user.username,                                                                                                           
          display_name: user.display_name,
          role: user.role,                        
          created_at: user.created_at,
        },
      });
    } catch (error) {
      console.error("Login error:", error);                                                                                                  
      res.status(500).json({
        error: {                                                                                                                             
          code: "SERVER_ERROR",                                   
          message: "An error occurred during login",
        },
      });
    }
  }

  /**
   * Log out current user
   * POST /api/v1/auth/logout                                                                                                                
   */
  function logout(req, res) {                                                                                                                
    res.clearCookie("authToken", getAuthCookieOptions());         
    res.status(204).send();                                                                                                                  
  }
                                                                                                                                             
  /**                                                             
   * Get current user profile
   * GET /api/v1/auth/me
   * Requires authentication
   */                                                                                                                                        
  async function getCurrentUser(req, res) {
    try {                                                                                                                                    
      const result = await pool.query(                            
        "SELECT id, email, username, display_name, role, created_at FROM users WHERE id = $1",
        [req.user.id]
      );                                                                                                                                     
   
      if (result.rows.length === 0) {                                                                                                        
        return res.status(404).json({                             
          error: {
            code: "USER_NOT_FOUND",
            message: "User not found",                                                                                                       
          },
        });                                                                                                                                  
      }                                                           

      res.status(200).json({
        user: result.rows[0],
      });
    } catch (error) {                                                                                                                        
      console.error("Get current user error:", error);
      res.status(500).json({                                                                                                                 
        error: {                                                  
          code: "SERVER_ERROR",
          message: "An error occurred while fetching user data",
        },                                                                                                                                   
      });
    }                                                                                                                                        
  }                                                               

  /**
   * Request a password reset email
   * POST /api/v1/auth/forgot-password
   */
  async function forgotPassword(req, res) {
    try {
      const { email } = req.body;

      const result = await pool.query(
        "SELECT id FROM users WHERE email = $1",
        [email]
      );

      // Always respond 200 so we don't reveal whether an email exists
      if (result.rows.length === 0) {
        return res.status(200).json({ message: "If that email exists, a reset link has been sent." });
      }

      const userId = result.rows[0].id;
      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await pool.query(
        `INSERT INTO password_reset_tokens (user_id, token, expires_at)
         VALUES ($1, $2, $3)`,
        [userId, token, expiresAt]
      );

      const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");
      const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

      await sendPasswordResetEmail(email, resetUrl);

      res.status(200).json({ message: "If that email exists, a reset link has been sent." });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({
        error: { code: "SERVER_ERROR", message: "An error occurred." },
      });
    }
  }

  /**
   * Reset password using a valid token
   * POST /api/v1/auth/reset-password
   */
  async function resetPassword(req, res) {
    try {
      const { token, password } = req.body;

      const result = await pool.query(
        `SELECT id, user_id, expires_at, used_at
         FROM password_reset_tokens
         WHERE token = $1`,
        [token]
      );

      if (result.rows.length === 0) {
        return res.status(400).json({
          error: { code: "INVALID_TOKEN", message: "Invalid or expired reset link." },
        });
      }

      const row = result.rows[0];

      if (row.used_at) {
        return res.status(400).json({
          error: { code: "TOKEN_USED", message: "This reset link has already been used." },
        });
      }

      if (new Date() > new Date(row.expires_at)) {
        return res.status(400).json({
          error: { code: "TOKEN_EXPIRED", message: "This reset link has expired. Please request a new one." },
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [
        passwordHash,
        row.user_id,
      ]);

      await pool.query(
        "UPDATE password_reset_tokens SET used_at = NOW() WHERE id = $1",
        [row.id]
      );

      res.status(200).json({ message: "Password updated successfully." });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({
        error: { code: "SERVER_ERROR", message: "An error occurred." },
      });
    }
  }

  module.exports = {
    signup,
    login,
    logout,
    getCurrentUser,
    forgotPassword,
    resetPassword,
  };