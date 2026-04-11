import Product from "../modal/Product.js";
import Category from "../modal/categoryModal.js";

// create a new product
export const createProduct = async (req, res) => {
  try {
    const additionalImages = req.files.additionalImages 
      ? req.files.additionalImages.map(file => file.filename) 
      : [];

    const newProduct = new Product({
      frontImg: req.files.frontImg ? req.files.frontImg[0].filename : null,
      backImg: req.files.backImg ? req.files.backImg[0].filename : null,
      additionalImages,
      video: req.files.video ? req.files.video[0].filename : null,
      price: req.body.price,
      discount: req.body.discount,
      rating: req.body.rating,
      discountPercentage: req.body.discountPercentage,
      title: req.body.title,
      category: req.body.category,
      description: req.body.description || '',
      stock: req.body.stock || 0,
      karatage: req.body.karatage || '',
      metalColor: req.body.metalColor || '',
      grossWeight: req.body.grossWeight || '',
      metal: req.body.metal || '',
      variantGroup: req.body.variantGroup || '',
      gender: req.body.gender || '',
      occasion: req.body.occasion || '',
      collection: req.body.collection || ''
    });

    const saved = await newProduct.save();

    // Increment category item count
    if (req.body.category) {
      await Category.findByIdAndUpdate(req.body.category, { $inc: { item: 1 } });
    }

    const populated = await Product.findById(saved._id).populate('category');
    res.status(201).json(populated);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category');
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//get single product by id

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update product by ID
export const updateProduct = async (req, res) => {
  try {
    const existing = await Product.findById(req.params.id);
    const updateData = { ...req.body };

    if (req.files && req.files.frontImg) updateData.frontImg = req.files.frontImg[0].filename;
    if (req.files && req.files.backImg) updateData.backImg = req.files.backImg[0].filename;
    if (req.files && req.files.additionalImages) updateData.additionalImages = req.files.additionalImages.map(f => f.filename);
    if (req.files && req.files.video) updateData.video = req.files.video[0].filename;

    // If category changed, update item counts
    const oldCatId = existing?.category?.toString();
    const newCatId = req.body.category;
    if (oldCatId && newCatId && oldCatId !== newCatId) {
      await Category.findByIdAndUpdate(oldCatId, { $inc: { item: -1 } });
      await Category.findByIdAndUpdate(newCatId, { $inc: { item: 1 } });
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true }).populate('category');
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete product by ID
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: "Product not found" });

    // Decrement category item count
    if (deletedProduct.category) {
      await Category.findByIdAndUpdate(deletedProduct.category, { $inc: { item: -1 } });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get color variants by variantGroup
export const getVariants = async (req, res) => {
  try {
    const { variantGroup } = req.params;
    if (!variantGroup) return res.json([]);
    const variants = await Product.find({ variantGroup }).populate('category');
    res.json(variants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim() === '') {
      return res.status(200).json([]);
    }

    const queryLower = q.trim().toLowerCase();

    // Detect gender keywords - check 'women' before 'men' to avoid substring match
    const genderMap = [
      { keyword: 'women', value: 'Women' },
      { keyword: 'unisex', value: 'Unisex' },
      { keyword: 'men', value: 'Men' },
    ];
    let detectedGender = null;
    let cleanQuery = queryLower;

    for (const { keyword, value } of genderMap) {
      if (queryLower.includes(keyword)) {
        detectedGender = value;
        cleanQuery = queryLower.replace(keyword, '').trim();
        break;
      }
    }

    // Build title search from remaining keywords
    const keywords = cleanQuery.split(/\s+/).filter(Boolean);

    let titleCondition = {};
    if (keywords.length > 0) {
      titleCondition = {
        $or: keywords.map(k => ({ title: { $regex: k, $options: 'i' } }))
      };
    }

    // Build final query
    let dbQuery = {};
    if (detectedGender && keywords.length > 0) {
      dbQuery = { gender: detectedGender, ...titleCondition };
    } else if (detectedGender && keywords.length === 0) {
      dbQuery = { gender: detectedGender };
    } else {
      dbQuery = titleCondition;
    }

    const products = await Product.find(dbQuery).populate('category').limit(20);
    res.status(200).json(products);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ message: err.message });
  }
};
