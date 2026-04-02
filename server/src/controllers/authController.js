/**                                                             
   * Authentication Controller                                                                                                               
   *                                                                                                                              
   * Handles user signup, login, logout, and profile retrieval                                                                               
   */                                                                                                                                        
                                                                                                                                             
  const bcrypt = require("bcrypt");                                                                                                          
  const pool = require("../config/database");                     
  const { generateToken } = require("../utils/jwt");
                                                                                                                                             
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

  module.exports = {
    signup,
    login,
    logout,
    getCurrentUser,
  };