require("dotenv").config();
const express = require("express");
const connectDB = require("./src/config/db");
const path = require("node:path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("./src/config/passport");

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(express.json()); // For API body parsing
app.use(express.urlencoded({ extended: true })); // For form data
app.use(cookieParser());

// Session middleware (required by Passport strategies using sessions)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "change-me",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true },
  }),
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Set EJS
app.set("view engine", "ejs");
// Point to src/views where our EJS templates live
app.set("views", path.join(__dirname, "src", "views"));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
const publicRoutes = require("./src/routes/public");
const apiRoutes = require("./src/routes/api");
const authRoutes = require("./src/routes/auth");
app.use("/", publicRoutes); // EJS-rendered routes
app.use("/api", apiRoutes); // REST API for future React
app.use("/auth", authRoutes); // Auth routes

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
