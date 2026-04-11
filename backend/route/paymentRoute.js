import express from 'express';
import { createRazorpayOrder, verifyPayment, createCODOrder } from '../controller/paymentController.js';

const router = express.Router();

router.post('/create-order', createRazorpayOrder);
router.post('/verify', verifyPayment);
router.post('/cod', createCODOrder);

export default router;
