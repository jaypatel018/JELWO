import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  frontImg: { type: String, required: true },
  backImg: { type: String, required: true },
  additionalImages: [{ type: String }],
  video: { type: String, default: null },
  price: { type: Number, required: true },
  discount: { type: Number, required: true },
  rating: { type: Number, required: true },
  discountPercentage: { type: Number, required: true },
  title: { type: String, required: true },
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  },
  description: { type: String, default: '' },
  stock: { type: Number, required: true, default: 0 },
  // Metal Details
  karatage: { type: String, default: '' },
  metalColor: { type: String, default: '' },
  grossWeight: { type: String, default: '' },
  metal: { type: String, default: '' },
  // Color variants — same variantGroup = same product in different colors
  variantGroup: { type: String, default: '' },
  // Gender attribute for filtering (Men / Women / Unisex)
  gender: { type: String, enum: ['Men', 'Women', 'Unisex', ''], default: '' },
  // Occasion
  occasion: { type: String, default: '' },
  // Collection
  collection: { type: String, default: '' }
}, {
  timestamps: true
});

const Product = mongoose.model("Product", productSchema);
export default Product;
