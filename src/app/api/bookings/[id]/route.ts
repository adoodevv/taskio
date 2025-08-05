import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

// PATCH - Update a booking (mainly for status updates)
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

      const { id: bookingId } = await params;
      const updateData = await request.json();

      // Find the booking
      const booking = await Booking.findById(bookingId);
      if (!booking) {
         return NextResponse.json(
            { error: 'Booking not found' },
            { status: 404 }
         );
      }

      // Check if user is authorized to update this booking
      // Only the taskio who owns the service can update the booking status
      if (booking.taskioId.toString() !== decoded.userId) {
         return NextResponse.json(
            { error: 'You are not authorized to update this booking' },
            { status: 403 }
         );
      }

      // Validate status update if it's a status change
      if (updateData.status) {
         const validStatuses = ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'];
         if (!validStatuses.includes(updateData.status)) {
            return NextResponse.json(
               { error: 'Invalid status' },
               { status: 400 }
            );
         }

         // Validate status transitions
         const currentStatus = booking.status;
         const newStatus = updateData.status;

         // Define allowed status transitions
         const allowedTransitions: { [key: string]: string[] } = {
            'pending': ['confirmed', 'cancelled'],
            'confirmed': ['in-progress', 'cancelled'],
            'in-progress': ['completed', 'cancelled'],
            'completed': [], // No further transitions allowed
            'cancelled': [] // No further transitions allowed
         };

         if (!allowedTransitions[currentStatus].includes(newStatus)) {
            return NextResponse.json(
               { error: `Cannot transition from ${currentStatus} to ${newStatus}` },
               { status: 400 }
            );
         }
      }

      // Update the booking
      const updatedBooking = await Booking.findByIdAndUpdate(
         bookingId,
         updateData,
         { new: true }
      ).populate('serviceId', 'title category serviceImage')
         .populate('taskioId', 'name profilePicture')
         .populate('customerId', 'name profilePicture')
         .lean();

      return NextResponse.json(
         {
            message: 'Booking updated successfully',
            success: true,
            booking: updatedBooking
         },
         { status: 200 }
      );

   } catch (error) {
      console.error('Update booking error:', error);
      return NextResponse.json(
         { error: 'Internal server error' },
         { status: 500 }
      );
   }
}

// GET - Fetch a specific booking
export async function GET(
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

      const { id: bookingId } = await params;

      // Find the booking and populate related data
      const booking = await Booking.findById(bookingId)
         .populate('serviceId', 'title category serviceImage')
         .populate('taskioId', 'name profilePicture')
         .populate('customerId', 'name profilePicture')
         .lean();

      if (!booking) {
         return NextResponse.json(
            { error: 'Booking not found' },
            { status: 404 }
         );
      }

      // Check if user is authorized to view this booking
      // Users can only view bookings they're involved in (as taskio or customer)
      const taskioId = (booking as any).taskioId?._id?.toString() || (booking as any).taskioId?.toString();
      const customerId = (booking as any).customerId?._id?.toString() || (booking as any).customerId?.toString();

      if (taskioId !== decoded.userId && customerId !== decoded.userId) {
         return NextResponse.json(
            { error: 'You are not authorized to view this booking' },
            { status: 403 }
         );
      }

      return NextResponse.json(
         {
            message: 'Booking fetched successfully',
            booking: booking
         },
         { status: 200 }
      );

   } catch (error) {
      console.error('Fetch booking error:', error);
      return NextResponse.json(
         { error: 'Internal server error' },
         { status: 500 }
      );
   }
} 