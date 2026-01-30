/**
 * Validation Schema Unit Tests
 *
 * Tests the Zod validation schemas used for request validation
 */

const {
  signupSchema,
  loginSchema,
  createRecipeSchema,
} = require('../../server/src/utils/validation');

describe('Signup Schema Validation', () => {
  it('accepts valid signup data', () => {
    const validData = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
    };

    const result = signupSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('accepts signup data with optional display_name', () => {
    const validData = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      display_name: 'Test User',
    };

    const result = signupSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('rejects invalid email format', () => {
    const invalidData = {
      email: 'not-an-email',
      username: 'testuser',
      password: 'password123',
    };

    const result = signupSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    expect(result.error.errors[0].message).toBe('Invalid email format');
  });

  it('rejects username shorter than 3 characters', () => {
    const invalidData = {
      email: 'test@example.com',
      username: 'ab',
      password: 'password123',
    };

    const result = signupSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    expect(result.error.errors[0].message).toBe('Username must be at least 3 characters');
  });

  it('rejects password shorter than 6 characters', () => {
    const invalidData = {
      email: 'test@example.com',
      username: 'testuser',
      password: '12345',
    };

    const result = signupSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    expect(result.error.errors[0].message).toBe('Password must be at least 6 characters');
  });
});

describe('Login Schema Validation', () => {
  it('accepts valid login data', () => {
    const validData = {
      identifier: 'testuser',
      password: 'password123',
    };

    const result = loginSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('accepts email as identifier', () => {
    const validData = {
      identifier: 'test@example.com',
      password: 'password123',
    };

    const result = loginSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('rejects empty identifier', () => {
    const invalidData = {
      identifier: '',
      password: 'password123',
    };

    const result = loginSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    expect(result.error.errors[0].message).toBe('Email or username is required');
  });

  it('rejects empty password', () => {
    const invalidData = {
      identifier: 'testuser',
      password: '',
    };

    const result = loginSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    expect(result.error.errors[0].message).toBe('Password is required');
  });
});

describe('Create Recipe Schema Validation', () => {
  const validRecipe = {
    title: 'Test Recipe',
    description: 'A delicious test recipe',
    time_minutes: 30,
    servings: 4,
    ingredients: [
      { name: 'Flour', qty: 2, unit: 'cups' },
      { name: 'Sugar', qty: 1, unit: 'cup' },
    ],
    steps: [
      { step_order: 1, text: 'Mix the dry ingredients' },
      { step_order: 2, text: 'Add wet ingredients and stir' },
    ],
  };

  it('accepts valid recipe data', () => {
    const result = createRecipeSchema.safeParse(validRecipe);
    expect(result.success).toBe(true);
  });

  it('accepts recipe with optional fields omitted', () => {
    const minimalRecipe = {
      title: 'Simple Recipe',
      ingredients: [{ name: 'Ingredient 1' }],
      steps: [{ step_order: 1, text: 'Do the thing' }],
    };

    const result = createRecipeSchema.safeParse(minimalRecipe);
    expect(result.success).toBe(true);
  });

  it('rejects recipe without title', () => {
    const invalidRecipe = {
      ...validRecipe,
      title: '',
    };

    const result = createRecipeSchema.safeParse(invalidRecipe);
    expect(result.success).toBe(false);
  });

  it('rejects recipe without ingredients', () => {
    const invalidRecipe = {
      ...validRecipe,
      ingredients: [],
    };

    const result = createRecipeSchema.safeParse(invalidRecipe);
    expect(result.success).toBe(false);
    expect(result.error.errors[0].message).toBe('At least one ingredient is required');
  });

  it('rejects recipe without steps', () => {
    const invalidRecipe = {
      ...validRecipe,
      steps: [],
    };

    const result = createRecipeSchema.safeParse(invalidRecipe);
    expect(result.success).toBe(false);
    expect(result.error.errors[0].message).toBe('At least one step is required');
  });

  it('accepts recipe with optional tags array', () => {
    const recipeWithTags = {
      ...validRecipe,
      tags: ['dessert', 'easy', 'quick'],
    };

    const result = createRecipeSchema.safeParse(recipeWithTags);
    expect(result.success).toBe(true);
  });
});
