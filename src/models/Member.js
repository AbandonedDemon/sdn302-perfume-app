const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Support both local (email/password) and OAuth users
const memberSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String }, // optional for OAuth users
    name: { type: String, required: true },
    YOB: { type: Number }, // optional for OAuth users
    gender: { type: Boolean, default: false }, // optional; true for male?
    isAdmin: { type: Boolean, default: false },
    // OAuth specifics
    provider: { type: String }, // e.g., 'google'
    oauthId: { type: String }, // provider-specific user id
    avatarUrl: { type: String },
  },
  { timestamps: true },
);

// Hash password before saving
memberSchema.pre("save", async function (next) {
  // Hash password only when present and modified (local users)
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare password
memberSchema.methods.comparePassword = async function (password) {
  if (!this.password) return false; // OAuth users have no local password
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("Member", memberSchema);
