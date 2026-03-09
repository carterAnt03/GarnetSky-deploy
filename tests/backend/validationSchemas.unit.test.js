import { createRequire } from "module";
const require = createRequire(import.meta.url);

const { signupSchema, loginSchema, createRecipeSchema } = require(
  "../../server/src/utils/validation"
);

// ─── helpers ────────────────────────────────────────────────────────────────

const firstMessage = (result) => {
  const list = result?.error?.issues || result?.error?.errors || [];
  return list[0]?.message;
};

// ─── signupSchema ────────────────────────────────────────────────────────────

describe("signupSchema", () => {
  const valid = {
    email: "aidan@example.com",
    username: "aidanm",
    password: "StrongPass123!",
  };

  test("accepts valid payload", () => {
    const result = signupSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  test("accepts valid payload with optional display_name", () => {
    const result = signupSchema.safeParse({ ...valid, display_name: "Aidan M" });
    expect(result.success).toBe(true);
  });

  // email
  test("rejects invalid email format", () => {
    const result = signupSchema.safeParse({ ...valid, email: "not-an-email" });
    expect(result.success).toBe(false);
    expect(firstMessage(result)).toBe("Invalid email format");
  });

  test("rejects missing email", () => {
    const { email, ...rest } = valid;
    const result = signupSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  // username length boundaries
  test("accepts username of exactly 3 characters (lower boundary)", () => {
    const result = signupSchema.safeParse({ ...valid, username: "abc" });
    expect(result.success).toBe(true);
  });

  test("rejects username of 2 characters (below lower boundary)", () => {
    const result = signupSchema.safeParse({ ...valid, username: "ab" });
    expect(result.success).toBe(false);
    expect(firstMessage(result)).toBe("Username must be at least 3 characters");
  });

  test("accepts username of exactly 32 characters (upper boundary)", () => {
    const result = signupSchema.safeParse({ ...valid, username: "a".repeat(32) });
    expect(result.success).toBe(true);
  });

  test("rejects username of 33 characters (above upper boundary)", () => {
    const result = signupSchema.safeParse({ ...valid, username: "a".repeat(33) });
    expect(result.success).toBe(false);
    expect(firstMessage(result)).toBe("Username must be at most 32 characters");
  });

  // password length boundary
  test("accepts password of exactly 6 characters (lower boundary)", () => {
    const result = signupSchema.safeParse({ ...valid, password: "abc123" });
    expect(result.success).toBe(true);
  });

  test("rejects password of 5 characters (below lower boundary)", () => {
    const result = signupSchema.safeParse({ ...valid, password: "ab123" });
    expect(result.success).toBe(false);
    expect(firstMessage(result)).toBe("Password must be at least 6 characters");
  });

  test("rejects missing password", () => {
    const { password, ...rest } = valid;
    const result = signupSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });
});

// ─── loginSchema ─────────────────────────────────────────────────────────────

describe("loginSchema", () => {
  const valid = { identifier: "aidanm", password: "StrongPass123!" };

  test("accepts username as identifier", () => {
    expect(loginSchema.safeParse(valid).success).toBe(true);
  });

  test("accepts email as identifier", () => {
    const result = loginSchema.safeParse({ ...valid, identifier: "aidan@example.com" });
    expect(result.success).toBe(true);
  });

  test("rejects empty identifier", () => {
    const result = loginSchema.safeParse({ ...valid, identifier: "" });
    expect(result.success).toBe(false);
    expect(firstMessage(result)).toBe("Email or username is required");
  });

  test("rejects empty password", () => {
    const result = loginSchema.safeParse({ ...valid, password: "" });
    expect(result.success).toBe(false);
    expect(firstMessage(result)).toBe("Password is required");
  });

  test("rejects missing identifier field entirely", () => {
    const result = loginSchema.safeParse({ password: "abc123" });
    expect(result.success).toBe(false);
  });

  test("rejects missing password field entirely", () => {
    const result = loginSchema.safeParse({ identifier: "aidanm" });
    expect(result.success).toBe(false);
  });
});

// ─── createRecipeSchema ───────────────────────────────────────────────────────

describe("createRecipeSchema", () => {
  const valid = {
    title: "PB&J",
    description: "Classic sandwich",
    ingredients: [{ name: "bread" }, { name: "peanut butter" }, { name: "jelly" }],
    steps: [
      { step_order: 1, text: "Spread peanut butter." },
      { step_order: 2, text: "Add jelly and assemble." },
    ],
  };

  test("accepts valid recipe", () => {
    expect(createRecipeSchema.safeParse(valid).success).toBe(true);
  });

  test("accepts recipe with all optional fields populated", () => {
    const full = {
      ...valid,
      time_minutes: 5,
      servings: 1,
      tags: ["lunch", "easy"],
      image_url: "https://example.com/pbj.jpg",
    };
    expect(createRecipeSchema.safeParse(full).success).toBe(true);
  });

  test("accepts recipe with empty tags array", () => {
    const result = createRecipeSchema.safeParse({ ...valid, tags: [] });
    expect(result.success).toBe(true);
  });

  // title boundaries
  test("rejects empty title", () => {
    const result = createRecipeSchema.safeParse({ ...valid, title: "" });
    expect(result.success).toBe(false);
  });

  test("rejects title over 200 characters", () => {
    const result = createRecipeSchema.safeParse({ ...valid, title: "a".repeat(201) });
    expect(result.success).toBe(false);
  });

  test("accepts title of exactly 200 characters (upper boundary)", () => {
    const result = createRecipeSchema.safeParse({ ...valid, title: "a".repeat(200) });
    expect(result.success).toBe(true);
  });

  // ingredients
  test("rejects empty ingredients array", () => {
    const result = createRecipeSchema.safeParse({ ...valid, ingredients: [] });
    expect(result.success).toBe(false);
    expect(firstMessage(result)).toBe("At least one ingredient is required");
  });

  test("rejects ingredient with empty name", () => {
    const result = createRecipeSchema.safeParse({
      ...valid,
      ingredients: [{ name: "" }],
    });
    expect(result.success).toBe(false);
  });

  test("accepts ingredient with optional qty and unit", () => {
    const result = createRecipeSchema.safeParse({
      ...valid,
      ingredients: [{ name: "flour", qty: 2, unit: "cups" }],
    });
    expect(result.success).toBe(true);
  });

  // steps
  test("rejects empty steps array", () => {
    const result = createRecipeSchema.safeParse({ ...valid, steps: [] });
    expect(result.success).toBe(false);
    expect(firstMessage(result)).toBe("At least one step is required");
  });

  test("rejects step with empty text", () => {
    const result = createRecipeSchema.safeParse({
      ...valid,
      steps: [{ step_order: 1, text: "" }],
    });
    expect(result.success).toBe(false);
  });

  // optional numeric fields
  test("rejects negative time_minutes", () => {
    const result = createRecipeSchema.safeParse({ ...valid, time_minutes: -1 });
    expect(result.success).toBe(false);
  });

  test("rejects negative servings", () => {
    const result = createRecipeSchema.safeParse({ ...valid, servings: 0 });
    expect(result.success).toBe(false);
  });

  test("rejects malformed image_url", () => {
    const result = createRecipeSchema.safeParse({ ...valid, image_url: "not-a-url" });
    expect(result.success).toBe(false);
  });
});
