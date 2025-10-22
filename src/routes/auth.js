const express = require("express");
const { protect } = require("../middlewares/auth");
const authController = require("../controllers/authController");
const passport = require("../config/passport");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.get("/register", (req, res) => res.render("register"));
router.post("/register", authController.register);
router.get("/login", (req, res) => res.render("login"));
router.post("/login", authController.login);
router.get("/profile", protect, (req, res) =>
  res.render("profile", { user: req.user }),
);
router.post("/profile", protect, authController.updateProfile);
router.post("/change-password", protect, authController.changePassword);

// OAuth2: Google
const googleConfigured =
  !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET;

router.get("/google", (req, res, next) => {
  if (!googleConfigured) {
    return res
      .status(503)
      .render("error", { message: "Google OAuth is not configured" });
  }
  return passport.authenticate("google", { scope: ["profile", "email"] })(
    req,
    res,
    next,
  );
});

router.get("/google/callback", (req, res, next) => {
  if (!googleConfigured) {
    return res
      .status(503)
      .render("error", { message: "Google OAuth is not configured" });
  }
  return passport.authenticate("google", { failureRedirect: "/auth/login" })(
    req,
    res,
    next,
  );
});

router.get("/google/callback", async (req, res) => {
  // On success, passport puts user on req
  if (!req.user) return res.redirect("/auth/login");
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.cookie("token", token, { httpOnly: true });
  res.redirect("/");
});

router.get("/logout", (req, res, next) => {
  // Passport logout for session, also clear JWT cookie for consistency
  req.logout((err) => {
    if (err) return next(err);
    res.clearCookie("token");
    res.redirect("/");
  });
});

module.exports = router;
