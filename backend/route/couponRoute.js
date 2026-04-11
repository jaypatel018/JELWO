import express from 'express';
import {
  getAllCoupons, getActiveCoupons, createCoupon,
  updateCoupon, toggleCoupon, deleteCoupon, validateCoupon
} from '../controller/couponController.js';

const router = express.Router();

router.get('/', getAllCoupons);
router.get('/active', getActiveCoupons);
router.post('/', createCoupon);
router.put('/:id', updateCoupon);
router.patch('/:id/toggle', toggleCoupon);
router.delete('/:id', deleteCoupon);
router.post('/validate', validateCoupon);

export default router;
