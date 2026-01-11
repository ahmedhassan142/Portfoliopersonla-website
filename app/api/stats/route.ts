import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../lib/db';
import Contact from '../../../models/Contact';
import Project from '../../../models/Project';
import ServiceRequest from '@/models/ServiceRequest';
import { verifyAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '7d';
    
    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (range) {
      case '24h':
        startDate.setHours(now.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }
    
    // Get counts
    const [
      newLeads,
      activeProjects,
      pendingQuotes,
      totalRevenue,
    ] = await Promise.all([
      // New leads in date range
      Contact.countDocuments({
        createdAt: { $gte: startDate },
        status: 'new',
      }),
      
      // Active projects
      Project.countDocuments({ status: 'published' }),
      
      // Pending quotes
      ServiceRequest.countDocuments({
        status: 'quote_sent',
        'quote.status': 'sent',
      }),
      
      // Revenue calculation (example)
      ServiceRequest.aggregate([
        {
          $match: {
            status: 'accepted',
            'quote.status': 'accepted',
            createdAt: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$quote.amount' },
          },
        },
      ]),
    ]);
    
    return NextResponse.json({
      success: true,
      data: {
        newLeads,
        activeProjects,
        pendingQuotes,
        revenue: totalRevenue[0]?.total || 0,
        unreadMessages: 0, // You can implement this based on your logic
      },
    });
    
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}