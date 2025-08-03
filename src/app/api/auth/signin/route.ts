import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { comparePassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
   try {
      await connectDB();

      const { email, password } = await request.json();

      // Validation
      if (!email || !password) {
         return NextResponse.json(
            { error: 'Email and password are required' },
            { status: 400 }
         );
      }

      // Find user by email
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
         return NextResponse.json(
            { error: 'Invalid email or password' },
            { status: 401 }
         );
      }

      // Verify password
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
         return NextResponse.json(
            { error: 'Invalid email or password' },
            { status: 401 }
         );
      }

      // Generate JWT token
      const token = generateToken(user);

      // Return user data and token
      const userResponse = {
         id: user._id,
         name: user.name,
         email: user.email,
         role: user.role,
         profilePicture: user.profilePicture,
         headerImage: user.headerImage,
         createdAt: user.createdAt,
      };

      return NextResponse.json(
         {
            message: 'Login successful',
            user: userResponse,
            token
         },
         { status: 200 }
      );

   } catch (error) {
      console.error('Signin error:', error);
      return NextResponse.json(
         { error: 'Internal server error' },
         { status: 500 }
      );
   }
} 