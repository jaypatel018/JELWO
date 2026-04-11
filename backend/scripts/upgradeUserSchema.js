import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../modal/userModal.js";

dotenv.config();

// Script to upgrade existing users to new enhanced schema

const upgradeUserSchema = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Connected to MongoDB\n");
    console.log("=" .repeat(60));
    console.log("UPGRADING USER SCHEMA");
    console.log("=" .repeat(60));

    // Find all users
    const users = await User.find({});
    console.log(`📊 Found ${users.length} users to upgrade\n`);

    let upgraded = 0;
    let alreadyUpgraded = 0;

    for (const user of users) {
      let needsUpdate = false;
      const updates = {};

      // Set default values for new fields if they don't exist
      if (user.isActive === undefined) {
        updates.isActive = true;
        needsUpdate = true;
      }

      if (!user.accountStatus) {
        updates.accountStatus = "active";
        needsUpdate = true;
      }

      if (user.loginAttempts === undefined) {
        updates.loginAttempts = 0;
        needsUpdate = true;
      }

      if (user.isVerified === undefined) {
        updates.isVerified = true; // Mark existing users as verified
        updates.verifiedAt = user.createdAt || new Date();
        needsUpdate = true;
      }

      if (!user.preferences) {
        updates.preferences = {
          newsletter: true,
          notifications: true
        };
        needsUpdate = true;
      }

      if (needsUpdate) {
        await User.updateOne({ _id: user._id }, { $set: updates });
        upgraded++;
        console.log(`✅ Upgraded: ${user.name} (${user.email})`);
      } else {
        alreadyUpgraded++;
      }
    }

    console.log("\n" + "=" .repeat(60));
    console.log("UPGRADE SUMMARY");
    console.log("=" .repeat(60));
    console.log(`✅ Successfully upgraded: ${upgraded} users`);
    console.log(`ℹ️  Already up to date: ${alreadyUpgraded} users`);
    console.log(`📊 Total users: ${users.length}`);
    console.log("\n🎉 Schema upgrade complete!");
    console.log("=" .repeat(60));

    process.exit(0);
  } catch (error) {
    console.error("❌ Upgrade failed:", error);
    process.exit(1);
  }
};

// Run upgrade
upgradeUserSchema();
