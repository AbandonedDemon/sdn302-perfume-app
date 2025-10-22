const Perfume = require("../models/Perfume");

// Index: All perfumes (populate brand)
exports.index = async (req, res) => {
  try {
    const perfumes = await Perfume.find().populate("brand", "brandName");
    res.render("index", { perfumes: perfumes || [] });
  } catch (error) {
    console.error("Error fetching perfumes:", error);
    res.render("index", { perfumes: [] });
  }
};

// Detail
exports.detail = async (req, res) => {
  const perfume = await Perfume.findById(req.params.id)
    .populate("brand")
    .populate("comments.author");
  res.render("detail", { perfume });
};

// Search by name
exports.search = async (req, res) => {
  const { query } = req.query;
  const perfumes = await Perfume.find({
    perfumeName: { $regex: query, $options: "i" },
  }).populate("brand");
  res.render("index", { perfumes });
};

// Filter by brand
exports.filterByBrand = async (req, res) => {
  const { brandId } = req.params;
  const perfumes = await Perfume.find({ brand: brandId }).populate("brand");
  res.render("index", { perfumes });
};

// Add comment (protected, one per perfume per member)
exports.addComment = async (req, res) => {
  const { rating, content } = req.body;
  const perfume = await Perfume.findById(req.params.perfumeId);
  if (
    perfume.comments.some(
      (c) => c.author.toString() === req.user._id.toString(),
    )
  ) {
    return res
      .status(400)
      .render("detail", { perfume, error: "One comment per perfume" });
  }
  perfume.comments.push({ rating, content, author: req.user._id });
  await perfume.save();
  res.redirect(`/perfume/${req.params.perfumeId}`);
};

// Manage own comments (view/edit/delete own)
// Implement similar logic in profile or detail view.
