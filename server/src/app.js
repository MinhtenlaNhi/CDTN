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

module.exports = app;
