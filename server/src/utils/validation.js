/**
 * Request Validation Schemas
 * 
 * Using Zod to validate incoming request data
 * This ensures data is in the correct format before processing
 */

const { z } = require('zod');

// User/Auth schemas
const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(32, 'Username must be at most 32 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  // Optional friendly display name; can mirror username if the client prefers
  display_name: z.string().optional(),
});

const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
});

// Recipe schemas
const ingredientSchema = z.object({
  name: z.string().min(1, 'Ingredient name is required'),
  qty: z.number().positive().optional(),
  unit: z.string().optional(),
});

const stepSchema = z.object({
  step_order: z.number().int().positive(),
  text: z.string().min(1, 'Step text is required'),
});

const createRecipeSchema = z.object({
  title: z.string().min(1, 'Recipe title is required').max(200),
  description: z.string().max(1000).optional(),
  time_minutes: z.number().int().positive().optional(),
  servings: z.number().int().positive().optional(),
  tags: z.array(z.string()).optional(),
  ingredients: z.array(ingredientSchema).min(1, 'At least one ingredient is required'),
  steps: z.array(stepSchema).min(1, 'At least one step is required'),
  image_url: z.string().url().optional(),
});

const updateRecipeSchema = createRecipeSchema.partial();

// Search schemas
const searchRecipesSchema = z.object({
  q: z.string().optional(),
  ingredient: z.string().optional(),
  tags: z.string().optional(), // comma-separated
  max_time: z.string().regex(/^\d+$/).transform(Number).optional(),
  page_size: z.string().regex(/^\d+$/).transform(Number).optional(),
});

/**
 * Middleware to validate request body against a schema
 */
function validate(schema) {
  return (req, res, next) => {
    try {
      // Validate and parse the request body
      const validated = schema.parse(req.body);
      // Replace req.body with validated data
      req.body = validated;
      next();
    } catch (error) {
      // If validation fails, return a 400 error
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request data',
            details: (error.issues || error.errors || []).map((err) => ({
              field: err.path.join('.'),
              message: err.message,
            })),
          },
        });
      }
      next(error);
    }
  };
}

/**
 * Validate query parameters
 */
function validateQuery(schema) {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.query);
      req.query = validated;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid query parameters',
            details: (error.issues || error.errors || []).map((err) => ({
              field: err.path.join('.'),
              message: err.message,
            })),
          },
        });
      }
      next(error);
    }
  };
}

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

module.exports = {
  // Schemas
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  createRecipeSchema,
  updateRecipeSchema,
  searchRecipesSchema,
  
  // Middleware
  validate,
  validateQuery,
};
