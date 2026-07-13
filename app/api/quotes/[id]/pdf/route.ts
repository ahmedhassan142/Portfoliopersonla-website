import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Quote from '@/models/Quote';
import mongoose from 'mongoose';
import { jsPDF } from 'jspdf';

// Resolve by Mongo _id or friendly quoteId
async function resolveQuote(id: string) {
  if (mongoose.isValidObjectId(id)) {
    return Quote.findById(id);
  }
  return Quote.findOne({ quoteId: id });
}

const PROJECT_LABELS: Record<string, string> = {
  website: 'Website',
  'mobile-app': 'Mobile App',
  'web-app': 'Web Application',
  'ai-solution': 'AI Solution',
  ecommerce: 'E-commerce',
  custom: 'Custom Project',
};

const BUSINESS_LABELS: Record<string, string> = {
  individual: 'Individual / Freelancer',
  startup: 'Startup',
  small: 'Small Business',
  medium: 'Medium Business',
  enterprise: 'Enterprise',
};

const FEATURE_LABELS: Record<string, string> = {
  responsive: 'Responsive Design',
  seo: 'SEO Optimization',
  cms: 'CMS Integration',
  payment: 'Payment Gateway',
  auth: 'User Authentication',
  analytics: 'Analytics Dashboard',
  api: 'API Integration',
  multilingual: 'Multi-language Support',
};

const TIMELINE_LABELS: Record<string, string> = {
  urgent: 'Urgent (1-2 weeks)',
  '1-month': '1 Month',
  '3-months': '3 Months',
  '6-months': '6 Months',
  flexible: 'Flexible',
};

const BUDGET_LABELS: Record<string, string> = {
  '<5k': 'Under $5,000',
  '5k-10k': '$5,000 - $10,000',
  '10k-25k': '$10,000 - $25,000',
  '25k-50k': '$25,000 - $50,000',
  '50k+': '$50,000+',
  'not-sure': 'Not Sure',
};

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const quote = await resolveQuote(params.id);

    if (!quote) {
      return NextResponse.json(
        { success: false, message: 'Quote not found' },
        { status: 404 },
      );
    }

    // Build PDF
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 48;
    let y = margin;

    // Header band
    doc.setFillColor(37, 99, 235); // blue-600
    doc.rect(0, 0, pageWidth, 90, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('Project Quote', margin, 45);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text('Tech Solutions', pageWidth - margin, 45, { align: 'right' });
    doc.setFontSize(10);
    doc.text(
      `Quote ID: ${quote.quoteId || quote._id}`,
      pageWidth - margin,
      62,
      { align: 'right' },
    );
    doc.text(
      `Date: ${new Date(quote.createdAt || Date.now()).toLocaleDateString()}`,
      pageWidth - margin,
      76,
      { align: 'right' },
    );

    y = 120;
    doc.setTextColor(31, 41, 55); // gray-800

    // Customer info
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('Customer Information', margin, y);
    y += 18;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);

    const customerLines = [
      `Name: ${quote.name || '-'}`,
      `Email: ${quote.email || '-'}`,
      `Phone: ${quote.phone || '-'}`,
      `Company: ${quote.companyName || '-'}`,
      `Industry: ${quote.industry || '-'}`,
    ];
    customerLines.forEach((line) => {
      doc.text(line, margin, y);
      y += 16;
    });

    y += 8;
    // Divider
    doc.setDrawColor(229, 231, 235);
    doc.line(margin, y, pageWidth - margin, y);
    y += 20;

    // Project details
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('Project Details', margin, y);
    y += 18;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);

    const projectLines = [
      `Project Type: ${PROJECT_LABELS[quote.projectType] || quote.projectType}`,
      `Business Size: ${BUSINESS_LABELS[quote.businessSize] || quote.businessSize}`,
      `Timeline: ${TIMELINE_LABELS[quote.timeline] || quote.timeline}`,
      `Budget Range: ${BUDGET_LABELS[quote.budget] || quote.budget}`,
    ];
    projectLines.forEach((line) => {
      doc.text(line, margin, y);
      y += 16;
    });

    // Features
    if (Array.isArray(quote.features) && quote.features.length > 0) {
      y += 6;
      doc.setFont('helvetica', 'bold');
      doc.text('Selected Features:', margin, y);
      y += 16;
      doc.setFont('helvetica', 'normal');
      quote.features.forEach((feature: string) => {
        doc.text(`• ${FEATURE_LABELS[feature] || feature}`, margin + 12, y);
        y += 14;
      });
    }

    // Requirements
    if (quote.requirements) {
      y += 8;
      doc.setFont('helvetica', 'bold');
      doc.text('Additional Requirements:', margin, y);
      y += 16;
      doc.setFont('helvetica', 'normal');
      const wrapped = doc.splitTextToSize(quote.requirements, pageWidth - margin * 2);
      doc.text(wrapped, margin, y);
      y += wrapped.length * 14;
    }

    // Estimate box
    y += 16;
    if (y > pageHeight - 140) {
      doc.addPage();
      y = margin;
    }

    const boxHeight = 80;
    doc.setFillColor(239, 246, 255); // blue-50
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(1);
    doc.roundedRect(margin, y, pageWidth - margin * 2, boxHeight, 8, 8, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(31, 41, 55);
    doc.text('Estimated Project Cost', margin + 20, y + 26);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(37, 99, 235);
    const priceText = `$${Number(quote.estimatedPrice || 0).toLocaleString()}`;
    doc.text(priceText, margin + 20, y + 58);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    doc.text(
      'This is an estimate. Final quote will be provided after detailed discussion.',
      margin + 20,
      y + 72,
    );

    // Footer
    doc.setTextColor(107, 114, 128);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(
      `Generated on ${new Date().toLocaleString()} • Quote valid for 30 days`,
      margin,
      pageHeight - 30,
    );
    doc.text(
      'Thank you for considering Tech Solutions for your project.',
      margin,
      pageHeight - 18,
    );

    // Return as PDF download
    const pdfBytes = doc.output('arraybuffer');
    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="quote-${quote.quoteId || quote._id}.pdf"`,
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Quote PDF generation error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to generate PDF' },
      { status: 500 },
    );
  }
}
