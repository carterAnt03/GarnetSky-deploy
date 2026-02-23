import { createRequire } from "module";
const require = createRequire(import.meta.url);

const request = require("supertest");
const { createApp } = require("../../server/src/app");

describe("API behavior", () => {
  const app = createApp();

  test("GET /api/v1/health returns ok", async () => {
    const res = await request(app).get("/api/v1/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  test("POST /api/v1/auth/signup rejects invalid email with 400", async () => {
    const res = await request(app).post("/api/v1/auth/signup").send({
      email: "bad-email",
      username: "aidanm",
      password: "StrongPass123!",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toHaveProperty("code", "VALIDATION_ERROR");
  });
});
