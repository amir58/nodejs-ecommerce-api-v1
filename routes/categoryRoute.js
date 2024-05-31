const express = require("express");

const {
  getCategories,
  createCategory,
} = require("../services/categoryService");

const router = express.Router();

router.route("/").get(getCategories).post(createCategory);

// router.post("/", createCategory);
// router.get("/", getCategories);

module.exports = router;
