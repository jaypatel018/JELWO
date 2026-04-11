import mongoose from "mongoose";
import User from "../modal/userModal.js";
import dotenv from "dotenv";

dotenv.config();

const verifyDatabase = async () => {
  try {
    console.log("🔍 Verifying MongoDB Database Structure...\n");

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Connected to MongoDB\n");

    // Get all users
    const users = await User.find({});
    console.log(`📊 Total Users: ${users.length}\n`);

    if (users.length === 0) {
      console.log("ℹ️  No users found in database");
      console.log("✅ Database structure is ready for new users\n");
      process.exit(0);
    }

    // Check user structure
    console.log("👥 User Details:\n");
    console.log("=".repeat(80));

    users.forEach((user, index) => {
      console.log(`\nUser ${index + 1}:`);
      console.log("  Name:", user.name || "Not set");
      console.log("  Email:", user.email);
      console.log("  Phone:", user.phone || "Not set");
      console.log("  Verified:", user.isVerified ? "✅ Yes" : "❌ No");
      console.log("  Active:", user.isActive ? "✅ Yes" : "❌ No");
      console.log("  Account Status:", user.accountStatus);
      console.log("  Address:", user.address?.street ? "✅ Set" : "❌ Not set");
      console.log("  Created:", new Date(user.createdAt).toLocaleDateString());
      console.log("  Last Login:", user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never");
    });

    console.log("\n" + "=".repeat(80));

    // Check for users missing profile fields
    const usersNeedingUpdate = users.filter(user => 
      !user.address || 
      !user.address.street || 
      user.isVerified === undefined ||
      user.isActive === undefined
    );

    if (usersNeedingUpdate.length > 0) {
      console.log(`\n⚠️  ${usersNeedingUpdate.length} users need profile field updates`);
      console.log("\nWould you like to update them? Run: npm run update-users");
    } else {
      console.log("\n✅ All users have complete profile structure");
    }

    // Display schema fields
    console.log("\n📋 Available Profile Fields:");
    console.log("=".repeat(80));
    console.log("✅ name - User's full name");
    console.log("✅ email - User's email address");
    console.log("✅ phone - Phone number (optional)");
    console.log("✅ address - Complete address object:");
    console.log("   - street");
    console.log("   - city");
    console.log("   - state");
    console.log("   - zipCode");
    console.log("   - country");
    console.log("✅ avatar - Profile picture URL");
    console.log("✅ isVerified - Email verification status");
    console.log("✅ isActive - Account active status");
    console.log("✅ accountStatus - active/suspended/deleted");
    console.log("✅ preferences - Newsletter and notification settings");
    console.log("✅ createdAt - Account creation date");
    console.log("✅ updatedAt - Last update date");
    console.log("✅ lastLogin - Last login timestamp");
    console.log("=".repeat(80));

    console.log("\n✅ Database verification complete!\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

verifyDatabase();
