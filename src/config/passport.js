const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Member = require("../models/Member");

// Serialize the minimal info into session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await Member.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Google OAuth2 Strategy (conditionally initialize if env vars present)
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } =
  process.env;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.warn(
    "Google OAuth not configured: set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env",
  );
} else {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL || "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          const oauthId = profile.id;
          const name = profile.displayName || profile.name?.givenName || "User";
          const avatarUrl = profile.photos?.[0]?.value;

          let user = await Member.findOne({
            $or: [{ oauthId, provider: "google" }, { email }],
          });

          if (user) {
            // Ensure linkage fields are kept up-to-date
            if (!user.oauthId) user.oauthId = oauthId;
            if (!user.provider) user.provider = "google";
            if (!user.avatarUrl && avatarUrl) user.avatarUrl = avatarUrl;
            await user.save();
            return done(null, user);
          }

          const created = await Member.create({
            email,
            name,
            provider: "google",
            oauthId,
            avatarUrl,
          });
          return done(null, created);
        } catch (err) {
          return done(err);
        }
      },
    ),
  );
}

module.exports = passport;
