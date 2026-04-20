const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const paymentMethodsData = require("./data/paymentMethods");
const authRoutes = require("./routes/auth");
const { isDbReady } = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    mongo: isDbReady() ? "connected" : "disconnected"
  });
});

app.get("/api/payment-methods", (req, res) => {
  res.json({ success: true, data: paymentMethodsData });
});

app.use("/api/auth", authRoutes);

/** Production: serve Vite build from repo root `client/dist` (single deploy: API + SPA same host). */
const clientDist = path.join(__dirname, "../../client/dist");
const hasClientDist = fs.existsSync(clientDist);

if (hasClientDist) {
  app.use(express.static(clientDist));
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api")) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    res.sendFile(path.join(clientDist, "index.html"));
  });
} else {
  console.warn(
    "[app] client/dist not found — UI will not load. Deploy must run `npm run build` (e.g. Render Build Command: npm install && npm run build)."
  );
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res
      .status(503)
      .type("text")
      .send(
        "Frontend build missing (no client/dist). Set your host Build Command to: npm install && npm run build — then redeploy."
      );
  });
}

module.exports = app;
