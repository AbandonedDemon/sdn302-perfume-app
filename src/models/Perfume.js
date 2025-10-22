const mongoose = require("mongoose");
const commentSchema = require("./Comment");
const perfumeSchema = new mongoose.Schema(
  {
    perfumeName: { type: String, required: true },
    uri: { type: String, required: true }, // Image URI
    price: { type: Number, required: true },
    concentration: { type: String, required: true }, // e.g., Extrait, EDP, EDT
    description: { type: String, required: true },
    ingredients: { type: String, required: true },
    volume: { type: Number, required: true },
    targetAudience: { type: String, required: true }, // male, female, unisex
    comments: [commentSchema],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
  },
  { timestamps: true },
);
module.exports = mongoose.model("Perfume", perfumeSchema);
