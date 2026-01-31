const {
  signupSchema,
  loginSchema,
  createRecipeSchema,
} = require('../../server/src/utils/validation');

describe('Validation schemas (unit)', () => {
  test('signupSchema accepts valid payload', () => {
    const ok = signupSchema.parse({
      email: 'aidan@example.com',
      username: 'aidanm',
      password: 'StrongPass123!',
    });
    expect(ok.email).toBe('aidan@example.com');
  });

  test('signupSchema rejects invalid email (boundary)', () => {
    expect(() =>
      signupSchema.parse({
        email: 'not-an-email',
        username: 'aidanm',
        password: 'StrongPass123!',
      })
    ).toThrow();
  });

  test('loginSchema rejects missing password', () => {
    expect(() =>
      loginSchema.parse({
        email: 'aidan@example.com',
      })
    ).toThrow();
  });

  test('createRecipeSchema accepts empty tags array (boundary)', () => {
    const ok = createRecipeSchema.parse({
      title: 'PB&J',
      description: 'Classic',
      ingredients: ['bread', 'peanut butter', 'jelly'],
      instructions: ['spread', 'assemble'],
      tags: [],
    });
    expect(ok.tags).toEqual([]);
  });
});
