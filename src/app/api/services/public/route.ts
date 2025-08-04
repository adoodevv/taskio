import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Service from '@/models/Service';
import User from '@/models/User';

// GET - Fetch all active services for public display
export async function GET(request: NextRequest) {
   try {
      await connectDB();

      // Get query parameters for filtering
      const { searchParams } = new URL(request.url);
      const category = searchParams.get('category');
      const search = searchParams.get('search');

      // Build query for active services
      let query: any = { isActive: true };

      // Add category filter if provided
      if (category && category !== 'all') {
         query.category = category;
      }

      // Add search filter if provided
      if (search) {
         query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { tags: { $in: [new RegExp(search, 'i')] } }
         ];
      }

      // Fetch services with taskio information
      const services = await Service.find(query)
         .populate('taskioId', 'name profilePicture')
         .sort({ createdAt: -1 })
         .lean();

      // Transform the data to include taskio information
      const transformedServices = services.map(service => ({
         _id: service._id,
         title: service.title,
         category: service.category,
         tags: service.tags,
         description: service.description,
         serviceImage: service.serviceImage,
         pricingModel: service.pricingModel,
         priceRange: service.priceRange,
         isNegotiable: service.isNegotiable,
         location: service.location,
         experience: service.experience,
         additionalInfo: service.additionalInfo,
         taskio: {
            _id: service.taskioId._id,
            name: service.taskioId.name,
            profilePicture: service.taskioId.profilePicture
         },
         createdAt: service.createdAt
      }));

      return NextResponse.json(
         {
            message: 'Services fetched successfully',
            services: transformedServices
         },
         { status: 200 }
      );

   } catch (error) {
      console.error('Fetch public services error:', error);
      return NextResponse.json(
         { error: 'Internal server error' },
         { status: 500 }
      );
   }
} 