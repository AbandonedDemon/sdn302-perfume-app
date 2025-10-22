const Brand = require("../models/Brand");
const Perfume = require("../models/Perfume");

// Brands CRUD
exports.getBrands = async (req, res) => {
  const brands = await Brand.find();
  res.render("admin/brands", { brands }); // Or send JSON for API
};

exports.createBrand = async (req, res) => {
  const { brandName } = req.body;
  const brand = new Brand({ brandName });
  await brand.save();
  res.redirect("/admin/brands");
};

exports.updateBrand = async (req, res) => {
  const { id } = req.params;
  const { brandName } = req.body;
  await Brand.findByIdAndUpdate(id, { brandName });
  res.redirect("/admin/brands");
};

exports.deleteBrand = async (req, res) => {
  const { id } = req.params;
  await Brand.findByIdAndDelete(id);
  res.redirect("/admin/brands");
};

// Perfumes CRUD
exports.getPerfumes = async (req, res) => {
  const perfumes = await Perfume.find().populate("brand");
  res.render("admin/perfumes", { perfumes }); // Or send JSON for API
};

exports.createPerfume = async (req, res) => {
  const { perfumeName, imageUri, targetAudience, brandId } = req.body;
  const perfume = new Perfume({
    perfumeName,
    imageUri,
    targetAudience,
    brand: brandId,
  });
  await perfume.save();
  res.redirect("/admin/perfumes");
};

exports.updatePerfume = async (req, res) => {
  const { id } = req.params;
  const { perfumeName, imageUri, targetAudience, brandId } = req.body;
  await Perfume.findByIdAndUpdate(id, {
    perfumeName,
    imageUri,
    targetAudience,
    brand: brandId,
  });
  res.redirect("/admin/perfumes");
};
exports.deletePerfume = async (req, res) => {
  const { id } = req.params;
  await Perfume.findByIdAndDelete(id);
  res.redirect("/admin/perfumes");
};
