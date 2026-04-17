# JELWO – Project Documentation

---

## 4. Development

### 4.1 Key Functional Code Modules

---

#### 1. User Side

---

##### 1.1 Sign Up / Sign In
**File:** `jelwo/backend/controller/userController.js`

```js
// Step 1: Signup — hash password, generate OTP, send to email
export const signupUser = async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });

  // If user exists but not verified, resend OTP
  if (existingUser && !existingUser.isVerified) {
    const otp = generateOTP();
    existingUser.otp = otp;
    existingUser.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    existingUser.password = await bcrypt.hash(password, 10);
    await existingUser.save();
    await sendOTPEmail(email, otp, name);
    return res.status(200).json({ message: "OTP resent to your email", email });
  }

  if (existingUser?.isVerified)
    return res.status(400).json({ message: "Email already registered" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

  const newUser = new User({ name, email, password: hashedPassword, otp, otpExpiry, isVerified: false });
  await newUser.save();
  await sendOTPEmail(email, otp, name);
  res.status(201).json({ message: "OTP sent to your email", email });
};

// Step 2: Verify OTP
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email }).select("+otp +otpExpiry");
  if (!user) return res.status(400).json({ message: "User not found" });
  if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
  if (new Date() > user.otpExpiry) return res.status(400).json({ message: "OTP expired" });

  user.isVerified = true;
  user.verifiedAt = new Date();
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();
  res.status(200).json({ message: "Email verified successfully" });
};

// Login — account lock check, password verify, attempt tracking
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user) return res.status(400).json({ message: "User not found" });

  if (user.isAccountLocked()) {
    const mins = Math.ceil((user.lockUntil - Date.now()) / 60000);
    return res.status(423).json({ message: `Account locked. Try again in ${mins} minutes.` });
  }
  if (!user.isVerified)
    return res.status(400).json({ message: "Please verify your email first", needsVerification: true });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    await user.incrementLoginAttempts(); // locks after 5 failed attempts for 2 hours
    return res.status(400).json({ message: "Invalid password" });
  }

  await user.resetLoginAttempts();
  const { password: pwd, otp, otpExpiry, ...userData } = user._doc;
  res.status(200).json({ message: "Login successful", user: userData });
};
```

---

##### 1.2 Forgot Password
**File:** `jelwo/backend/controller/userController.js`

```js
// Step 1: Send OTP to email
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email }).select("+otp +otpExpiry");
  if (!user) return res.status(400).json({ message: "User not found" });

  const otp = generateOTP();
  user.otp = otp;
  user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();
  await sendOTPEmail(email, otp, user.name);
  res.status(200).json({ message: "OTP sent for password reset", email });
};

// Step 2: Verify OTP and set new password
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ email }).select("+otp +otpExpiry +password");
  if (!user) return res.status(400).json({ message: "User not found" });
  if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
  if (new Date() > user.otpExpiry) return res.status(400).json({ message: "OTP expired" });

  user.password = await bcrypt.hash(newPassword, 10);
  user.otp = undefined;
  user.otpExpiry = undefined;
  user.loginAttempts = 0;
  user.lockUntil = undefined; // unlock account if it was locked
  await user.save();
  res.status(200).json({ message: "Password reset successfully" });
};
```

---

##### 1.3 Cart Logic
**File:** `jelwo/frontend/src/Context/CartContext.jsx`

```js
// Load cart from backend when user signs in
useEffect(() => {
  if (isSignedIn && userEmail) {
    axios.get(`${VITE_API_URL}/users/cart/${userEmail}`).then(async res => {
      const savedCart = res.data.cart || [];
      const productsRes = await axios.get(`${VITE_API_URL}/products`);
      const allProducts = productsRes.data || [];
      // Restore full product objects from saved productId + qty pairs
      const restored = savedCart
        .map(({ productId, qty }) => {
          const product = allProducts.find(p => p._id === productId);
          return product ? { ...product, qty } : null;
        })
        .filter(Boolean);
      setCart(restored);
    });
  }
  if (!isSignedIn) setCart([]); // clear on sign-out
}, [isSignedIn, userEmail]);
// Persist cart to backend on every change
useEffect(() => {
  if (!isSignedIn || !userEmail) return;
  const payload = cart.map(item => ({ productId: item._id, qty: item.qty || 1 }));
  axios.post(`${VITE_API_URL}/users/cart/${userEmail}`, { cart: payload });
}, [cart]);
// Add to cart — merge qty if product already exists
const addToCart = (product) => {
  setCart(prev => {
    const existing = prev.find(item => item._id === product._id);
    if (existing) {
      return prev.map(item =>
        item._id === product._id
          ? { ...item, qty: (item.qty || 1) + (product.qty || 1) }
          : item
      );
    }
    return [...prev, { ...product, qty: product.qty || 1 }];
  });
};
const increaseQty    = (id) => setCart(prev => prev.map(item => item._id === id ? { ...item, qty: (item.qty || 1) + 1 } : item));
const decreaseQty    = (id) => setCart(prev => prev.map(item => item._id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item));
const removeFromCart = (id) => setCart(prev => prev.filter(item => item._id !== id));
const clearCart      = ()   => setCart([]);
const getCartTotal   = ()   => cart.reduce((total, item) => total + (item.price * (item.qty || 1)), 0);
```

Backend — save/get cart:
```js
// Get cart
export const getCart = async (req, res) => {
  const user = await User.findOne({ email: req.params.email }).select("cart");
  res.status(200).json({ cart: user?.cart || [] });
};

// Save cart (full replace)
export const saveCart = async (req, res) => {
  const user = await User.findOneAndUpdate(
    { email: req.params.email },
    { cart: req.body.cart || [] },
    { new: true }
  ).select("cart");
  res.status(200).json({ cart: user.cart });
};
```

---

##### 1.4 Wishlist Logic
**File:** `jelwo/frontend/src/Context/WhishlistContext.jsx`

```js
// Load wishlist from backend on sign-in
useEffect(() => {
  if (isSignedIn && userEmail) {
    axios.get(`${VITE_API_URL}/users/wishlist/${userEmail}`).then(res => {
      const ids = res.data.wishlist || [];
      return axios.get(`${VITE_API_URL}/products`).then(prodRes => {
        const allProducts = prodRes.data || [];
        setWishlist(allProducts.filter(p => ids.includes(p._id)));
      });
    });
  }
  if (!isSignedIn) setWishlist([]);
}, [isSignedIn, userEmail]);

// Persist wishlist IDs to backend on every change
useEffect(() => {
  if (!isSignedIn || !userEmail) return;
  axios.post(`${VITE_API_URL}/users/wishlist/${userEmail}`, {
    wishlist: wishlist.map(item => item._id)
  });
}, [wishlist]);

// Toggle — add if not in list, remove if already in list
const toggleWishlist = (product, navigate) => {
  if (!isSignedIn) {
    alert("Please sign in to add items to wishlist");
    if (navigate) navigate('/sign-in');
    return false;
  }
  setWishlist(prev => {
    const exists = prev.find(item => item._id === product._id);
    return exists
      ? prev.filter(item => item._id !== product._id)
      : [...prev, product];
  });
};
```

Backend — save/get wishlist:
```js
export const getWishlist = async (req, res) => {
  const user = await User.findOne({ email: req.params.email }).select("wishlist");
  res.status(200).json({ wishlist: user?.wishlist || [] });
};

export const saveWishlist = async (req, res) => {
  const user = await User.findOneAndUpdate(
    { email: req.params.email },
    { wishlist: req.body.wishlist || [] },
    { new: true }
  ).select("wishlist");
  res.status(200).json({ wishlist: user.wishlist });
};
```

---

##### 1.5 Filter & Search Logic
**File:** `jelwo/frontend/src/pages/FilterPage.jsx`

```js
// Fetch and filter products by route type (gender / occasion / collection / category / new)
useEffect(() => {
  axios.get(`${VITE_API_URL}/products`).then(res => {
    const all = res.data || [];
    const filtered = all.filter(p => {
      if (type === 'gender')     return p.gender === decodedValue;
      if (type === 'occasion')   return p.occasion === decodedValue;
      if (type === 'collection') return p.collection === decodedValue;
      if (type === 'category')   return p.category?.name?.toLowerCase() === decodedValue.toLowerCase();
      if (type === 'new')        return true;
      return true;
    });
    // New arrivals: only last 24 hours
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const sorted = type === 'new'
      ? filtered.filter(p => new Date(p.createdAt) >= last24h).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      : filtered;
    setProducts(sorted);
  });
}, [type, value]);

// Client-side filter: price range + category + color + availability + sort
const filtered = products.filter(p => {
  const priceMatch = p.price >= priceRange[0] && p.price <= priceRange[1];
  const catMatch   = selectedCategories.length === 0 || selectedCategories.some(id => p.category?._id === id);
  const colorMatch = selectedColors.length === 0 || selectedColors.some(c => p.metalColor?.toLowerCase() === c.toLowerCase());
  const availMatch = availabilityFilter.length === 0 ||
    (availabilityFilter.includes('instock')    && p.stock > 0) ||
    (availabilityFilter.includes('outofstock') && p.stock === 0);
  return priceMatch && catMatch && colorMatch && availMatch;
}).sort((a, b) => {
  if (sortKey === 'price-asc') return a.price - b.price;
  if (sortKey === 'price-dsc') return b.price - a.price;
  if (sortKey === 'name-asc')  return a.title.localeCompare(b.title);
  if (sortKey === 'name-dsc')  return b.title.localeCompare(a.title);
  return 0;
});
```

Backend — Search by title + gender keyword:
**File:** `jelwo/backend/controller/productController.js`

```js
export const searchProducts = async (req, res) => {
  const { q } = req.query;
  if (!q?.trim()) return res.status(200).json([]);

  const queryLower = q.trim().toLowerCase();

  // Detect gender keyword first (check 'women' before 'men' to avoid substring conflict)
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

  const keywords = cleanQuery.split(/\s+/).filter(Boolean);
  const titleCondition = keywords.length > 0
    ? { $or: keywords.map(k => ({ title: { $regex: k, $options: 'i' } })) }
    : {};

  const dbQuery = detectedGender
    ? { gender: detectedGender, ...titleCondition }
    : titleCondition;

  const products = await Product.find(dbQuery).populate('category').limit(20);
  res.status(200).json(products);
};
```

---

##### 1.6 Coupon & Discount Logic
**File:** `jelwo/backend/controller/couponController.js`

```js
// Validate coupon at checkout
export const validateCoupon = async (req, res) => {
  const { code, orderTotal, clerkUserId } = req.body;

  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
  if (!coupon) return res.status(404).json({ success: false, message: 'Invalid coupon code' });
  if (new Date() > coupon.expiryDate) return res.status(400).json({ success: false, message: 'Coupon has expired' });
  if (orderTotal < coupon.minOrder) return res.status(400).json({ success: false, message: `Minimum order is ₹${coupon.minOrder}` });

  // One-use-per-user check
  if (clerkUserId && coupon.usedBy.includes(clerkUserId))
    return res.status(400).json({ success: false, message: 'You have already used this coupon' });

  // Calculate discount
  const discount = coupon.discountType === 'percentage'
    ? Math.min(
        Math.round((orderTotal * coupon.discountValue) / 100),
        coupon.maxDiscount ?? Infinity   // cap for percentage coupons
      )
    : coupon.discountValue;             // flat amount

  res.json({ success: true, coupon, discount, finalTotal: orderTotal - discount });
};
```

---

##### 1.7 Order Management (User Side)
**File:** `jelwo/backend/controller/orderDetailsController.js`

```js
// Get all orders for a specific user
export const getUserOrderDetails = async (req, res) => {
  const orders = await OrderDetails.find({ clerkUserId: req.params.clerkUserId })
    .populate('products.productId')
    .sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: orders.length, orders });
};

// Cancel order — only allowed when status is pending or processing
export const cancelOrderDetail = async (req, res) => {
  const order = await OrderDetails.findById(req.params.orderId);
  if (!order) return res.status(404).json({ success: false, message: "Order not found" });

  if (!['pending', 'processing'].includes(order.status))
    return res.status(400).json({ success: false, message: "Order cannot be cancelled at this stage" });

  order.status = 'cancelled';
  await order.save();
  res.status(200).json({ success: true, message: "Order cancelled", order });
};
```

---

##### 1.8 Payment Logic — Razorpay & COD
**File:** `jelwo/backend/controller/paymentController.js`

```js
// Step 1: Create Razorpay order (amount in paise)
export const createRazorpayOrder = async (req, res) => {
  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(req.body.amount * 100), // convert ₹ to paise
    currency: 'INR',
    receipt: `receipt_${Date.now()}`,
  });
  res.status(200).json({ success: true, orderId: razorpayOrder.id, keyId: process.env.RAZORPAY_KEY_ID });
};

// Step 2: Verify Razorpay signature and save order to DB
export const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, clerkUserId, orderData } = req.body;

  // HMAC-SHA256 signature verification
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expectedSignature !== razorpay_signature)
    return res.status(400).json({ success: false, message: 'Payment signature verification failed' });

  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const orderNumber = `ORD-${dateStr}-${Math.floor(10000 + Math.random() * 90000)}`;

  const order = new OrderDetails({
    orderNumber, clerkUserId,
    customerInfo: orderData.customerInfo,
    products: orderData.products,
    shippingAddress: orderData.shippingAddress,
    shippingCost: orderData.shippingCost || 0,
    paymentInfo: {
      method: 'razorpay',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      status: 'completed',
    },
    subtotal: orderData.subtotal,
    total: orderData.total,
    status: 'pending',
  });
  await order.save();

  // Mark coupon as used (prevent reuse)
  if (orderData.couponCode && clerkUserId) {
    await Coupon.findOneAndUpdate(
      { code: orderData.couponCode.toUpperCase() },
      { $addToSet: { usedBy: clerkUserId } }
    );
  }

  sendOrderConfirmationEmail(order).catch(() => {}); // non-blocking
  res.status(201).json({ success: true, message: 'Payment verified and order placed', order });
};

// COD Order — save directly with payment status pending
export const createCODOrder = async (req, res) => {
  const { clerkUserId, orderData } = req.body;
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const orderNumber = `ORD-${dateStr}-${Math.floor(10000 + Math.random() * 90000)}`;

  const order = new OrderDetails({
    orderNumber, clerkUserId,
    customerInfo: orderData.customerInfo,
    products: orderData.products,
    shippingAddress: orderData.shippingAddress,
    shippingCost: orderData.shippingCost || 0,
    paymentInfo: { method: 'cod', status: 'pending' },
    subtotal: orderData.subtotal,
    total: orderData.total,
    status: 'pending',
  });
  await order.save();

  if (orderData.couponCode && clerkUserId) {
    await Coupon.findOneAndUpdate(
      { code: orderData.couponCode.toUpperCase() },
      { $addToSet: { usedBy: clerkUserId } }
    );
  }

  sendOrderConfirmationEmail(order).catch(() => {});
  res.status(201).json({ success: true, message: 'COD order placed', order });
};
```

---

#### 2. Admin Side

---

##### 2.1 Product Add / Update / Delete
**File:** `jelwo/backend/controller/productController.js`

```js
// Add product with image/video upload — also increments category item count
export const createProduct = async (req, res) => {
  const newProduct = new Product({
    frontImg:         req.files.frontImg?.[0].filename,
    backImg:          req.files.backImg?.[0].filename,
    additionalImages: req.files.additionalImages?.map(f => f.filename) || [],
    video:            req.files.video?.[0].filename || null,
    price:            req.body.price,
    discount:         req.body.discount,
    discountPercentage: req.body.discountPercentage,
    rating:           req.body.rating,
    title:            req.body.title,
    category:         req.body.category,
    description:      req.body.description || '',
    stock:            req.body.stock || 0,
    karatage:         req.body.karatage || '',
    metalColor:       req.body.metalColor || '',
    grossWeight:      req.body.grossWeight || '',
    metal:            req.body.metal || '',
    variantGroup:     req.body.variantGroup || '',
    gender:           req.body.gender || '',
    occasion:         req.body.occasion || '',
    collection:       req.body.collection || '',
  });
  const saved = await newProduct.save();

  // Increment product count on the category
  if (req.body.category)
    await Category.findByIdAndUpdate(req.body.category, { $inc: { item: 1 } });

  res.status(201).json(await Product.findById(saved._id).populate('category'));
};

// Update product — if category changed, adjust item counts on both old and new category
export const updateProduct = async (req, res) => {
  const existing = await Product.findById(req.params.id);
  const updateData = { ...req.body };

  if (req.files?.frontImg)          updateData.frontImg = req.files.frontImg[0].filename;
  if (req.files?.backImg)           updateData.backImg = req.files.backImg[0].filename;
  if (req.files?.additionalImages)  updateData.additionalImages = req.files.additionalImages.map(f => f.filename);
  if (req.files?.video)             updateData.video = req.files.video[0].filename;

  const oldCatId = existing?.category?.toString();
  const newCatId = req.body.category;
  if (oldCatId && newCatId && oldCatId !== newCatId) {
    await Category.findByIdAndUpdate(oldCatId, { $inc: { item: -1 } });
    await Category.findByIdAndUpdate(newCatId, { $inc: { item: 1 } });
  }

  const updated = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true }).populate('category');
  res.json(updated);
};

// Delete product — also decrements category item count
export const deleteProduct = async (req, res) => {
  const deleted = await Product.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Product not found" });

  if (deleted.category)
    await Category.findByIdAndUpdate(deleted.category, { $inc: { item: -1 } });

  res.status(200).json({ message: "Product deleted successfully" });
};
```

---

##### 2.2 Order Management (Admin Side)
**File:** `jelwo/backend/controller/orderDetailsController.js`

```js
// Get all orders sorted newest first (admin dashboard)
export const getAllOrderDetails = async (req, res) => {
  const orders = await OrderDetails.find()
    .populate('products.productId')
    .sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: orders.length, orders });
};

// Update order status and optional tracking number
export const updateOrderDetailStatus = async (req, res) => {
  const { status, trackingNumber } = req.body;
  const order = await OrderDetails.findByIdAndUpdate(
    req.params.orderId,
    { status, ...(trackingNumber && { trackingNumber }) },
    { new: true }
  );
  if (!order) return res.status(404).json({ success: false, message: "Order not found" });
  res.status(200).json({ success: true, message: "Order status updated", order });
};
```

---

##### 2.3 Category Add / Update / Delete
**File:** `jelwo/backend/controller/categoryController.js`

```js
// Add category with optional image upload
export const createCategory = async (req, res) => {
  const newItem = new Category({
    ...req.body,
    image: req.file ? req.file.filename : "",
  });
  const saved = await newItem.save();
  res.status(201).json(saved);
};

// Update category — replace image if new file uploaded
export const updateCategory = async (req, res) => {
  const dataToUpdate = { ...req.body };
  if (req.file) dataToUpdate.image = req.file.filename;
  const updated = await Category.findByIdAndUpdate(req.params.id, dataToUpdate, { new: true });
  res.json(updated);
};

// Delete category
export const deleteCategory = async (req, res) => {
  const deleted = await Category.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Category not found" });
  res.json({ message: "Category deleted successfully" });
};
```

---

### 4.2 Screenshots

#### Frontend – User Panel

**1. Home Page**
> Screenshot placeholder

**2. Collections Page**
> Screenshot placeholder

**3. Product Detail Page**
> Screenshot placeholder

**4. Filter Page**
> Screenshot placeholder

**5. Cart (Off-canvas)**
> Screenshot placeholder

**6. Wishlist Page**
> Screenshot placeholder

**7. Checkout / Buy Now Page**
> Screenshot placeholder

**8. Profile Page**
> Screenshot placeholder

**9. Sign In / Sign Up**
> Screenshot placeholder

**10. Search Results**
> Screenshot placeholder

**11. Offers Page**
> Screenshot placeholder

**12. About / Contact / FAQ / Blog**
> Screenshot placeholder

---

#### Admin Panel

**1. Admin Login**
> Screenshot placeholder

**2. Dashboard**
> Screenshot placeholder

**3. Products Management**
> Screenshot placeholder

**4. Add / Edit Product**
> Screenshot placeholder

**5. Categories Management**
> Screenshot placeholder

**6. Orders Management**
> Screenshot placeholder

**7. Coupons Management**
> Screenshot placeholder

**8. Users Management**
> Screenshot placeholder
