import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Service from '@/models/Service';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

// GET - Fetch a specific service
export async function GET(
   request: NextRequest,
   { params }: { params: { id: string } }
) {
   try {
      await connectDB();

      const service = await Service.findById(params.id);
      if (!service) {
         return NextResponse.json(
            { error: 'Service not found' },
            { status: 404 }
         );
      }

      return NextResponse.json(
         {
            message: 'Service fetched successfully',
            service
         },
         { status: 200 }
      );

   } catch (error) {
      console.error('Fetch service error:', error);
      return NextResponse.json(
         { error: 'Internal server error' },
         { status: 500 }
      );
   }
}

// PATCH - Update a service
export async function PATCH(
   request: NextRequest,
   { params }: { params: { id: string } }
) {
   try {
      await connectDB();

      // Extract token from Authorization header
      const authorization = request.headers.get('authorization');
      const token = extractTokenFromHeader(authorization || undefined);

      if (!token) {
         return NextResponse.json(
            { error: 'No token provided' },
            { status: 401 }
         );
      }

      // Verify token
      const decoded = verifyToken(token);
      if (!decoded) {
         return NextResponse.json(
            { error: 'Invalid or expired token' },
            { status: 401 }
         );
      }

      // Check if user is a taskio
      if (decoded.role !== 'taskio') {
         return NextResponse.json(
            { error: 'Only taskios can update services' },
            { status: 403 }
         );
      }

      const updateData = await request.json();

      // Find the service and verify ownership
      const service = await Service.findById(params.id);
      if (!service) {
         return NextResponse.json(
            { error: 'Service not found' },
            { status: 404 }
         );
      }

      if (service.taskioId.toString() !== decoded.userId) {
         return NextResponse.json(
            { error: 'You can only update your own services' },
            { status: 403 }
         );
      }

      // Validate price range if provided
      if (updateData.priceRange) {
         if (updateData.priceRange.min > updateData.priceRange.max) {
            return NextResponse.json(
               { error: 'Minimum price cannot be greater than maximum price' },
               { status: 400 }
            );
         }
      }

      // Update the service
      const updatedService = await Service.findByIdAndUpdate(
         params.id,
         updateData,
         { new: true, runValidators: true }
      );

      return NextResponse.json(
         {
            message: 'Service updated successfully',
            service: updatedService
         },
         { status: 200 }
      );

   } catch (error) {
      console.error('Update service error:', error);
      return NextResponse.json(
         { error: 'Internal server error' },
         { status: 500 }
      );
   }
}

// DELETE - Delete a service
export async function DELETE(
   request: NextRequest,
   { params }: { params: { id: string } }
) {
   try {
      await connectDB();

      // Extract token from Authorization header
      const authorization = request.headers.get('authorization');
      const token = extractTokenFromHeader(authorization || undefined);

      if (!token) {
         return NextResponse.json(
            { error: 'No token provided' },
            { status: 401 }
         );
      }

      // Verify token
      const decoded = verifyToken(token);
      if (!decoded) {
         return NextResponse.json(
            { error: 'Invalid or expired token' },
            { status: 401 }
         );
      }

      // Check if user is a taskio
      if (decoded.role !== 'taskio') {
         return NextResponse.json(
            { error: 'Only taskios can delete services' },
            { status: 403 }
         );
      }

      // Find the service and verify ownership
      const service = await Service.findById(params.id);
      if (!service) {
         return NextResponse.json(
            { error: 'Service not found' },
            { status: 404 }
         );
      }

      if (service.taskioId.toString() !== decoded.userId) {
         return NextResponse.json(
            { error: 'You can only delete your own services' },
            { status: 403 }
         );
      }

      // Delete the service
      await Service.findByIdAndDelete(params.id);

      return NextResponse.json(
         {
            message: 'Service deleted successfully'
         },
         { status: 200 }
      );

   } catch (error) {
      console.error('Delete service error:', error);
      return NextResponse.json(
         { error: 'Internal server error' },
         { status: 500 }
      );
   }
} 