require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

require("./db");



const routes = require("./routes/urlRoutes");

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost"],
  credentials: true
}));

app.use(express.json());
app.use(morgan("dev"));

const shortenLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many requests. Please wait a moment.",
      retryAfter: 60
    });
  }
});

app.use("/api/shorten", shortenLimiter);

app.use("/", routes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
