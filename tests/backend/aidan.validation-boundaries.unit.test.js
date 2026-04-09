import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
  signupSchema,
  createRecipeSchema,
  searchRecipesSchema,
} = require('../../server/src/utils/validation');

const firstErrorMessage = (result) => {
  const list = result?.error?.issues || result?.error?.errors || [];
  return list[0]?.message;
};

describe('Aidan unit tests - validation boundaries', () => {
  test('accepts a signup username at the 32 character maximum', () => {
    const result = signupSchema.safeParse({
      email: 'aidan@example.com',
      username: 'a'.repeat(32),
      password: 'StrongPass123',
    });
    expect(result.success).toBe(true);
  });

  test('rejects a signup username longer than 32 characters', () => {
    const result = signupSchema.safeParse({
      email: 'aidan@example.com',
      username: 'b'.repeat(33),
      password: 'StrongPass123',
    });
    expect(result.success).toBe(false);
    expect(firstErrorMessage(result)).toBe('Username must be at most 32 characters');
  });

  test('rejects recipe ingredients with an empty ingredient name', () => {
    const result = createRecipeSchema.safeParse({
      title: 'Broken Recipe',
      ingredients: [{ name: '' }],
      steps: [{ step_order: 1, text: 'Mix everything together.' }],
    });
    expect(result.success).toBe(false);
    expect(firstErrorMessage(result)).toBe('Ingredient name is required');
  });

  test('rejects recipe steps when step_order is zero', () => {
    const result = createRecipeSchema.safeParse({
      title: 'Boundary Step Order',
      ingredients: [{ name: 'Flour' }],
      steps: [{ step_order: 0, text: 'This should fail.' }],
    });
    expect(result.success).toBe(false);
    expect(firstErrorMessage(result)).toBe('Too small: expected number to be >0');
  });

  test('converts numeric search query params into numbers', () => {
    const result = searchRecipesSchema.safeParse({
      q: 'pasta',
      max_time: '25',
      page_size: '10',
    });
    expect(result.success).toBe(true);
    expect(result.data.max_time).toBe(25);
    expect(result.data.page_size).toBe(10);
  });
});
