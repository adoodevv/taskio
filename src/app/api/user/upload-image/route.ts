import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Service from '@/models/Service';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';
import { uploadImage } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
   try {
      // Verify authentication
      const authHeader = request.headers.get('authorization');
      const token = extractTokenFromHeader(authHeader || undefined);

      if (!token) {
         return NextResponse.json({ error: 'No token provided' }, { status: 401 });
      }

      const decoded = verifyToken(token);

      if (!decoded) {
         return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
      }

      // Connect to database
      await connectDB();

      // Get user
      const user = await User.findById(decoded.userId);
      if (!user) {
         return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Parse form data
      const formData = await request.formData();
      const imageType = formData.get('imageType') as string;
      const imageFile = formData.get('image') as File;
      const serviceId = formData.get('serviceId') as string; // For service images

      if (!imageType || !imageFile) {
         return NextResponse.json({ error: 'Image type and file are required' }, { status: 400 });
      }

      if (!['profilePicture', 'headerImage', 'serviceImage'].includes(imageType)) {
         return NextResponse.json({ error: 'Invalid image type' }, { status: 400 });
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(imageFile.type)) {
         return NextResponse.json({ error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed' }, { status: 400 });
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (imageFile.size > maxSize) {
         return NextResponse.json({ error: 'File size too large. Maximum size is 5MB' }, { status: 400 });
      }

      // Convert file to base64
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = `data:${imageFile.type};base64,${buffer.toString('base64')}`;

      // Upload to Cloudinary
      const folder = `taskio/${imageType}`;
      const imageUrl = await uploadImage(base64, folder);

      // Update database based on image type
      if (imageType === 'serviceImage') {
         // For service images, we need a serviceId
         if (!serviceId) {
            return NextResponse.json({ error: 'Service ID is required for service images' }, { status: 400 });
         }

         // Verify the service belongs to the user
         const service = await Service.findOne({ _id: serviceId, taskioId: decoded.userId });
         if (!service) {
            return NextResponse.json({ error: 'Service not found or access denied' }, { status: 404 });
         }

         // Update service with image
         const updatedService = await Service.findByIdAndUpdate(
            serviceId,
            { serviceImage: imageUrl },
            { new: true }
         );

         return NextResponse.json({
            message: 'Service image uploaded successfully',
            service: updatedService,
            imageUrl
         });
      } else {
         // Update user profile/header image
      const updateData: any = {};
      updateData[imageType] = imageUrl;

      const updatedUser = await User.findByIdAndUpdate(
         decoded.userId,
         updateData,
         { new: true, select: '-password' }
      );

      return NextResponse.json({
         message: 'Image uploaded successfully',
         user: updatedUser,
         imageUrl
      });
      }

   } catch (error) {
      console.error('Upload image error:', error);
      return NextResponse.json(
         { error: 'Failed to upload image' },
         { status: 500 }
      );
   }
} 