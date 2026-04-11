import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

console.log("🧪 Testing Email Configuration...\n");
console.log("📧 Email User:", process.env.EMAIL_USER);
console.log("🔑 Password Length:", process.env.EMAIL_PASS?.length || 0);

// Detect provider
const getProvider = (email) => {
  if (!email) return 'unknown';
  if (email.includes('@gmail.com')) return 'Gmail';
  if (email.includes('@outlook.com') || email.includes('@hotmail.com') || email.includes('@live.com')) return 'Outlook';
  if (email.includes('@yahoo.com')) return 'Yahoo';
  return 'Custom';
};

const provider = getProvider(process.env.EMAIL_USER);
console.log("📮 Provider:", provider);

// Get SMTP config
const getSMTPConfig = () => {
  const email = process.env.EMAIL_USER;
  
  if (email?.includes('@gmail.com')) {
    return { host: "smtp.gmail.com", port: 587, secure: false };
  }
  if (email?.includes('@outlook.com') || email?.includes('@hotmail.com') || email?.includes('@live.com')) {
    return { host: "smtp-mail.outlook.com", port: 587, secure: false };
  }
  if (email?.includes('@yahoo.com')) {
    return { host: "smtp.mail.yahoo.com", port: 587, secure: false };
  }
  return { host: "smtp.gmail.com", port: 587, secure: false };
};

const smtpConfig = getSMTPConfig();
console.log("🌐 SMTP Host:", smtpConfig.host);
console.log("🔌 Port:", smtpConfig.port);

const transporter = nodemailer.createTransport({
  ...smtpConfig,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

console.log("\n⏳ Connecting to SMTP server...\n");

transporter.verify(function (error, success) {
  if (error) {
    console.log("❌ CONNECTION FAILED!");
    console.log("Error:", error.message);
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🔧 SOLUTION: Switch to Outlook (Works Immediately!)");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n✅ OUTLOOK SETUP (5 minutes):");
    console.log("1. Go to: https://outlook.live.com/owa/");
    console.log("2. Click 'Create free account'");
    console.log("3. Choose email: yourname@outlook.com");
    console.log("4. Set a password");
    console.log("5. Complete signup");
    console.log("\n6. Update backend/.env:");
    console.log("   EMAIL_USER=yourname@outlook.com");
    console.log("   EMAIL_PASS=your_password");
    console.log("\n7. Restart server: npm start");
    console.log("\n💡 Outlook works with regular password - no app password needed!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    process.exit(1);
  } else {
    console.log("✅ CONNECTION SUCCESSFUL!");
    console.log(`${provider} is ready to send emails.\n`);
    
    console.log("📨 Sending test email to:", process.env.EMAIL_USER);
    
    const mailOptions = {
      from: `"Jelwo Jewelry" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "✅ Email System Working - Jelwo Jewelry",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #28a745; text-align: center;">✅ Success!</h2>
          <p style="color: #555; font-size: 16px;">Your email system is working perfectly!</p>
          
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
            <h1 style="color: #667eea; letter-spacing: 5px; margin: 0;">123456</h1>
            <p style="color: #666; margin-top: 10px;">Sample OTP Code</p>
          </div>
          
          <p style="color: #555; font-size: 14px;">Your customers will receive OTP codes like this when they sign up or reset their password.</p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">© 2024 Jelwo Jewelry</p>
        </div>
      `,
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("❌ Failed to send test email:", error.message);
      } else {
        console.log("✅ Test email sent successfully!");
        console.log("📬 Check inbox:", process.env.EMAIL_USER);
        console.log("\n🎉 Your OTP system is ready!\n");
        console.log("Next steps:");
        console.log("1. Start backend: npm start");
        console.log("2. Try signing up with a new email");
        console.log("3. Check the email inbox for OTP\n");
      }
      process.exit(0);
    });
  }
});
