import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import productRoutes from "./route/productRoutes.js";
import categoryRoutes from "./route/categoryRoutes.js";
import reviewRoutes from "./route/reviewRoutes.js";
import userRoutes from "./route/userRoute.js";
import adminRoutes from "./route/adminRoute.js";
import paymentRoutes from "./route/paymentRoute.js";
import orderDetailsRoutes from "./route/orderDetailsRoute.js";
import statsRoutes from "./route/statsRoute.js";
import couponRoutes from "./route/couponRoute.js";
import Coupon from "./modal/Coupon.js";
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5174",
    "http://localhost:5173",
    "http://localhost:5175",
    "http://localhost:5176",
    "https://jelwo-admin.vercel.app",
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL,
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json());

// uploads folder static access
app.use("/uploads", express.static("uploads"));
// Routes
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", orderDetailsRoutes);
app.use("/api/order-details", orderDetailsRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/coupons", couponRoutes);

app.get('/ping', (_, res) => {
  res.send('Pong');
})

// Database connection
mongoose.connect(process.env.MONGO_URL, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(async () => {
  console.log("✅ MongoDB connected successfully");

  // Auto-create FIRST10 coupon if it doesn't exist
  const exists = await Coupon.findOne({ code: 'FIRST10' });
  if (!exists) {
    await Coupon.create({
      code: 'FIRST10',
      discountType: 'percentage',
      discountValue: 10,
      minOrder: 0,
      expiryDate: new Date('2099-12-31'),
      isActive: true,
    });
    console.log("✅ FIRST10 coupon created (10% off for new users)");
  }
})
.catch((err) => console.error("❌ DB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servers running on port ${PORT}`);
});