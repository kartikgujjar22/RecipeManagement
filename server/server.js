require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const authRouter = require("./routes/AuthRouter");
const recipe = require("./routes/RecipeRouter");
const { httpLogger, logger } = require("./middleware/logger");

const app = express();

// Middleware
app.use(express.json());

app.use(httpLogger);

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
);

// Connect to database
connectDB();

//auth routes
app.use("/api/auth/", authRouter);
app.use("/api/recipe/", recipe);

app.get("/", (req, res) => res.send("API is running"));

const PORT = process.env.BACKEND_PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
