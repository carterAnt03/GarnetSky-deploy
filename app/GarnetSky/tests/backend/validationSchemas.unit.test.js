import { createRequire } from "module";
const require = createRequire(import.meta.url);

const { signupSchema, loginSchema, createRecipeSchema } = require(
  "../../server/src/utils/validation"
);

describe("Validation schemas (unit)", () => {
  test("signupSchema accepts valid payload", () => {
    const ok = signupSchema.parse({
      email: "aidan@example.com",
      username: "aidanm",
      password: "StrongPass123!",
    });
    expect(ok.email).toBe("aidan@example.com");
  });

  test("signupSchema rejects invalid email (boundary)", () => {
    expect(() =>
      signupSchema.parse({
        email: "not-an-email",
        username: "aidanm",
        password: "StrongPass123!",
      })
    ).toThrow();
  });

  test("loginSchema rejects missing password", () => {
    expect(() =>
      loginSchema.parse({
        email: "aidan@example.com",
      })
    ).toThrow();
  });

  test("createRecipeSchema accepts empty tags array (boundary)", () => {
    const ok = createRecipeSchema.parse({
      title: "PB&J",
      description: "Classic",
      ingredients: [{ name: "bread" }, { name: "peanut butter" }, { name: "jelly" }],
      steps: [
        { step_order: 1, text: "Spread peanut butter." },
        { step_order: 2, text: "Add jelly." },
        { step_order: 3, text: "Assemble sandwich." },
      ],
      tags: [],
    });

    expect(ok.tags).toEqual([]);
  });
});