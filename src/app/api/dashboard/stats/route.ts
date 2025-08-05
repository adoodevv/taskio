import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Service from '@/models/Service';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';
import mongoose from 'mongoose';

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

      const taskioId = decoded.userId;

      // Debug: Check all bookings for this taskio
      const allBookings = await Booking.find({ taskioId: taskioId }).lean();
      console.log('All bookings for taskio:', allBookings.map(b => ({
         id: b._id,
         status: b.status,
         totalPrice: b.totalPrice,
         taskioId: b.taskioId
      })));

      // Get total earnings (sum of completed bookings)
      const earningsResult = await Booking.aggregate([
         {
            $match: {
               taskioId: new mongoose.Types.ObjectId(taskioId),
               status: 'completed'
            }
         },
         {
            $group: {
               _id: null,
               totalEarnings: { $sum: '$totalPrice' }
            }
         }
      ]);

      console.log('Earnings aggregation result:', earningsResult);

      const totalEarnings = earningsResult.length > 0 ? earningsResult[0].totalEarnings : 0;

      // Get active jobs (pending, confirmed, in-progress)
      const activeJobsCount = await Booking.countDocuments({
         taskioId: taskioId,
         status: { $in: ['pending', 'confirmed', 'in-progress'] }
      });

      // Get completed jobs count
      const completedJobsCount = await Booking.countDocuments({
         taskioId: taskioId,
         status: 'completed'
      });

      // Get total services count
      const totalServicesCount = await Service.countDocuments({
         taskioId: taskioId
      });

      // Get recent bookings for activity feed
      const recentBookings = await Booking.find({
         taskioId: taskioId
      })
         .populate('serviceId', 'title')
         .populate('customerId', 'name')
         .sort({ createdAt: -1 })
         .limit(5)
         .lean();

      // Calculate average rating (placeholder - you can implement rating system later)
      const averageRating = 4.8; // This would come from a rating system

      // Transform recent bookings for activity feed
      const recentActivity = recentBookings.map(booking => ({
         id: booking._id,
         serviceTitle: booking.serviceId?.title || 'Unknown Service',
         customerName: booking.customerId?.name || 'Unknown Customer',
         status: booking.status,
         amount: booking.totalPrice,
         createdAt: booking.createdAt,
         timeAgo: getTimeAgo(booking.createdAt)
      }));

      console.log('Dashboard stats:', {
         totalEarnings,
         activeJobs: activeJobsCount,
         completedJobs: completedJobsCount,
         totalServices: totalServicesCount,
         averageRating
      });

      return NextResponse.json({
         success: true,
         stats: {
            totalEarnings,
            activeJobs: activeJobsCount,
            completedJobs: completedJobsCount,
            totalServices: totalServicesCount,
            averageRating
         },
         recentActivity
      });

   } catch (error) {
      console.error('Dashboard stats error:', error);
      return NextResponse.json(
         { error: 'Internal server error' },
         { status: 500 }
      );
   }
}

function getTimeAgo(date: Date): string {
   const now = new Date();
   const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

   if (diffInSeconds < 60) {
      return 'Just now';
   } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
   } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
   } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
   } else {
      const months = Math.floor(diffInSeconds / 2592000);
      return `${months} month${months > 1 ? 's' : ''} ago`;
   }
} 