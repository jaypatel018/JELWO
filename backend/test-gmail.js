import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

console.log("🧪 Testing Gmail SMTP Configuration...\n");
console.log("📧 Email:", process.env.EMAIL_USER);
console.log("🔑 Password:", process.env.EMAIL_PASS ? `${process.env.EMAIL_PASS.substring(0, 4)}...` : "NOT SET");
console.log("");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

console.log("⏳ Testing connection...\n");

transporter.verify(function (error, success) {
  if (error) {
    console.log("❌ CONNECTION FAILED!");
    console.log("Error:", error.message);
    console.log("\n" + "=".repeat(70));
    console.log("🔧 SOLUTION:");
    console.log("=".repeat(70));
    console.log("\n1. Go to: https://myaccount.google.com/security");
    console.log("   - Make sure 2-Step Verification is ON");
    console.log("\n2. Go to: https://myaccount.google.com/apppasswords");
    console.log("   - If you don't see this option, 2-Step is not enabled");
    console.log("   - Select: Mail");
    console.log("   - Device: Other (Custom) → Type 'Jelwo'");
    console.log("   - Click Generate");
    console.log("   - Copy the 16-character password");
    console.log("\n3. Update backend/.env:");
    console.log("   EMAIL_PASS=your_new_16_char_password");
    console.log("\n4. Run this test again: node test-gmail.js");
    console.log("=".repeat(70) + "\n");
    process.exit(1);
  } else {
    console.log("✅ CONNECTION SUCCESSFUL!");
    console.log("Gmail SMTP is working correctly.\n");
    
    // Send test email
    console.log("📨 Sending test email to:", process.env.EMAIL_USER);
    
    const mailOptions = {
      from: `"Jelwo Jewelry" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "✅ Gmail SMTP Test - Jelwo Jewelry",
      html: `
        <div style="font-family: Arial; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #28a745;">✅ Success!</h2>
          <p>Your Gmail SMTP is configured correctly.</p>
          <p>OTP emails will now be sent to users when they:</p>
          <ul>
            <li>Sign up for a new account</li>
            <li>Request password reset</li>
          </ul>
          <hr>
          <p style="color: #666; font-size: 12px;">Test email from Jelwo Jewelry OTP System</p>
        </div>
      `,
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("❌ Failed to send test email:", error.message);
      } else {
        console.log("✅ Test email sent successfully!");
        console.log("📬 Check your inbox:", process.env.EMAIL_USER);
        console.log("\n🎉 Your OTP system is ready to use!\n");
      }
      process.exit(0);
    });
  }
});
