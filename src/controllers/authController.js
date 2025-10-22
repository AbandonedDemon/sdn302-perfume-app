const Member = require("../models/Member");
const jwt = require("jsonwebtoken");

// Register
exports.register = async (req, res) => {
  const { email, password, name, YOB, gender } = req.body;
  console.log(req.body);
  try {
    let member = await Member.findOne({ email });
    if (member)
      return res.status(400).render("register", { error: "User exists" });

    member = new Member({ email, password, name, YOB, gender, isAdmin: false });
    await member.save();

    const token = jwt.sign({ id: member._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token); // For EJS sessions
    res.redirect("/"); // Redirect to index
  } catch (err) {
    res.status(500).render("error", { message: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const member = await Member.findOne({ email });
    if (!member || !(await member.comparePassword(password))) {
      return res.status(401).render("login", { error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: member._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token);
    res.redirect("/");
  } catch (err) {
    res.status(500).render("error", { message: err.message });
  }
};

// Update profile (only own)
exports.updateProfile = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    for (const update of updates) {
      req.user[update] = req.body[update];
    }
    await req.user.save();
    res.redirect("/profile");
  } catch (err) {
    res.status(500).render("error", { message: err.message });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!(await req.user.comparePassword(oldPassword))) {
    return res.status(401).render("profile", { error: "Invalid old password" });
  }
  req.user.password = newPassword;
  await req.user.save();
  res.redirect("/profile");
};
