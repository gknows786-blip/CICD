const request = require("supertest");
const app = require("./app");

describe("GET /", () => {
  it("returns a greeting", async () => {
    const res = await request(app).get("/");

    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Hello World");
  });
});

describe("GET /status", () => {
  it("reports healthy", async () => {
    const res = await request(app).get("/status");
    
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toMatch(/healthy/i);
  });
});

describe("GET /fib/:n", () => {
  it("calculates Fibonacci values with memoization", async () => {
    const res = await request(app).get("/fib/10");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ n: 10, value: 55 });
  });

  it("rejects invalid Fibonacci input", async () => {
    const res = await request(app).get("/fib/abc");

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/non-negative integer/i);
  });
});

describe("GET /balanced", () => {
  it("returns whether an expression is balanced", async () => {
    const res = await request(app).get("/balanced").query({ expr: "([{}])" });

    expect(res.statusCode).toBe(200);
    expect(res.body.balanced).toBe(true);
  });

  it("requires an expr query parameter", async () => {
    const res = await request(app).get("/balanced");

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/expr query parameter is required/i);
  });
});
