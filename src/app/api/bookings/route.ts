import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Service from '@/models/Service';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';
import mongoose from 'mongoose';

// GET - Fetch bookings for the authenticated user
export async function GET(request: NextRequest) {
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

      // Get query parameters
      const { searchParams } = new URL(request.url);
      const role = searchParams.get('role'); // 'customer' or 'taskio'

      let query: any = {};

      try {
         if (role === 'taskio') {
            // Fetch bookings where user is the taskio
            query.taskioId = new mongoose.Types.ObjectId(decoded.userId);
         } else {
            // Fetch bookings where user is the customer (default)
            query.customerId = new mongoose.Types.ObjectId(decoded.userId);
         }
      } catch (objectIdError) {
         return NextResponse.json(
            { error: 'Invalid user ID format' },
            { status: 400 }
         );
      }

      // Fetch bookings with populated service and user information
      const bookings = await Booking.find(query)
         .populate('serviceId', 'title category serviceImage')
         .populate('taskioId', 'name profilePicture')
         .populate('customerId', 'name profilePicture')
         .sort({ createdAt: -1 })
         .lean();

      // Transform the data with error handling
      const transformedBookings = bookings.map(booking => {
         try {
            // Check if required populated fields exist
            if (!booking.serviceId || typeof booking.serviceId === 'string') {
               return null;
            }
            if (!booking.taskioId || typeof booking.taskioId === 'string') {
               return null;
            }
            if (!booking.customerId || typeof booking.customerId === 'string') {
               return null;
            }

            return {
               _id: booking._id,
               service: {
                  _id: booking.serviceId._id,
                  title: booking.serviceId.title,
                  category: booking.serviceId.category,
                  serviceImage: booking.serviceId.serviceImage,
               },
               taskio: {
                  _id: booking.taskioId._id,
                  name: booking.taskioId.name,
                  profilePicture: booking.taskioId.profilePicture,
               },
               customer: {
                  _id: booking.customerId._id,
                  name: booking.customerId.name,
                  profilePicture: booking.customerId.profilePicture,
               },
               price: booking.price,
               quantity: booking.quantity,
               totalPrice: booking.totalPrice,
               bookingDate: booking.bookingDate,
               bookingTime: booking.bookingTime,
               address: booking.address,
               city: booking.city,
               state: booking.state,
               zipCode: booking.zipCode,
               specialInstructions: booking.specialInstructions,
               contactPhone: booking.contactPhone,
               contactEmail: booking.contactEmail,
               status: booking.status,
               createdAt: booking.createdAt,
               updatedAt: booking.updatedAt,
            };
         } catch (transformError) {
            return null;
         }
      }).filter(booking => booking !== null); // Remove any null bookings

      return NextResponse.json(
         {
            message: 'Bookings fetched successfully',
            bookings: transformedBookings
         },
         { status: 200 }
      );

   } catch (error) {
      console.error('Fetch bookings error:', error);
      return NextResponse.json(
         { error: 'Internal server error' },
         { status: 500 }
      );
   }
}

// POST - Create a new booking
export async function POST(request: NextRequest) {
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

      const bookingData = await request.json();

      // Validate required fields
      const requiredFields = [
         'serviceId', 'taskioId', 'price', 'quantity', 'totalPrice',
         'bookingDate', 'bookingTime', 'address', 'city', 'state', 'zipCode',
         'contactPhone', 'contactEmail'
      ];

      for (const field of requiredFields) {
         if (!bookingData[field]) {
            return NextResponse.json(
               { error: `${field} is required` },
               { status: 400 }
            );
         }
      }

      // Verify the service exists and is active
      const service = await Service.findById(bookingData.serviceId);
      if (!service) {
         return NextResponse.json(
            { error: 'Service not found' },
            { status: 404 }
         );
      }

      if (!service.isActive) {
         return NextResponse.json(
            { error: 'Service is not available for booking' },
            { status: 400 }
         );
      }

      // Verify the taskio exists
      if (service.taskioId.toString() !== bookingData.taskioId) {
         return NextResponse.json(
            { error: 'Invalid taskio for this service' },
            { status: 400 }
         );
      }

      // Validate price is within service range
      if (bookingData.price < service.priceRange.min || bookingData.price > service.priceRange.max) {
         return NextResponse.json(
            { error: 'Price is outside the allowed range' },
            { status: 400 }
         );
      }

      // Validate total price calculation
      const expectedTotal = bookingData.price * bookingData.quantity;
      if (Math.abs(bookingData.totalPrice - expectedTotal) > 0.01) {
         return NextResponse.json(
            { error: 'Total price calculation is incorrect' },
            { status: 400 }
         );
      }

      // Create new booking
      const booking = new Booking({
         ...bookingData,
         customerId: decoded.userId,
         status: 'pending'
      });

      await booking.save();

      // Populate the booking with service and user information
      const populatedBooking = await Booking.findById(booking._id)
         .populate('serviceId', 'title category serviceImage')
         .populate('taskioId', 'name profilePicture')
         .populate('customerId', 'name profilePicture')
         .lean();

      return NextResponse.json(
         {
            message: 'Booking created successfully',
            booking: populatedBooking
         },
         { status: 201 }
      );

   } catch (error) {
      console.error('Create booking error:', error);
      return NextResponse.json(
         { error: 'Internal server error' },
         { status: 500 }
      );
   }
} 