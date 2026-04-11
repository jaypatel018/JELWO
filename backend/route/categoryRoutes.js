import express from "express";
import upload from "../middleware/upload.js";
import { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } from "../controller/categoryController.js";

const router = express.Router();

router.post("/add", upload.single("image"), createCategory);
router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.put("/:id", upload.single("image"), updateCategory);
router.delete("/:id", deleteCategory);

export default router;
