import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Service from '@/models/Service';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

// GET - Fetch a specific service
export async function GET(
   request: NextRequest,
   { params }: { params: Promise<{ id: string }> }
) {
   try {
      await connectDB();

      const { id } = await params;
      const service = await Service.findById(id);
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
   { params }: { params: Promise<{ id: string }> }
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

      const { id: serviceId } = await params;
      const updateData = await request.json();

      // Verify the service belongs to the user
      const existingService = await Service.findOne({ _id: serviceId, taskioId: decoded.userId });
      if (!existingService) {
         return NextResponse.json(
            { error: 'Service not found or access denied' },
            { status: 404 }
         );
      }

      // Update the service
      const updatedService = await Service.findByIdAndUpdate(
         serviceId,
         updateData,
         { new: true }
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
   { params }: { params: Promise<{ id: string }> }
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

      const { id: serviceId } = await params;

      // Verify the service belongs to the user
      const existingService = await Service.findOne({ _id: serviceId, taskioId: decoded.userId });
      if (!existingService) {
         return NextResponse.json(
            { error: 'Service not found or access denied' },
            { status: 404 }
         );
      }

      // Delete the service
      await Service.findByIdAndDelete(serviceId);

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