import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Service from '@/models/Service';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

// GET - Fetch all services for a taskio
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

      // Check if user is a taskio
      if (decoded.role !== 'taskio') {
         return NextResponse.json(
            { error: 'Only taskios can manage services' },
            { status: 403 }
         );
      }

      // Fetch all services for this taskio
      const services = await Service.find({ taskioId: decoded.userId }).sort({ createdAt: -1 });

      return NextResponse.json(
         {
            message: 'Services fetched successfully',
            services
         },
         { status: 200 }
      );

   } catch (error) {
      console.error('Fetch services error:', error);
      return NextResponse.json(
         { error: 'Internal server error' },
         { status: 500 }
      );
   }
}

// POST - Create a new service
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

      // Check if user is a taskio
      if (decoded.role !== 'taskio') {
         return NextResponse.json(
            { error: 'Only taskios can create services' },
            { status: 403 }
         );
      }

      const serviceData = await request.json();

      // Validate required fields
      const requiredFields = ['title', 'category', 'description', 'pricingModel', 'priceRange'];
      for (const field of requiredFields) {
         if (!serviceData[field]) {
            return NextResponse.json(
               { error: `${field} is required` },
               { status: 400 }
            );
         }
      }

      // Validate price range
      if (serviceData.priceRange.min > serviceData.priceRange.max) {
         return NextResponse.json(
            { error: 'Minimum price cannot be greater than maximum price' },
            { status: 400 }
         );
      }

      // Create new service
      const service = new Service({
         ...serviceData,
         taskioId: decoded.userId,
      });

      await service.save();

      return NextResponse.json(
         {
            message: 'Service created successfully',
            service
         },
         { status: 201 }
      );

   } catch (error) {
      console.error('Create service error:', error);
      return NextResponse.json(
         { error: 'Internal server error' },
         { status: 500 }
      );
   }
} 