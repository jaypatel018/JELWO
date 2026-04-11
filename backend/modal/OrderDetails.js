import mongoose from "mongoose";

const orderDetailsSchema = new mongoose.Schema({

  // Order number (unique)
  orderNumber: { type: String, unique: true, index: true },

  // Clerk user
  clerkUserId: { type: String, required: true, index: true },

  // Customer info (matches Admin dashboard field access)
  customerInfo: {
    firstName: String,
    lastName: String,
    email: { type: String, required: true },
    phone: String,
  },

  // Products
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    title: String,
    frontImg: String,
    price: Number,
    quantity: { type: Number, default: 1 },
    itemTotal: Number,
  }],

  // Shipping
  shippingAddress: {
    firstName: String,
    lastName: String,
    address: String,
    apartment: String,
    city: String,
    state: String,
    pinCode: String,
    country: String,
  },
  shippingMethod: { type: String, default: 'ship' },
  shippingCost: { type: Number, default: 0 },

  // Payment
  paymentInfo: {
    method: { type: String, default: 'razorpay' },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'completed',
    },
  },

  // Totals
  subtotal: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true },

  // Status
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'payment_failed'],
    default: 'pending',
  },

  trackingNumber: String,
  notes: String,

}, { timestamps: true });

orderDetailsSchema.index({ clerkUserId: 1, createdAt: -1 });
orderDetailsSchema.index({ status: 1 });

const OrderDetails = mongoose.model("OrderDetails", orderDetailsSchema);
export default OrderDetails;
