const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

function fibMemo(n, memo = {}) {
  if (!Number.isInteger(n) || n < 0) {
    throw new Error("n must be a non-negative integer");
  }

  if (n < 2) return n;
  if (memo[n] !== undefined) return memo[n];

  memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  return memo[n];
}

function isBalanced(expr) {
  if (typeof expr !== "string") return false;

  const stack = [];
  const pairs = {
    ")": "(",
    "]": "[",
    "}": "{",
  };

  for (const char of expr) {
    if ("([{".includes(char)) {
      stack.push(char);
      continue;
    }

    if ("})]".includes(char)) {
      const opening = stack.pop();
      if (opening !== pairs[char]) return false;
    }
  }

  return stack.length === 0;
}

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/status", (req, res) => {
  res.json({
    status: "Server is healthy ✅",
    uptime: process.uptime(),
  });
});

app.get("/fib/:n", (req, res) => {
  const rawValue = Number(req.params.n);

  if (!Number.isInteger(rawValue) || rawValue < 0) {
    return res.status(400).json({ error: "n must be a non-negative integer" });
  }

  const value = fibMemo(rawValue);
  return res.json({ n: rawValue, value });
});

app.get("/balanced", (req, res) => {
  const expr = req.query.expr;

  if (typeof expr !== "string" || expr.length === 0) {
    return res.status(400).json({ error: "expr query parameter is required" });
  }

  return res.json({
    expr,
    balanced: isBalanced(expr),
  });
});

module.exports = app;
