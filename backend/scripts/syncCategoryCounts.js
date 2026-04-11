import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../modal/Product.js";
import Category from "../modal/categoryModal.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URL).then(async () => {
  console.log("✅ Connected to MongoDB");

  // Get all products
  const products = await Product.find();

  // Count products per category
  const counts = {};
  products.forEach(p => {
    const id = p.category?.toString();
    if (id) counts[id] = (counts[id] || 0) + 1;
  });

  console.log("Product counts per category:", counts);

  // Update each category's item count
  const categories = await Category.find();
  for (const cat of categories) {
    const count = counts[cat._id.toString()] || 0;
    await Category.findByIdAndUpdate(cat._id, { item: count });
    console.log(`✅ ${cat.name}: ${count} items`);
  }

  console.log("\n✅ All category counts synced!");
  process.exit(0);
}).catch(err => {
  console.error("❌ Error:", err);
  process.exit(1);
});
