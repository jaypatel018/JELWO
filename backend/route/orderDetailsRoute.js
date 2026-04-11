import express from 'express';
import {
  getAllOrderDetails,
  getUserOrderDetails,
  getOrderDetailById,
  updateOrderDetailStatus,
  cancelOrderDetail,
} from '../controller/orderDetailsController.js';

const router = express.Router();

// Admin - get all orders (must be before /:clerkUserId)
router.get('/all', getAllOrderDetails);

// Specific order routes (must be before /:clerkUserId wildcard)
router.get('/order/:orderId', getOrderDetailById);
router.patch('/order/:orderId/status', updateOrderDetailStatus);
router.patch('/order/:orderId/cancel', cancelOrderDetail);

// Get orders by user (wildcard — must be last)
router.get('/:clerkUserId', getUserOrderDetails);

export default router;
