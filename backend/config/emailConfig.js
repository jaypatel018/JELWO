import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Check if Gmail is configured
const isConfigured = process.env.EMAIL_USER && process.env.EMAIL_PASS;

let transporter = null;

if (isConfigured) {
  // Gmail SMTP Configuration
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Verify Gmail connection
  transporter.verify(function (error, success) {
    if (error) {
      console.log("❌ Gmail SMTP Error:", error.message);
      console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("🔧 GMAIL SETUP REQUIRED:");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("1. Enable 2-Step Verification:");
      console.log("   https://myaccount.google.com/security");
      console.log("\n2. Generate App Password:");
      console.log("   https://myaccount.google.com/apppasswords");
      console.log("   - Select: Mail");
      console.log("   - Device: Other (Custom) → 'Jelwo Jewelry'");
      console.log("   - Copy the 16-character password");
      console.log("\n3. Update backend/.env:");
      console.log("   EMAIL_USER=your_gmail@gmail.com");
      console.log("   EMAIL_PASS=your_16_char_app_password");
      console.log("\n4. Restart server");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    } else {
      console.log("✅ Gmail SMTP Ready");
      console.log("📧 Sender Email:", process.env.EMAIL_USER);
      console.log("📨 OTP emails will be sent to users' Gmail accounts\n");
    }
  });
} else {
  console.log("⚠️  Gmail not configured!");
  console.log("Please set EMAIL_USER and EMAIL_PASS in backend/.env file\n");
}

// Send OTP Email to User's Gmail
export const sendOTPEmail = async (email, otp, name) => {
  if (!isConfigured) {
    console.error("❌ Gmail not configured. Cannot send OTP.");
    return { success: false, error: "Email service not configured" };
  }

  const mailOptions = {
    from: `"Jelwo Jewelry" <${process.env.EMAIL_USER}>`,
    to: email, // User's email address
    subject: "Verify Your Email - Jelwo Jewelry",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Jelwo Jewelry</h1>
                    <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Email Verification</p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px;">Welcome, ${name}!</h2>
                    <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Thank you for signing up with Jelwo Jewelry. To complete your registration, please verify your email address using the OTP code below:
                    </p>
                    
                    <!-- OTP Box -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                      <tr>
                        <td align="center" style="background-color: #f8f9fa; padding: 30px; border-radius: 8px; border: 2px dashed #667eea;">
                          <p style="color: #666666; font-size: 14px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">Your OTP Code</p>
                          <h1 style="color: #667eea; font-size: 42px; margin: 0; letter-spacing: 8px; font-weight: bold;">${otp}</h1>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 20px 0;">
                      <strong>Important:</strong> This OTP is valid for <strong>10 minutes</strong>. Please do not share this code with anyone.
                    </p>
                    
                    <p style="color: #999999; font-size: 13px; line-height: 1.6; margin: 20px 0 0 0;">
                      If you didn't request this verification, please ignore this email or contact our support team.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
                    <p style="color: #999999; font-size: 12px; margin: 0 0 10px 0;">
                      © 2024 Jelwo Jewelry. All rights reserved.
                    </p>
                    <p style="color: #999999; font-size: 12px; margin: 0;">
                      This is an automated email. Please do not reply.
                    </p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ OTP Email Sent Successfully");
    console.log("📧 To:", email);
    console.log("🔑 OTP:", otp);
    console.log("📬 Message ID:", info.messageId);
    return { success: true };
  } catch (error) {
    console.error("❌ Failed to send OTP email:", error.message);
    return { success: false, error: error.message };
  }
};

export default transporter;

// Send Order Confirmation + Invoice Email
export const sendOrderConfirmationEmail = async (order) => {
  if (!isConfigured) {
    console.error("❌ Gmail not configured. Cannot send order confirmation.");
    return { success: false };
  }

  const email = order.customerInfo?.email;
  const name = `${order.customerInfo?.firstName || ''} ${order.customerInfo?.lastName || ''}`.trim() || 'Customer';
  const addr = order.shippingAddress || {};

  const itemsHtml = (order.products || []).map(p => `
    <tr>
      <td style="padding:10px 8px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#333">${p.title}</td>
      <td style="padding:10px 8px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#333;text-align:center">${p.quantity}</td>
      <td style="padding:10px 8px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#333;text-align:right">₹${p.price}</td>
      <td style="padding:10px 8px;border-bottom:1px solid #f0f0f0;font-size:14px;font-weight:600;color:#1a1a2e;text-align:right">₹${p.price * p.quantity}</td>
    </tr>`).join('');

  const mailOptions = {
    from: `"Jelwo Jewelry" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `✅ Order Confirmed - #${order.orderNumber} | Jelwo Jewelry`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
      <body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f4f6f9;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:24px 0;">
          <tr><td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.08);">

              <!-- Header -->
              <tr>
                <td style="background:#1a1a2e;padding:36px 40px;text-align:center;">
                  <h1 style="color:#fff;margin:0;font-size:26px;letter-spacing:2px;">JELWO</h1>
                  <p style="color:#a0aec0;margin:6px 0 0;font-size:13px;letter-spacing:1px;">FINE JEWELLERY</p>
                </td>
              </tr>

              <!-- Success banner -->
              <tr>
                <td style="background:#f0fdf4;padding:24px 40px;text-align:center;border-bottom:1px solid #dcfce7;">
                  <p style="font-size:28px;margin:0;">✅</p>
                  <h2 style="color:#15803d;margin:8px 0 4px;font-size:20px;">Order Confirmed!</h2>
                  <p style="color:#166534;margin:0;font-size:14px;">Thank you, ${name}. Your order has been placed successfully.</p>
                </td>
              </tr>

              <!-- Order info -->
              <tr>
                <td style="padding:28px 40px 0;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="background:#f8fafc;border-radius:8px;padding:16px 20px;">
                        <p style="margin:0 0 6px;font-size:13px;color:#64748b;">ORDER NUMBER</p>
                        <p style="margin:0;font-size:18px;font-weight:700;color:#1a1a2e;">#${order.orderNumber}</p>
                      </td>
                      <td width="16"></td>
                      <td style="background:#f8fafc;border-radius:8px;padding:16px 20px;">
                        <p style="margin:0 0 6px;font-size:13px;color:#64748b;">ORDER DATE</p>
                        <p style="margin:0;font-size:15px;font-weight:600;color:#1a1a2e;">${new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN',{year:'numeric',month:'long',day:'numeric'})}</p>
                      </td>
                      <td width="16"></td>
                      <td style="background:#f8fafc;border-radius:8px;padding:16px 20px;">
                        <p style="margin:0 0 6px;font-size:13px;color:#64748b;">STATUS</p>
                        <p style="margin:0;font-size:15px;font-weight:600;color:#f59e0b;text-transform:capitalize;">${order.status}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Products table -->
              <tr>
                <td style="padding:28px 40px 0;">
                  <h3 style="margin:0 0 14px;font-size:15px;color:#1a1a2e;border-bottom:2px solid #f0f0f0;padding-bottom:10px;">Order Items</h3>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <thead>
                      <tr style="background:#f8fafc;">
                        <th style="padding:10px 8px;font-size:12px;color:#64748b;text-align:left;font-weight:600;text-transform:uppercase;">Product</th>
                        <th style="padding:10px 8px;font-size:12px;color:#64748b;text-align:center;font-weight:600;text-transform:uppercase;">Qty</th>
                        <th style="padding:10px 8px;font-size:12px;color:#64748b;text-align:right;font-weight:600;text-transform:uppercase;">Price</th>
                        <th style="padding:10px 8px;font-size:12px;color:#64748b;text-align:right;font-weight:600;text-transform:uppercase;">Total</th>
                      </tr>
                    </thead>
                    <tbody>${itemsHtml}</tbody>
                  </table>

                  <!-- Totals -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
                    <tr>
                      <td style="font-size:13px;color:#64748b;padding:4px 8px;">Subtotal</td>
                      <td style="font-size:13px;color:#333;text-align:right;padding:4px 8px;">₹${order.subtotal}</td>
                    </tr>
                    <tr>
                      <td style="font-size:13px;color:#64748b;padding:4px 8px;">Shipping</td>
                      <td style="font-size:13px;color:#333;text-align:right;padding:4px 8px;">${order.shippingCost === 0 ? 'FREE' : '₹' + order.shippingCost}</td>
                    </tr>
                    <tr style="border-top:2px solid #f0f0f0;">
                      <td style="font-size:16px;font-weight:700;color:#1a1a2e;padding:10px 8px 4px;">Total</td>
                      <td style="font-size:16px;font-weight:700;color:#1a1a2e;text-align:right;padding:10px 8px 4px;">₹${order.total}</td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Shipping address -->
              <tr>
                <td style="padding:24px 40px 0;">
                  <h3 style="margin:0 0 12px;font-size:15px;color:#1a1a2e;border-bottom:2px solid #f0f0f0;padding-bottom:10px;">Shipping Address</h3>
                  <p style="margin:0;font-size:14px;color:#374151;line-height:1.8;">
                    ${addr.firstName || ''} ${addr.lastName || ''}<br/>
                    ${addr.address || ''}${addr.apartment ? ', ' + addr.apartment : ''}<br/>
                    ${addr.city || ''}, ${addr.state || ''} - ${addr.pinCode || ''}<br/>
                    ${addr.country || ''}
                  </p>
                </td>
              </tr>

              <!-- Payment info -->
              <tr>
                <td style="padding:24px 40px 28px;">
                  <h3 style="margin:0 0 12px;font-size:15px;color:#1a1a2e;border-bottom:2px solid #f0f0f0;padding-bottom:10px;">Payment</h3>
                  <p style="margin:0;font-size:14px;color:#374151;">
                    Method: <strong>${(order.paymentInfo?.method || 'razorpay').toUpperCase()}</strong> &nbsp;|&nbsp;
                    Status: <strong style="color:#15803d;">${order.paymentInfo?.status || 'completed'}</strong>
                  </p>
                  ${order.paymentInfo?.razorpayPaymentId ? `<p style="margin:6px 0 0;font-size:12px;color:#94a3b8;">Payment ID: ${order.paymentInfo.razorpayPaymentId}</p>` : ''}
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#f8fafc;padding:24px 40px;text-align:center;border-top:1px solid #e5e7eb;">
                  <p style="color:#64748b;font-size:13px;margin:0 0 6px;">Questions? Contact us at <a href="mailto:${process.env.EMAIL_USER}" style="color:#1a1a2e;">${process.env.EMAIL_USER}</a></p>
                  <p style="color:#94a3b8;font-size:12px;margin:0;">© ${new Date().getFullYear()} Jelwo Jewelry. All rights reserved.</p>
                </td>
              </tr>

            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Order confirmation email sent to ${email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to send order confirmation email:', error.message);
    return { success: false, error: error.message };
  }
};

// Send Coupon Announcement Email to all users
export const sendCouponAnnouncementEmail = async (coupon, users) => {
  if (!isConfigured) return { success: false };

  const discountText = coupon.discountType === 'percentage'
    ? `${coupon.discountValue}% OFF${coupon.maxDiscount ? ` (up to ₹${coupon.maxDiscount})` : ''}`
    : `Flat ₹${coupon.discountValue} OFF`;

  const minOrderText = coupon.minOrder > 0
    ? `on orders above ₹${coupon.minOrder}`
    : 'on all orders';

  const expiryText = new Date(coupon.expiryDate).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  const results = await Promise.allSettled(users.map(user => {
    const mailOptions = {
      from: `"Jelwo Jewelry" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `🎉 Exclusive Offer Just for You — ${coupon.code} | Jelwo Jewelry`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
        <body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f4f6f9;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:24px 0;">
            <tr><td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.08);">

                <!-- Header -->
                <tr>
                  <td style="background:#1a1a2e;padding:36px 40px;text-align:center;">
                    <h1 style="color:#fff;margin:0;font-size:26px;letter-spacing:2px;">JELWO</h1>
                    <p style="color:#a0aec0;margin:6px 0 0;font-size:13px;letter-spacing:1px;">FINE JEWELLERY</p>
                  </td>
                </tr>

                <!-- Hero Banner -->
                <tr>
                  <td style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:40px;text-align:center;">
                    <p style="font-size:40px;margin:0;">🎁</p>
                    <h2 style="color:#fff;margin:12px 0 6px;font-size:26px;">Exclusive Offer Inside!</h2>
                    <p style="color:#e0d7ff;margin:0;font-size:15px;">A special discount just for you, ${user.name || 'Valued Customer'}</p>
                  </td>
                </tr>

                <!-- Coupon Box -->
                <tr>
                  <td style="padding:36px 40px;text-align:center;">
                    <p style="color:#374151;font-size:16px;margin:0 0 20px;">Use this exclusive coupon code at checkout:</p>

                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center">
                          <div style="display:inline-block;background:#f8f4ff;border:2px dashed #764ba2;border-radius:12px;padding:24px 40px;">
                            <p style="color:#764ba2;font-size:13px;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">Your Coupon Code</p>
                            <h1 style="color:#1a1a2e;font-size:36px;margin:0;letter-spacing:6px;font-weight:800;">${coupon.code}</h1>
                            <p style="color:#16a34a;font-size:18px;font-weight:700;margin:10px 0 0;">${discountText}</p>
                            <p style="color:#6b7280;font-size:13px;margin:6px 0 0;">${minOrderText}</p>
                          </div>
                        </td>
                      </tr>
                    </table>

                    <p style="color:#ef4444;font-size:13px;margin:20px 0 0;">
                      ⏰ Valid until <strong>${expiryText}</strong>
                    </p>
                  </td>
                </tr>

                <!-- CTA Button -->
                <tr>
                  <td style="padding:0 40px 36px;text-align:center;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/showmore"
                       style="display:inline-block;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;text-decoration:none;padding:16px 40px;border-radius:50px;font-size:16px;font-weight:700;letter-spacing:0.5px;">
                      Shop Now &rarr;
                    </a>
                    <p style="color:#9ca3af;font-size:12px;margin:16px 0 0;">Tap the button or visit jelwo.com to start shopping</p>
                  </td>
                </tr>

                <!-- How to use -->
                <tr>
                  <td style="background:#f8fafc;padding:24px 40px;border-top:1px solid #e5e7eb;">
                    <h3 style="color:#1a1a2e;font-size:14px;margin:0 0 14px;text-transform:uppercase;letter-spacing:0.5px;">How to use your coupon</h3>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:6px 0;font-size:13px;color:#374151;">
                          <span style="background:#667eea;color:#fff;border-radius:50%;width:20px;height:20px;display:inline-block;text-align:center;line-height:20px;font-size:11px;font-weight:700;margin-right:8px;">1</span>
                          Browse our jewellery collection
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-size:13px;color:#374151;">
                          <span style="background:#667eea;color:#fff;border-radius:50%;width:20px;height:20px;display:inline-block;text-align:center;line-height:20px;font-size:11px;font-weight:700;margin-right:8px;">2</span>
                          Add your favourite items to cart
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-size:13px;color:#374151;">
                          <span style="background:#667eea;color:#fff;border-radius:50%;width:20px;height:20px;display:inline-block;text-align:center;line-height:20px;font-size:11px;font-weight:700;margin-right:8px;">3</span>
                          Enter <strong>${coupon.code}</strong> at checkout to save!
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
                    <p style="color:#94a3b8;font-size:12px;margin:0;">© ${new Date().getFullYear()} Jelwo Jewelry. All rights reserved.</p>
                    <p style="color:#94a3b8;font-size:11px;margin:4px 0 0;">You received this email because you are a registered Jelwo customer.</p>
                  </td>
                </tr>

              </table>
            </td></tr>
          </table>
        </body>
        </html>
      `,
    };
    return transporter.sendMail(mailOptions);
  }));

  const sent = results.filter(r => r.status === 'fulfilled').length;
  console.log(`✅ Coupon announcement sent to ${sent}/${users.length} users`);
  return { success: true, sent };
};
