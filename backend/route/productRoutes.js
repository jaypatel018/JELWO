import express from "express";
import upload1 from "../middleware/upload1.js";
import { createProduct, getProducts, getProductById, updateProduct,
  deleteProduct, searchProducts, getVariants } from "../controller/productController.js";

const router = express.Router();
router.post("/add", upload1.fields([
  { name: "frontImg", maxCount: 1 },
  { name: "backImg", maxCount: 1 },
  { name: "additionalImages", maxCount: 2 },
  { name: "video", maxCount: 1 }
]), createProduct);
router.get("/search", searchProducts);
router.get("/variants/:variantGroup", getVariants);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put(
  "/:id",
  upload1.fields([
    { name: "frontImg", maxCount: 1 },
    { name: "backImg", maxCount: 1 },
    { name: "additionalImages", maxCount: 2 },
    { name: "video", maxCount: 1 }
  ]),
  updateProduct
);
router.delete("/:id", deleteProduct);

export default router;
