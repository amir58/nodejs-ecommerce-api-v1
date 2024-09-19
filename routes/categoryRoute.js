const express = require("express");
const { param, validationResult } = require('express-validator');

const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../services/categoryService");

const router = express.Router();

router.route("/").get(getCategories).post(createCategory);
router
  .route("/:id")
  .get(
    param('id').isMongoId().withMessage('Invalid ID'),
    (req, res, next) => {
      const result = validationResult(req);
      console.log(result.isEmpty());
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }
      next();
    },
    getCategory
  )
  .put(updateCategory)
  .delete(deleteCategory);

// router.post("/", createCategory);
// router.get("/", getCategories);

module.exports = router;
