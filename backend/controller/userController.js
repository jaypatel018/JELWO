import  User  from "../modal/userModal.js";
import bcrypt from "bcryptjs";
import { sendOTPEmail, sendNewsletterWelcomeEmail } from "../config/emailConfig.js";
import OrderDetails from "../modal/OrderDetails.js";

// this file handle the logic for sign up and login

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

//Sign up logic - Step 1: Create user and send OTP
export const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //  Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({ message: "Email already registered" });
      } else {
        // User exists but not verified, resend OTP
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        console.log(`🔄 Resending OTP to existing user: ${email}`);
        console.log(`📧 OTP: ${otp}`);

        existingUser.otp = otp;
        existingUser.otpExpiry = otpExpiry;
        existingUser.password = await bcrypt.hash(password, 10);
        existingUser.name = name;
        await existingUser.save();

        // Send OTP email
        const emailResult = await sendOTPEmail(email, otp, name);
        if (!emailResult.success) {
          return res.status(500).json({ message: "Failed to send OTP email. Please check your email configuration." });
        }

        return res.status(200).json({ 
          message: "OTP resent to your email", 
          email: email 
        });
      }
    }

    //  Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    console.log(`✨ New user signup: ${email}`);
    console.log(`📧 Generated OTP: ${otp}`);

    //  Save user to database (not verified yet)
    const newUser = new User({ 
      name, 
      email, 
      password: hashedPassword,
      otp,
      otpExpiry,
      isVerified: false
    });
    await newUser.save();

    // Send OTP email
    const emailResult = await sendOTPEmail(email, otp, name);
    if (!emailResult.success) {
      return res.status(500).json({ message: "Failed to send OTP email. Please check your email configuration." });
    }

    res.status(201).json({ 
      message: "Signup successful! Please check your email for OTP verification.", 
      email: email 
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Verify OTP - Step 2: Verify the OTP sent to email
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find user (include OTP fields)
    const user = await User.findOne({ email }).select("+otp +otpExpiry");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    // Check if OTP matches
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check if OTP expired
    if (new Date() > user.otpExpiry) {
      return res.status(400).json({ message: "OTP expired. Please request a new one." });
    }

    // Mark user as verified
    user.isVerified = true;
    user.verifiedAt = new Date();
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully! You can now login." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Resend OTP
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user (include OTP fields)
    const user = await User.findOne({ email }).select("+otp +otpExpiry");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP email
    const emailResult = await sendOTPEmail(email, otp, user.name);
    if (!emailResult.success) {
      return res.status(500).json({ message: "Failed to send OTP email" });
    }

    res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//login logic

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email (include password and OTP fields for verification)
    const user = await User.findOne({ email }).select("+password +otp +otpExpiry");
    if (!user) return res.status(400).json({ message: "User not found" });

    // Check if account is locked
    if (user.isAccountLocked()) {
      const lockTimeRemaining = Math.ceil((user.lockUntil - Date.now()) / 60000);
      return res.status(423).json({ 
        message: `Account locked due to multiple failed login attempts. Try again in ${lockTimeRemaining} minutes.` 
      });
    }

    // Check if account is active
    if (!user.isActive || user.accountStatus !== "active") {
      return res.status(403).json({ message: "Account is suspended or inactive" });
    }

    // Check if email is verified (allow old users without isVerified field)
    if (user.isVerified === false) {
      return res.status(400).json({ 
        message: "Please verify your email first", 
        needsVerification: true 
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Increment failed login attempts
      await user.incrementLoginAttempts();
      
      const attemptsLeft = 5 - (user.loginAttempts + 1);
      if (attemptsLeft > 0) {
        return res.status(400).json({ 
          message: `Invalid password. ${attemptsLeft} attempts remaining.` 
        });
      } else {
        return res.status(400).json({ 
          message: "Invalid password. Account locked for 2 hours due to multiple failed attempts." 
        });
      }
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts();

    // Remove sensitive fields before sending response
    const { password: pwd, otp, otpExpiry, resetPasswordToken, resetPasswordExpiry, ...userData } = user._doc;

    res.status(200).json({ 
      message: "Login successful", 
      user: userData 
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// get all users with order counts
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").lean();

    // Get order counts per clerkUserId — match by email since Clerk users use email
    const orderCounts = await OrderDetails.aggregate([
      { $group: { _id: "$clerkUserId", count: { $sum: 1 } } }
    ]);
    const orderCountMap = {};
    orderCounts.forEach(o => { orderCountMap[o._id] = o.count; });

    // Also count by customerInfo.email for fallback
    const orderCountsByEmail = await OrderDetails.aggregate([
      { $group: { _id: "$customerInfo.email", count: { $sum: 1 } } }
    ]);
    const orderCountByEmailMap = {};
    orderCountsByEmail.forEach(o => { orderCountByEmailMap[o._id] = o.count; });

    const usersWithOrders = users.map(u => ({
      ...u,
      orderCount: orderCountMap[u.clerkUserId] || orderCountByEmailMap[u.email] || 0
    }));

    res.status(200).json(usersWithOrders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get user by email
export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Upsert user profile (create or update by email - used for Clerk users)
export const upsertUserProfile = async (req, res) => {
  try {
    const { email, name, phone, addressLine1, addressLine2, postalCode, city, state, country, birthDD, birthMM, birthYYYY, gender } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    let user = await User.findOne({ email });

    if (user) {
      if (name) user.name = name;
      if (phone !== undefined) user.phone = phone;
      if (addressLine1 !== undefined) user.address = {
        ...user.address,
        street: addressLine1,
        addressLine2: addressLine2 || '',
        zipCode: postalCode || '',
        city: city || '',
        state: state || '',
        country: country || ''
      };
      if (birthDD !== undefined) user.birthDD = birthDD;
      if (birthMM !== undefined) user.birthMM = birthMM;
      if (birthYYYY !== undefined) user.birthYYYY = birthYYYY;
      if (gender !== undefined) user.gender = gender;
      user.isVerified = true;
      user.lastLogin = new Date(); // update last login on every profile upsert (Clerk sign-in)
      await user.save();
    } else {
      user = new User({
        name: name || 'User',
        email,
        password: await (await import('bcryptjs')).default.hash(Math.random().toString(36), 10),
        phone: phone || null,
        address: {
          street: addressLine1 || '',
          addressLine2: addressLine2 || '',
          zipCode: postalCode || '',
          city: city || '',
          state: state || '',
          country: country || ''
        },
        birthDD: birthDD || null,
        birthMM: birthMM || null,
        birthYYYY: birthYYYY || null,
        gender: gender || null,
        isVerified: true,
        isActive: true,
        accountStatus: 'active'
      });
      await user.save();
    }

    const { password: pwd, ...userData } = user._doc;
    res.status(200).json({ message: "Profile updated successfully", user: userData });
  } catch (error) {
    console.error("Upsert profile error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get wishlist for a user by email
export const getWishlist = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email }).select("wishlist");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ wishlist: user.wishlist || [] });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Save wishlist for a user by email (full replace)
export const saveWishlist = async (req, res) => {
  try {
    const { email } = req.params;
    const { wishlist } = req.body; // array of product IDs
    const user = await User.findOneAndUpdate(
      { email },
      { wishlist: wishlist || [] },
      { new: true, upsert: false }
    ).select("wishlist");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Get cart for a user by email
export const getCart = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email }).select("cart");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ cart: user.cart || [] });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Save cart for a user by email (full replace)
export const saveCart = async (req, res) => {
  try {
    const { email } = req.params;
    const { cart } = req.body; // array of { productId, qty }
    const user = await User.findOneAndUpdate(
      { email },
      { cart: cart || [] },
      { new: true, upsert: false }
    ).select("cart");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({ email }).select("+otp +otpExpiry");
    if (!user) {
      return res.status(400).json({ message: "User not found with this email" });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP email
    const emailResult = await sendOTPEmail(email, otp, user.name);
    if (!emailResult.success) {
      return res.status(500).json({ message: "Failed to send OTP email" });
    }

    res.status(200).json({ 
      message: "OTP sent to your email for password reset",
      email: email 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Reset Password - Step 2: Verify OTP and reset password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Find user
    const user = await User.findOne({ email }).select("+otp +otpExpiry +password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if OTP matches
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check if OTP expired
    if (new Date() > user.otpExpiry) {
      return res.status(400).json({ message: "OTP expired. Please request a new one." });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear OTP
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.loginAttempts = 0; // Reset login attempts
    user.lockUntil = undefined; // Unlock account if locked
    await user.save();

    res.status(200).json({ message: "Password reset successfully! You can now login with your new password." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Newsletter subscribe — send FIRST10 coupon email
export const newsletterSubscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    // Check if user is registered
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'This email is not registered. Please create an account first.' });
    }

    // Check if already subscribed / coupon already sent
    if (user.newsletterSubscribed) {
      return res.status(400).json({ message: 'You have already received your coupon! Use code FIRST10 at checkout.' });
    }

    // Send welcome email with FIRST10 coupon
    await sendNewsletterWelcomeEmail(email);

    // Mark as subscribed
    await User.findByIdAndUpdate(user._id, { newsletterSubscribed: true });

    res.status(200).json({ success: true, message: 'Coupon sent to your email!' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send email' });
  }
};
