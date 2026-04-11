import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  item: { type: Number, default: 0 },
  image: { type: String, default: "" },
});

const Category = mongoose.model("Category", categorySchema);
export default Category;
