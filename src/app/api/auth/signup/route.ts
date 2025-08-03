import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
   try {
      await connectDB();

      const { name, email, password, role } = await request.json();

      // Validation
      if (!name || !email || !password) {
         return NextResponse.json(
            { error: 'Name, email, and password are required' },
            { status: 400 }
         );
      }

      if (password.length < 6) {
         return NextResponse.json(
            { error: 'Password must be at least 6 characters long' },
            { status: 400 }
         );
      }

      if (!['seeker', 'taskio'].includes(role)) {
         return NextResponse.json(
            { error: 'Role must be either seeker or taskio' },
            { status: 400 }
         );
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
         return NextResponse.json(
            { error: 'User with this email already exists' },
            { status: 409 }
         );
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create new user
      const user = new User({
         name,
         email: email.toLowerCase(),
         password: hashedPassword,
         role,
      });

      await user.save();

      // Return user data without password
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
            message: 'User created successfully',
            user: userResponse
         },
         { status: 201 }
      );

   } catch (error) {
      console.error('Signup error:', error);
      return NextResponse.json(
         { error: 'Internal server error' },
         { status: 500 }
      );
   }
} 