const jwt = require("jsonwebtoken");
const Member = require("../models/Member");

// Protect route (verify JWT)
const protect = async (req, res, next) => {
  // If Passport has already attached a user via session auth, allow through
  if (req.isAuthenticated?.() && req.user) {
    return next();
  }

  let token =
    req.header("Authorization")?.replace("Bearer ", "") || req.cookies?.token; // Support headers for API, cookies for EJS
  if (!token)
    return res.status(401).render("error", { message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Member.findById(decoded.id);
    next();
  } catch (err) {
    console.log(err);
    res.status(401).render("error", { message: "Invalid token" });
  }
};

// Admin check
const admin = (req, res, next) => {
  if (req.user?.isAdmin) return next();
  res.status(403).render("error", { message: "Admin access required" });
};

module.exports = { protect, admin };
