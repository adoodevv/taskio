import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

interface UploadOptions {
   imageType: 'profilePicture' | 'headerImage' | 'serviceImage';
   serviceId?: string; // Optional serviceId for service images
   onSuccess?: (imageUrl: string) => void;
}

export function useImageUpload() {
   const { token } = useAuth();
   const [isUploading, setIsUploading] = useState(false);
   const [uploadProgress, setUploadProgress] = useState(0);

   const uploadImage = async (file: File, options: UploadOptions) => {
      const { imageType, serviceId, onSuccess } = options;

      if (!file) {
         toast.error('Please select a file');
         return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
         toast.error('Invalid file type. Only JPEG, PNG, and WebP are allowed');
         return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
         toast.error('File size too large. Maximum size is 5MB');
         return;
      }

      // Check if token exists
      if (!token) {
         toast.error('Authentication token not found. Please login again.');
         return;
      }

      // Validate serviceId for service images
      if (imageType === 'serviceImage' && !serviceId) {
         toast.error('Service ID is required for service images');
         return;
      }

      setIsUploading(true);
      setUploadProgress(0);

      try {
         const formData = new FormData();
         formData.append('image', file);
         formData.append('imageType', imageType);

         if (serviceId) {
            formData.append('serviceId', serviceId);
         }

         const headers: Record<string, string> = {
            'Authorization': `Bearer ${token}`,
         };

         const response = await fetch('/api/user/upload-image', {
            method: 'POST',
            headers,
            body: formData,
         });

         const data = await response.json();

         if (!response.ok) {
            throw new Error(data.error || 'Upload failed');
         }

         setUploadProgress(100);
         toast.success('Image uploaded successfully!');

         if (onSuccess) {
            onSuccess(data.imageUrl);
         }

         return data.imageUrl;

      } catch (error) {
         console.error('Upload error:', error);
         toast.error(error instanceof Error ? error.message : 'Upload failed');
         throw error;
      } finally {
         setIsUploading(false);
         setUploadProgress(0);
      }
   };

   return {
      uploadImage,
      isUploading,
      uploadProgress,
   };
} 