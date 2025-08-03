'use client';

import { useState, useRef } from 'react';
import { useImageUpload } from '@/hooks/useImageUpload';
import { FaTimes, FaUpload } from 'react-icons/fa';
import Image from 'next/image';

interface ImageUploadProps {
   currentImage?: string;
   imageType: 'profilePicture' | 'headerImage';
   onImageUploaded: (imageUrl: string) => void;
   className?: string;
   aspectRatio?: 'square' | 'wide';
   size?: 'small' | 'medium' | 'large';
}

export default function ImageUpload({
   currentImage,
   imageType,
   onImageUploaded,
   className = '',
   aspectRatio = 'square',
   size = 'medium'
}: ImageUploadProps) {
   const [preview, setPreview] = useState<string | null>(null);
   const fileInputRef = useRef<HTMLInputElement>(null);
   const { uploadImage, isUploading, uploadProgress } = useImageUpload();

   const sizeClasses = {
      small: 'w-16 h-16 sm:w-20 sm:h-20',
      medium: 'w-24 h-24 sm:w-32 sm:h-32',
      large: 'w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48'
   };

   const aspectClasses = {
      square: 'aspect-square',
      wide: 'aspect-video'
   };

   const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
         // Create preview
         const reader = new FileReader();
         reader.onload = (e) => {
            setPreview(e.target?.result as string);
         };
         reader.readAsDataURL(file);

         // Upload image
         uploadImage(file, {
            imageType,
            onSuccess: (imageUrl) => {
               onImageUploaded(imageUrl);
               setPreview(null);
            }
         });
      }
   };

   const handleClick = () => {
      if (!isUploading) {
         fileInputRef.current?.click();
      }
   };

   const handleRemoveImage = () => {
      setPreview(null);
      if (fileInputRef.current) {
         fileInputRef.current.value = '';
      }
   };

   const displayImage = preview || currentImage;
   const isProfilePicture = imageType === 'profilePicture';

   return (
      <div className={`relative group ${className}`}>
         {/* Image Container */}
         <div
            className={`
               relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100
               ${aspectClasses[aspectRatio]}
               ${isProfilePicture ? 'rounded-full' : 'rounded-xl'}
               ${sizeClasses[size]}
               ring-2 ring-gray-200
               ${isUploading ? 'opacity-75' : ''}
               transition-all duration-300 ease-in-out cursor-pointer
               ${displayImage ? 'shadow-md' : 'shadow-sm'}
            `}
            onClick={handleClick}
         >
            {/* Background Image */}
            {displayImage && (
               <Image
                  src={displayImage}
                  alt={`${imageType} preview`}
                  fill
                  className={`object-cover transition-transform duration-300 ${isProfilePicture ? 'rounded-full' : 'rounded-xl'}`}
               />
            )}

            {/* Upload Progress Bar */}
            {isUploading && (
               <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                  <div
                     className="h-full bg-gradient-to-r from-sky-500 to-blue-600 transition-all duration-300 ease-out rounded-r-full"
                     style={{ width: `${uploadProgress}%` }}
                  />
               </div>
            )}

            {/* Default State */}
            {!displayImage && !isUploading && (
               <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                  <div className="bg-sky-50 rounded-full p-2 sm:p-3 md:p-4 mb-2 sm:mb-3 border-2 border-dashed border-sky-200">
                     <FaUpload className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-sky-500" />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-gray-700 text-center">
                     Click to upload
                  </p>
                  <p className="text-xs text-gray-500 mt-1 text-center">
                     Max 5MB
                  </p>
               </div>
            )}

            {/* Shimmer effect for loading state */}
            {isUploading && (
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            )}
         </div>

         {/* Remove Button */}
         {displayImage && !isUploading && (
            <button
               type="button"
               onClick={handleRemoveImage}
               className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-red-500 text-white rounded-full p-1.5 sm:p-2 hover:bg-red-600 hover:scale-110 transition-all duration-200 shadow-lg hover:shadow-xl group/remove"
               title="Remove image"
            >
               <FaTimes className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
               <div className="absolute inset-0 bg-red-400 rounded-full opacity-0 group-hover/remove:opacity-100 transition-opacity duration-200 -z-10" />
            </button>
         )}

         {/* Hidden File Input */}
         <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
         />
      </div>
   );
} 