import Razorpay from 'razorpay';
import crypto from 'crypto';
import mongoose from 'mongoose';
import OrderDetails from '../modal/OrderDetails.js';
import Coupon from '../modal/Coupon.js';
import { sendOrderConfirmationEmail } from '../config/emailConfig.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// COD order
export const createCODOrder = async (req, res) => {
  try {
    const { clerkUserId, orderData } = req.body;

    const products = (orderData.products || []).map(p => {
      let productId;
      try { productId = new mongoose.Types.ObjectId(String(p.productId)); } catch { productId = undefined; }
      return { productId, title: p.title, frontImg: p.frontImg, price: p.price, quantity: p.quantity || 1, itemTotal: (p.price || 0) * (p.quantity || 1) };
    });

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const orderNumber = `ORD-${dateStr}-${Math.floor(10000 + Math.random() * 90000)}`;

    const order = new OrderDetails({
      orderNumber, clerkUserId,
      customerInfo: orderData.customerInfo,
      products,
      shippingAddress: orderData.shippingAddress || {},
      shippingMethod: orderData.shippingMethod || 'ship',
      shippingCost: orderData.shippingCost || 0,
      paymentInfo: { method: 'cod', status: 'pending' },
      subtotal: orderData.subtotal,
      tax: orderData.tax || 0,
      total: orderData.total,
      status: 'pending',
    });

    await order.save();

    // Mark coupon as used by this user
    if (orderData.couponCode && clerkUserId) {
      await Coupon.findOneAndUpdate(
        { code: orderData.couponCode.toUpperCase() },
        { $addToSet: { usedBy: clerkUserId } }
      );
    }

    // Send confirmation email
    sendOrderConfirmationEmail(order).catch(() => {});

    res.status(201).json({ success: true, message: 'COD order placed', order });
  } catch (error) {
    console.error('COD order error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };
    const razorpayOrder = await razorpay.orders.create(options);
    res.status(200).json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('❌ Razorpay order creation error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to create payment order', error: error.message });
  }
};

// Step 2: Verify payment signature and save order
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, clerkUserId, orderData } = req.body;

    // Verify Razorpay signature
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment fields' });
    }

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment signature verification failed' });
    }

    // --- Map products, safely cast productId ---
    const products = (orderData.products || []).map(p => {
      let productId;
      try {
        productId = new mongoose.Types.ObjectId(String(p.productId));
      } catch {
        productId = undefined;
      }
      return {
        productId,
        title: p.title,
        frontImg: p.frontImg,
        price: p.price,
        quantity: p.quantity || 1,
        itemTotal: (p.price || 0) * (p.quantity || 1),
      };
    });

    // Generate order number
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `ORD-${dateStr}-${random}`;

    // --- Save order ---
    const order = new OrderDetails({
      orderNumber,
      clerkUserId,
      customerInfo: orderData.customerInfo,
      products,
      shippingAddress: orderData.shippingAddress || {},
      shippingMethod: orderData.shippingMethod || 'ship',
      shippingCost: orderData.shippingCost || 0,
      paymentInfo: {
        method: 'razorpay',
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        status: 'completed',
      },
      subtotal: orderData.subtotal,
      tax: orderData.tax || 0,
      total: orderData.total,
      status: 'pending',
    });

    await order.save();

    // Mark coupon as used by this user
    if (orderData.couponCode && clerkUserId) {
      await Coupon.findOneAndUpdate(
        { code: orderData.couponCode.toUpperCase() },
        { $addToSet: { usedBy: clerkUserId } }
      );
    }

    await order.populate('products.productId');

    // Send confirmation email (non-blocking — don't fail the response if email fails)
    sendOrderConfirmationEmail(order).catch(err =>
      console.error('Order email error:', err.message)
    );

    res.status(201).json({
      success: true,
      message: 'Payment verified and order placed',
      order,
    });
  } catch (error) {
    console.error('❌ verifyPayment error:', error.message);
    console.error(error.stack);
    res.status(500).json({ success: false, message: error.message });
  }
};
