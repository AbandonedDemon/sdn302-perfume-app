const express = require("express");
const { protect } = require("../middlewares/auth");
const publicController = require("../controllers/publicController");
const router = express.Router();

router.get("/", publicController.index);
router.get("/perfume/:id", publicController.detail);
router.get("/search", publicController.search);
router.get("/brand/:brandId", publicController.filterByBrand);
router.post(
  "/perfume/:perfumeId/comment",
  protect,
  publicController.addComment,
);

module.exports = router;
