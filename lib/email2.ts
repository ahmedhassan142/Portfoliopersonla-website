import nodemailer from 'nodemailer';

interface EmailOptions {
  email: string;
  subject: string;
  text: string;
  html?: string;
}

// Create transporter with your Gmail configuration
const createTransporter = () => {
  const smtpUser = process.env.SMTP_USER || "ah770643@gmail.com";
  const smtpPass = process.env.SMTP_PASS || "tzhixkiirkcpahrq";

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    pool: true,
    maxConnections: 5,
    maxMessages: 10,
  });
};

// Main sendEmail function
export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const transporter = createTransporter();
  const smtpUser = process.env.SMTP_USER || "ah770643@gmail.com";
  
  const mailOptions = {
    from: `"Tech Solutions" <${smtpUser}>`,
    to: options.email,
    subject: options.subject,
    text: options.text,
    html: options.html || options.text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', options.email);
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

// Confirmation email for contact form
export const sendContactConfirmation = async (contact: any) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank You for Contacting Us</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background: white;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 {
          color: white;
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .header p {
          color: rgba(255,255,255,0.9);
          margin: 10px 0 0;
          font-size: 16px;
        }
        .content {
          padding: 40px 30px;
          background: white;
        }
        .info-box {
          background: #f8f9fa;
          border-left: 4px solid #667eea;
          padding: 20px;
          margin: 20px 0;
          border-radius: 8px;
        }
        .info-box h3 {
          margin: 0 0 15px;
          color: #333;
          font-size: 18px;
        }
        .info-item {
          display: flex;
          margin-bottom: 10px;
          padding: 8px 0;
          border-bottom: 1px solid #e0e0e0;
        }
        .info-item:last-child {
          border-bottom: none;
        }
        .info-label {
          font-weight: 600;
          width: 120px;
          color: #667eea;
        }
        .info-value {
          flex: 1;
          color: #555;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-decoration: none;
          border-radius: 25px;
          font-weight: 600;
          margin-top: 20px;
          transition: transform 0.3s;
        }
        .button:hover {
          transform: translateY(-2px);
        }
        .footer {
          background: #f8f9fa;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #e0e0e0;
        }
        .footer p {
          margin: 5px 0;
          color: #666;
          font-size: 14px;
        }
        .social-links {
          margin: 20px 0;
        }
        .social-links a {
          display: inline-block;
          margin: 0 10px;
          color: #667eea;
          text-decoration: none;
        }
        @media only screen and (max-width: 600px) {
          .container {
            margin: 10px;
            border-radius: 10px;
          }
          .header {
            padding: 30px 20px;
          }
          .content {
            padding: 30px 20px;
          }
          .info-item {
            flex-direction: column;
          }
          .info-label {
            width: 100%;
            margin-bottom: 5px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Thank You for Contacting Us!</h1>
          <p>We've received your message and will get back to you soon.</p>
        </div>
        
        <div class="content">
          <p>Dear <strong>${contact.name}</strong>,</p>
          <p>Thank you for reaching out to Tech Solutions. We have received your inquiry and our team will review it shortly.</p>
          
          <div class="info-box">
            <h3>📋 Your Submission Details:</h3>
            <div class="info-item">
              <span class="info-label">Service:</span>
              <span class="info-value">${contact.service || 'Not specified'}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Budget Range:</span>
              <span class="info-value">${contact.budget || 'Not specified'}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Company:</span>
              <span class="info-value">${contact.company || 'Not provided'}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Phone:</span>
              <span class="info-value">${contact.phone || 'Not provided'}</span>
            </div>
          </div>
          
          <div class="info-box">
            <h3>📝 Your Message:</h3>
            <p style="font-style: italic; color: #555;">"${contact.message}"</p>
          </div>
          
          <p><strong>What happens next?</strong></p>
          <ul style="color: #555; margin-bottom: 30px;">
            <li>✅ Our team will review your requirements within 24 hours</li>
            <li>✅ You'll receive a personalized response via email</li>
            <li>✅ We may schedule a call to discuss your project in detail</li>
          </ul>
          
          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/portfolio" class="button">
              Browse Our Portfolio
            </a>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>Tech Solutions</strong></p>
          <p>Building digital solutions that drive success</p>
          <div class="social-links">
            <a href="#">Twitter</a> •
            <a href="#">LinkedIn</a> •
            <a href="#">GitHub</a>
          </div>
          <p style="font-size: 12px; color: #999;">
            This is an automated message. Please do not reply directly to this email.
          </p>
          <p style="font-size: 12px; color: #999;">
            © ${new Date().getFullYear()} Tech Solutions. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Thank You for Contacting Us!
    
    Dear ${contact.name},
    
    Thank you for reaching out to Tech Solutions. We have received your inquiry and our team will review it shortly.
    
    Your Submission Details:
    - Service: ${contact.service || 'Not specified'}
    - Budget Range: ${contact.budget || 'Not specified'}
    - Company: ${contact.company || 'Not provided'}
    - Phone: ${contact.phone || 'Not provided'}
    
    Your Message:
    "${contact.message}"
    
    What happens next?
    - Our team will review your requirements within 24 hours
    - You'll receive a personalized response via email
    - We may schedule a call to discuss your project in detail
    
    Browse Our Portfolio: ${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/portfolio
    
    Best regards,
    Tech Solutions Team
  `;

  return sendEmail({
    email: contact.email,
    subject: 'Thank You for Contacting Tech Solutions',
    text,
    html,
  });
};

// Notification email for admin
export const sendAdminNotification = async (contact: any) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 20px auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 20px; border-radius: 0 0 10px 10px; }
        .info-item { margin: 10px 0; padding: 10px; background: white; border-radius: 5px; }
        .label { font-weight: bold; color: #667eea; }
        .badge { background: #28a745; color: white; padding: 5px 10px; border-radius: 15px; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>🔔 New Contact Form Submission</h2>
          <p>Received at ${new Date().toLocaleString()}</p>
        </div>
        
        <div class="content">
          <div class="info-item">
            <div class="label">👤 Name:</div>
            <div>${contact.name}</div>
          </div>
          
          <div class="info-item">
            <div class="label">📧 Email:</div>
            <div>${contact.email}</div>
          </div>
          
          <div class="info-item">
            <div class="label">📞 Phone:</div>
            <div>${contact.phone || 'Not provided'}</div>
          </div>
          
          <div class="info-item">
            <div class="label">🏢 Company:</div>
            <div>${contact.company || 'Not provided'}</div>
          </div>
          
          <div class="info-item">
            <div class="label">🛠️ Service:</div>
            <div>${contact.service || 'Not specified'}</div>
          </div>
          
          <div class="info-item">
            <div class="label">💰 Budget:</div>
            <div>${contact.budget || 'Not specified'}</div>
          </div>
          
          <div class="info-item">
            <div class="label">📝 Message:</div>
            <div>${contact.message}</div>
          </div>
          
          <div class="info-item">
            <div class="label">🌐 IP Address:</div>
            <div>${contact.ipAddress || 'Unknown'}</div>
          </div>
          
          <div class="info-item">
            <div class="label">🔧 User Agent:</div>
            <div style="font-size: 12px;">${contact.userAgent || 'Unknown'}</div>
          </div>
          
          <div style="margin-top: 20px; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_URL}/admin/contacts" style="background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              View in Admin Panel
            </a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    New Contact Form Submission
    
    Name: ${contact.name}
    Email: ${contact.email}
    Phone: ${contact.phone || 'Not provided'}
    Company: ${contact.company || 'Not provided'}
    Service: ${contact.service || 'Not specified'}
    Budget: ${contact.budget || 'Not specified'}
    Message: ${contact.message}
    IP: ${contact.ipAddress || 'Unknown'}
    
    View in Admin Panel: ${process.env.NEXT_PUBLIC_URL}/admin/contacts
  `;

  const adminEmail = process.env.ADMIN_EMAIL || 'ah770643@gmail.com';

  return sendEmail({
    email: adminEmail,
    subject: `New Contact Form Submission from ${contact.name}`,
    text,
    html,
  });
};