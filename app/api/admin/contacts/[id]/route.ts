import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../../lib/db';
import Contact from '../../../../../models/Contact';
import { verifyAdmin } from '../../../../../lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await verifyAdmin(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    const { id } = params;
    const updates = await request.json();
    
    const contact = await Contact.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );
    
    if (!contact) {
      return NextResponse.json(
        { success: false, message: 'Contact not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Contact updated successfully',
      data: contact,
    });
    
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to update contact' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await verifyAdmin(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    const { id } = params;
    await Contact.findByIdAndDelete(id);
    
    return NextResponse.json({
      success: true,
      message: 'Contact deleted successfully',
    });
    
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to delete contact' },
      { status: 500 }
    );
  }
}