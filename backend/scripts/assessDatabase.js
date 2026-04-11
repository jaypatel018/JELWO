import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../modal/userModal.js";
import Product from "../modal/Product.js";
import Jewelry from "../modal/jewelry.js";
import Customer from "../modal/customerModal.js";
import Admin from "../modal/admin.js";

dotenv.config();

// Script to assess and display database information

const assessDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Connected to MongoDB\n");
    console.log("=" .repeat(60));
    console.log("DATABASE ASSESSMENT REPORT");
    console.log("=" .repeat(60));
    console.log(`Database: ${mongoose.connection.name}`);
    console.log(`Host: ${mongoose.connection.host}`);
    console.log(`Port: ${mongoose.connection.port}\n`);

    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("📊 COLLECTIONS FOUND:");
    console.log("-" .repeat(60));
    collections.forEach((col, index) => {
      console.log(`${index + 1}. ${col.name}`);
    });
    console.log();

    // Users Collection
    console.log("👥 USERS COLLECTION:");
    console.log("-" .repeat(60));
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const unverifiedUsers = await User.countDocuments({ isVerified: false });
    const usersWithoutVerification = await User.countDocuments({ 
      isVerified: { $exists: false } 
    });
    
    console.log(`Total Users: ${totalUsers}`);
    console.log(`Verified Users: ${verifiedUsers}`);
    console.log(`Unverified Users: ${unverifiedUsers}`);
    console.log(`Users without verification field: ${usersWithoutVerification}`);
    
    // Sample users
    const sampleUsers = await User.find().select("name email isVerified createdAt").limit(5);
    if (sampleUsers.length > 0) {
      console.log("\nSample Users:");
      sampleUsers.forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.name} (${user.email}) - Verified: ${user.isVerified || 'N/A'}`);
      });
    }
    console.log();

    // Products Collection
    console.log("🛍️  PRODUCTS COLLECTION:");
    console.log("-" .repeat(60));
    const totalProducts = await Product.countDocuments();
    console.log(`Total Products: ${totalProducts}`);
    
    const sampleProducts = await Product.find().select("title price discount rating").limit(5);
    if (sampleProducts.length > 0) {
      console.log("\nSample Products:");
      sampleProducts.forEach((product, index) => {
        console.log(`  ${index + 1}. ${product.title} - Price: $${product.price} (${product.discount}% off)`);
      });
    }
    console.log();

    // Jewelry/Categories Collection
    console.log("💎 JEWELRY/CATEGORIES COLLECTION:");
    console.log("-" .repeat(60));
    const totalJewelry = await Jewelry.countDocuments();
    console.log(`Total Categories: ${totalJewelry}`);
    
    const sampleJewelry = await Jewelry.find().select("name item").limit(5);
    if (sampleJewelry.length > 0) {
      console.log("\nSample Categories:");
      sampleJewelry.forEach((jewelry, index) => {
        console.log(`  ${index + 1}. ${jewelry.name} - Items: ${jewelry.item}`);
      });
    }
    console.log();

    // Customers Collection
    console.log("⭐ CUSTOMERS/TESTIMONIALS COLLECTION:");
    console.log("-" .repeat(60));
    const totalCustomers = await Customer.countDocuments();
    console.log(`Total Customer Reviews: ${totalCustomers}`);
    
    const sampleCustomers = await Customer.find().select("name rating").limit(5);
    if (sampleCustomers.length > 0) {
      console.log("\nSample Reviews:");
      sampleCustomers.forEach((customer, index) => {
        console.log(`  ${index + 1}. ${customer.name} - Rating: ${customer.rating}/5`);
      });
    }
    console.log();

    // Admins Collection
    console.log("🔐 ADMINS COLLECTION:");
    console.log("-" .repeat(60));
    const totalAdmins = await Admin.countDocuments();
    console.log(`Total Admins: ${totalAdmins}`);
    
    const sampleAdmins = await Admin.find().select("email").limit(5);
    if (sampleAdmins.length > 0) {
      console.log("\nAdmin Accounts:");
      sampleAdmins.forEach((admin, index) => {
        console.log(`  ${index + 1}. ${admin.email}`);
      });
    }
    console.log();

    // Database Size
    console.log("💾 DATABASE STATISTICS:");
    console.log("-" .repeat(60));
    const stats = await mongoose.connection.db.stats();
    console.log(`Database Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Storage Size: ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Indexes: ${stats.indexes}`);
    console.log(`Index Size: ${(stats.indexSize / 1024 / 1024).toFixed(2)} MB`);
    console.log();

    // Issues & Recommendations
    console.log("⚠️  ISSUES & RECOMMENDATIONS:");
    console.log("-" .repeat(60));
    
    if (usersWithoutVerification > 0) {
      console.log(`❌ ${usersWithoutVerification} users don't have isVerified field`);
      console.log("   → Run: node scripts/migrateExistingUsers.js");
    }
    
    if (unverifiedUsers > 0) {
      console.log(`⚠️  ${unverifiedUsers} users are unverified`);
      console.log("   → They need to verify their email to login");
    }
    
    if (totalAdmins === 0) {
      console.log("❌ No admin accounts found");
      console.log("   → Create an admin account to access admin panel");
    }
    
    if (totalProducts === 0) {
      console.log("⚠️  No products in database");
      console.log("   → Add products through admin panel");
    }
    
    if (totalJewelry === 0) {
      console.log("⚠️  No categories in database");
      console.log("   → Add categories through admin panel");
    }

    console.log();
    console.log("=" .repeat(60));
    console.log("✅ Assessment Complete!");
    console.log("=" .repeat(60));

    process.exit(0);
  } catch (error) {
    console.error("❌ Assessment failed:", error);
    process.exit(1);
  }
};

// Run assessment
assessDatabase();