import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Create transporter
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

export async function POST(request: NextRequest) {
  try {
    const { name, email, service, message } = await request.json();
    const transporter = createTransporter();
    const smtpUser = process.env.SMTP_USER || "ah770643@gmail.com";

    // Send confirmation to user
    const userMailOptions = {
      from: `Tech Solutions <${smtpUser}>`,
      to: email,
      subject: 'Thank you for contacting Tech Solutions',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Thank You for Contacting Tech Solutions!</h1>
          <p>Hi ${name},</p>
          <p>We've received your inquiry about <strong>${service}</strong> services and will get back to you within 24 hours.</p>
          <p><strong>Your message:</strong></p>
          <blockquote style="border-left: 4px solid #2563eb; padding-left: 16px; margin-left: 0;">
            ${message}
          </blockquote>
          <p>In the meantime, you can:</p>
          <ul>
            <li>Browse our portfolio: <a href="https://techsolutions.dev/portfolio">techsolutions.dev/portfolio</a></li>
            <li>Read our blog: <a href="https://techsolutions.dev/blog">techsolutions.dev/blog</a></li>
            <li>Schedule a call: <a href="https://cal.com/techservices">cal.com/techservices</a></li>
          </ul>
          <p>Best regards,<br>The Tech Solutions Team</p>
        </div>
      `,
      text: `Thank you for contacting Tech Solutions! We've received your inquiry about ${service} services and will get back to you within 24 hours.`,
    };

    // Send notification to admin
    const adminMailOptions = {
      from: `Tech Solutions <${smtpUser}>`,
      to: 'admin@techsolutions.dev',
      subject: 'New Contact Form Submission',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Service:</strong> ${service}</p>
          <p><strong>Message:</strong> ${message}</p>
          <p><a href="https://techsolutions.dev/admin">View in Dashboard</a></p>
        </div>
      `,
    };

    // Send both emails
    const [userResult, adminResult] = await Promise.all([
      transporter.sendMail(userMailOptions),
      transporter.sendMail(adminMailOptions)
    ]);

    console.log(`✅ Confirmation email sent to ${email}:`, userResult.messageId);
    console.log(`✅ Notification email sent to admin:`, adminResult.messageId);

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
    });
    
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to send email',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}