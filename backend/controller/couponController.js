import Coupon from '../modal/Coupon.js';
import User from '../modal/userModal.js';
import { sendCouponAnnouncementEmail } from '../config/emailConfig.js';

// Get all coupons
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, coupons });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get active coupons (for frontend product page)
export const getActiveCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({ isActive: true, expiryDate: { $gte: new Date() } });
    res.json({ success: true, coupons });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Create coupon
export const createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);

    // Send announcement email to all verified users (non-blocking)
    User.find({ isVerified: true, isActive: true }).select('email name').lean()
      .then(users => sendCouponAnnouncementEmail(coupon, users))
      .catch(() => {});

    res.status(201).json({ success: true, coupon });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Update coupon
export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
    res.json({ success: true, coupon });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Toggle active/inactive
export const toggleCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
    coupon.isActive = !coupon.isActive;
    await coupon.save();
    res.json({ success: true, coupon });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete coupon
export const deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Coupon deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Validate coupon (used at checkout)
export const validateCoupon = async (req, res) => {
  try {
    const { code, orderTotal, clerkUserId } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) return res.status(404).json({ success: false, message: 'Invalid coupon code' });
    if (new Date() > coupon.expiryDate) return res.status(400).json({ success: false, message: 'Coupon has expired' });
    if (orderTotal < coupon.minOrder) return res.status(400).json({ success: false, message: `Minimum order amount is ₹${coupon.minOrder}` });

    // Check if user already used this coupon
    if (clerkUserId && coupon.usedBy.includes(clerkUserId)) {
      return res.status(400).json({ success: false, message: 'You have already used this coupon' });
    }

    const discount = coupon.discountType === 'percentage'
      ? Math.min(
          Math.round((orderTotal * coupon.discountValue) / 100),
          coupon.maxDiscount ?? Infinity
        )
      : coupon.discountValue;

    res.json({ success: true, coupon, discount, finalTotal: orderTotal - discount });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
