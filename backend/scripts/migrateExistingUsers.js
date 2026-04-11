import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../modal/userModal.js";

dotenv.config();

// Script to migrate existing users to the new schema with email verification

const migrateUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Connected to MongoDB");

    // Find all users without isVerified field or where it's undefined
    const usersToUpdate = await User.find({
      $or: [
        { isVerified: { $exists: false } },
        { isVerified: null }
      ]
    });

    console.log(`📊 Found ${usersToUpdate.length} users to migrate`);

    if (usersToUpdate.length === 0) {
      console.log("✅ No users need migration. All users are up to date!");
      process.exit(0);
    }

    // Ask for confirmation
    console.log("\n⚠️  This will mark all existing users as verified.");
    console.log("   New users will still need to verify their email via OTP.\n");

    // Update all existing users to verified
    const result = await User.updateMany(
      {
        $or: [
          { isVerified: { $exists: false } },
          { isVerified: null }
        ]
      },
      {
        $set: { isVerified: true },
        $unset: { otp: "", otpExpiry: "" }
      }
    );

    console.log(`✅ Successfully migrated ${result.modifiedCount} users`);
    console.log("   All existing users can now login without email verification");
    console.log("   New signups will require OTP verification\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
};

// Run migration
migrateUsers();
