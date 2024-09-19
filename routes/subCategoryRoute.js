const express = require("express");

const { createSubCategoryValidator } = require("../utils/validators/subCategoryValidators");

const { createSubCategory } = require("../services/subCategoryService");

const router = express.Router();

router.post("/", createSubCategoryValidator, createSubCategory);

module.exports = router;
