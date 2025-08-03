import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

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

      // Find user by ID
      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
         return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
         );
      }

      return NextResponse.json(
         {
            message: 'Token verified successfully',
            user: {
               id: user._id,
               name: user.name,
               email: user.email,
               role: user.role,
               profilePicture: user.profilePicture,
               headerImage: user.headerImage,
               createdAt: user.createdAt,
            }
         },
         { status: 200 }
      );

   } catch (error) {
      console.error('Token verification error:', error);
      return NextResponse.json(
         { error: 'Internal server error' },
         { status: 500 }
      );
   }
} 