import express from "express";
import {signupUser, loginUser, getAllUsers, verifyOTP, resendOTP, forgotPassword, resetPassword, getUserByEmail, upsertUserProfile, getWishlist, saveWishlist, getCart, saveCart, newsletterSubscribe} from "../controller/userController.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/", getAllUsers);
router.get("/profile/:email", getUserByEmail);
router.post("/profile/upsert", upsertUserProfile);
router.get("/wishlist/:email", getWishlist);
router.post("/wishlist/:email", saveWishlist);
router.get("/cart/:email", getCart);
router.post("/cart/:email", saveCart);
router.post("/newsletter-subscribe", newsletterSubscribe);

export default router;