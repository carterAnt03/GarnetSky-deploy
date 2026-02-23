/**
 * Validation Schema Unit Tests
 *
 * Tests the Zod validation schemas used for request validation
 */

import { createRequire } from "module";
const require = createRequire(import.meta.url);

const { signupSchema, loginSchema, createRecipeSchema } = require(
  "../../server/src/utils/validation"
);

describe("Signup Schema Validation", () => {
  it("accepts valid signup data", () => {
    const validData = {
      email: "test@example.com",
      username: "testuser",
      password: "password123",
    };

    const result = signupSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("accepts signup data with optional display_name", () => {
    const validData = {
      email: "test@example.com",
      username: "testuser",
      password: "password123",
      display_name: "Test User",
    };

    const result = signupSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("rejects invalid email format", () => {
    const invalidData = {
      email: "not-an-email",
      username: "testuser",
      password: "password123",
    };

    const result = signupSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe("Login Schema Validation", () => {
  it("accepts valid login data", () => {
    const validData = {
      identifier: "testuser",
      password: "password123",
    };

    const result = loginSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("rejects empty identifier", () => {
    const invalidData = {
      identifier: "",
      password: "password123",
    };

    const result = loginSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe("Create Recipe Schema Validation", () => {
  it("accepts minimal recipe data", () => {
    const minimalRecipe = {
      title: "Simple Recipe",
      ingredients: [{ name: "Ingredient 1" }],
      steps: [{ step_order: 1, text: "Do the thing" }],
    };

    const result = createRecipeSchema.safeParse(minimalRecipe);
    expect(result.success).toBe(true);
  });
});
