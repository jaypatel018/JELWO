import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
   // Basic Information
   name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"]
   },
   email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"]
   },
   password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"]
   },
   
   // Phone (Optional - for future SMS OTP)
   phone: {
      type: String,
      trim: true,
      default: null
   },
   phoneCode: {
      type: String,
      trim: true,
      default: '+91'
   },
   
   // Email Verification
   isVerified: {
      type: Boolean,
      default: false,
      index: true
   },
   otp: {
      type: String,
      select: false // Don't return OTP in queries by default
   },
   otpExpiry: {
      type: Date,
      select: false
   },
   verifiedAt: {
      type: Date,
      default: null
   },
   
   // Account Status
   isActive: {
      type: Boolean,
      default: true,
      index: true
   },
   accountStatus: {
      type: String,
      enum: ["active", "suspended", "deleted"],
      default: "active"
   },
   
   // Login Tracking
   lastLogin: {
      type: Date,
      default: null
   },
   loginAttempts: {
      type: Number,
      default: 0
   },
   lockUntil: {
      type: Date,
      default: null
   },
   
   // Profile Information (Optional)
   avatar: {
      type: String,
      default: null
   },
   birthDD: { type: String, default: null },
   birthMM: { type: String, default: null },
   birthYYYY: { type: String, default: null },
   gender: { type: String, enum: ['Male', 'Female', 'Other', null], default: null },
   address: {
      street: String,
      addressLine2: String,
      company: String,
      city: String,
      district: String,
      state: String,
      zipCode: String,
      country: String
   },
   
   // Password Reset
   resetPasswordToken: {
      type: String,
      select: false
   },
   resetPasswordExpiry: {
      type: Date,
      select: false
   },
   
   // Wishlist (stores product IDs)
   wishlist: {
      type: [String],
      default: []
   },

   // Cart (stores product IDs with quantities)
   cart: {
      type: [
         {
            productId: { type: String, required: true },
            qty: { type: Number, default: 1 }
         }
      ],
      default: []
   },

   // Preferences
   preferences: {
      newsletter: {
         type: Boolean,
         default: true
      },
      notifications: {
         type: Boolean,
         default: true
      }
   },
   newsletterSubscribed: {
      type: Boolean,
      default: false
   }
}, {
   timestamps: true, // Adds createdAt and updatedAt automatically
   toJSON: { 
      virtuals: true,
      transform: function(doc, ret) {
         delete ret.password; // Never return password in JSON
         delete ret.__v;
         return ret;
      }
   }
});

// Indexes for better query performance
userSchema.index({ isVerified: 1, isActive: 1 });
userSchema.index({ createdAt: -1 });

// Virtual for account locked status
userSchema.virtual('isLocked').get(function() {
   return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Method to check if account is locked
userSchema.methods.isAccountLocked = function() {
   return this.lockUntil && this.lockUntil > Date.now();
};

// Method to increment login attempts
userSchema.methods.incrementLoginAttempts = function() {
   // Reset attempts if lock has expired
   if (this.lockUntil && this.lockUntil < Date.now()) {
      return this.updateOne({
         $set: { loginAttempts: 1 },
         $unset: { lockUntil: 1 }
      });
   }
   
   // Increment attempts
   const updates = { $inc: { loginAttempts: 1 } };
   
   // Lock account after 5 failed attempts for 2 hours
   const maxAttempts = 5;
   const lockTime = 2 * 60 * 60 * 1000; // 2 hours
   
   if (this.loginAttempts + 1 >= maxAttempts && !this.isAccountLocked()) {
      updates.$set = { lockUntil: Date.now() + lockTime };
   }
   
   return this.updateOne(updates);
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = function() {
   return this.updateOne({
      $set: { loginAttempts: 0, lastLogin: Date.now() },
      $unset: { lockUntil: 1 }
   });
};

const User = mongoose.model("User", userSchema);
export default User;