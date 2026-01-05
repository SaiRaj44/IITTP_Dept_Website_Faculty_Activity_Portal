import { NextResponse } from 'next/server';
import connectMongoDB from '@/app/lib/mongodb';
import Vendor from '@/app/models/asset-management/vendor';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';

export async function GET() {
  try {
    await connectMongoDB();
    const vendors = await Vendor.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: vendors });
  } catch (error) {
    console.error('Error in GET /api/vendors:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vendors' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectMongoDB();
    const data = await request.json();

    // Add user information
    data.createdBy = session.user?.email || 'unknown';

    const vendor = await Vendor.create(data);
    return NextResponse.json(
      { success: true, data: vendor },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/vendors:', error);
    let errorMessage = 'Failed to create vendor';
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes('validation failed')) {
        errorMessage = 'Validation failed: Please check your input data';
        statusCode = 400;
      } else if (error.message.includes('duplicate key')) {
        errorMessage = 'A vendor with this information already exists';
        statusCode = 409;
      }
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: statusCode }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectMongoDB();
    const data = await request.json();
    const { id, ...updateData } = data;

    // Add user information
    updateData.updatedBy = session.user?.email || 'unknown';

    const vendor = await Vendor.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!vendor) {
      return NextResponse.json(
        { success: false, error: 'Vendor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: vendor });
  } catch (error) {
    console.error('Error in PUT /api/vendors:', error);
    let errorMessage = 'Failed to update vendor';
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes('validation failed')) {
        errorMessage = 'Validation failed: Please check your input data';
        statusCode = 400;
      }
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: statusCode }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Vendor ID is required' },
        { status: 400 }
      );
    }

    await connectMongoDB();
    const vendor = await Vendor.findByIdAndDelete(id);

    if (!vendor) {
      return NextResponse.json(
        { success: false, error: 'Vendor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Vendor deleted successfully' }
    );
  } catch (error) {
    console.error('Error in DELETE /api/vendors:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete vendor' },
      { status: 500 }
    );
  }
}
