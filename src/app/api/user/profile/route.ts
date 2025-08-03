import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

export async function PATCH(request: NextRequest) {
   try {
      // Verify authentication
      const token = extractTokenFromHeader(request.headers.get('authorization') || undefined);
      if (!token) {
         return NextResponse.json({ error: 'No token provided' }, { status: 401 });
      }

      const decoded = verifyToken(token);
      if (!decoded) {
         return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
      }

      // Connect to database
      await connectDB();

      // Get request body
      const body = await request.json();
      const { name } = body;

      // Validate input
      if (!name || name.trim().length === 0) {
         return NextResponse.json({ error: 'Name is required' }, { status: 400 });
      }

      if (name.length > 50) {
         return NextResponse.json({ error: 'Name cannot be more than 50 characters' }, { status: 400 });
      }

      // Update user
      const updatedUser = await User.findByIdAndUpdate(
         decoded.userId,
         { name: name.trim() },
         { new: true, select: '-password' }
      );

      if (!updatedUser) {
         return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      return NextResponse.json({
         message: 'Profile updated successfully',
         user: updatedUser
      });

   } catch (error) {
      console.error('Update profile error:', error);
      return NextResponse.json(
         { error: 'Failed to update profile' },
         { status: 500 }
      );
   }
}
