import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { name, email, service, message } = await request.json();
    
    const emailData = await resend.emails.send({
      from: 'Tech Solutions <no-reply@techsolutions.dev>',
      to: [email],
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
    });
    
    // Also send notification to admin
    await resend.emails.send({
      from: 'Tech Solutions <no-reply@techsolutions.dev>',
      to: ['admin@techsolutions.dev'],
      subject: 'New Contact Form Submission',
      html: `
        <div>
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Service:</strong> ${service}</p>
          <p><strong>Message:</strong> ${message}</p>
          <p><a href="https://techsolutions.dev/admin">View in Dashboard</a></p>
        </div>
      `,
    });
    
    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
    });
    
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send email' },
      { status: 500 }
    );
  }
}