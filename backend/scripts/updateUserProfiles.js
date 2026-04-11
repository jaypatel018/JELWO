import mongoose from "mongoose";
import User from "../modal/userModal.js";
import dotenv from "dotenv";

dotenv.config();

const updateUserProfiles = async () => {
  try {
    console.log("🔄 Updating User Profiles with Complete Structure...\n");

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Connected to MongoDB\n");

    // Get all users
    const users = await User.find({});
    console.log(`📊 Found ${users.length} users\n`);

    if (users.length === 0) {
      console.log("ℹ️  No users to update");
      process.exit(0);
    }

    let updatedCount = 0;

    for (const user of users) {
      let needsUpdate = false;
      const updates = {};

      // Ensure isVerified field exists
      if (user.isVerified === undefined) {
        updates.isVerified = true; // Mark existing users as verified
        needsUpdate = true;
      }

      // Ensure isActive field exists
      if (user.isActive === undefined) {
        updates.isActive = true;
        needsUpdate = true;
      }

      // Ensure accountStatus exists
      if (!user.accountStatus) {
        updates.accountStatus = "active";
        needsUpdate = true;
      }

      // Ensure address object exists
      if (!user.address) {
        updates.address = {
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: ""
        };
        needsUpdate = true;
      }

      // Ensure preferences exist
      if (!user.preferences) {
        updates.preferences = {
          newsletter: true,
          notifications: true
        };
        needsUpdate = true;
      }

      // Ensure loginAttempts exists
      if (user.loginAttempts === undefined) {
        updates.loginAttempts = 0;
        needsUpdate = true;
      }

      // Update user if needed
      if (needsUpdate) {
        await User.updateOne({ _id: user._id }, { $set: updates });
        console.log(`✅ Updated: ${user.email}`);
        updatedCount++;
      } else {
        console.log(`⏭️  Skipped: ${user.email} (already complete)`);
      }
    }

    console.log("\n" + "=".repeat(80));
    console.log(`\n✅ Update Complete!`);
    console.log(`📊 Total Users: ${users.length}`);
    console.log(`🔄 Updated: ${updatedCount}`);
    console.log(`⏭️  Skipped: ${users.length - updatedCount}`);
    console.log("\n" + "=".repeat(80));

    // Verify updates
    console.log("\n🔍 Verifying updates...\n");
    const verifiedUsers = await User.find({});
    
    verifiedUsers.forEach((user, index) => {
      console.log(`User ${index + 1}: ${user.email}`);
      console.log(`  ✅ isVerified: ${user.isVerified}`);
      console.log(`  ✅ isActive: ${user.isActive}`);
      console.log(`  ✅ accountStatus: ${user.accountStatus}`);
      console.log(`  ✅ address: ${user.address ? 'Set' : 'Not set'}`);
      console.log(`  ✅ preferences: ${user.preferences ? 'Set' : 'Not set'}`);
      console.log("");
    });

    console.log("✅ All users now have complete profile structure!\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

updateUserProfiles();
