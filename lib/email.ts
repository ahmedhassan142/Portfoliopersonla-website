import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER||"ah770643@gmail.com",
    pass: process.env.SMTP_PASS||"tzhixkiirkcpahrq",
  },
});

export async function sendQuoteConfirmation(quote: any) {
  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@techsolutions.com',
    to: quote.email,
    subject: 'Quote Request Received - Tech Solutions',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Thank You for Your Quote Request!</h2>
        <p>Hi ${quote.name},</p>
        <p>We've received your quote request for a <strong>${quote.projectType}</strong> project.</p>
        
        <div style="background-color: #F3F4F6; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Request Summary:</h3>
          <p><strong>Project Type:</strong> ${quote.projectType}</p>
          <p><strong>Business Size:</strong> ${quote.businessSize}</p>
          <p><strong>Timeline:</strong> ${quote.timeline}</p>
          <p><strong>Budget Range:</strong> ${quote.budget}</p>
          ${quote.estimatedPrice ? `<p><strong>Estimated Price:</strong> $${quote.estimatedPrice.toLocaleString()}</p>` : ''}
        </div>
        
        <p>Our team will review your requirements and get back to you within <strong>24 hours</strong> with a detailed quote.</p>
        
        <p>In the meantime, feel free to:</p>
        <ul>
          <li>Check out our <a href="${process.env.NEXT_PUBLIC_URL}/portfolio">portfolio</a></li>
          <li>Read our <a href="${process.env.NEXT_PUBLIC_URL}/blog">blog</a> for insights</li>
          <li>Schedule a <a href="${process.env.NEXT_PUBLIC_URL}/contact">call</a> with our team</li>
        </ul>
        
        <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 20px 0;" />
        
        <p style="color: #6B7280; font-size: 14px;">
          Best regards,<br />
          The Tech Solutions Team<br />
          <a href="${process.env.NEXT_PUBLIC_URL}">${process.env.NEXT_PUBLIC_URL}</a>
        </p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

export async function sendQuoteNotification(quote: any) {
  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@techsolutions.com',
    to: process.env.ADMIN_EMAIL || 'admin@techsolutions.com',
    subject: 'New Quote Request Received',
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>New Quote Request</h2>
        <p><strong>From:</strong> ${quote.name} (${quote.email})</p>
        <p><strong>Phone:</strong> ${quote.phone || 'Not provided'}</p>
        <p><strong>Company:</strong> ${quote.companyName || 'Not provided'}</p>
        <p><strong>Project Type:</strong> ${quote.projectType}</p>
        <p><strong>Business Size:</strong> ${quote.businessSize}</p>
        <p><strong>Timeline:</strong> ${quote.timeline}</p>
        <p><strong>Budget:</strong> ${quote.budget}</p>
        <p><strong>Features:</strong> ${quote.features?.join(', ') || 'None selected'}</p>
        <p><strong>Requirements:</strong> ${quote.requirements || 'Not provided'}</p>
        <p><strong>Estimated Price:</strong> $${quote.estimatedPrice?.toLocaleString() || 'Not calculated'}</p>
        <p><strong>View Details:</strong> <a href="${process.env.NEXT_PUBLIC_URL}/admin/quotes/${quote._id}">Click here</a></p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}