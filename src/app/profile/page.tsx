'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useApi } from '@/hooks/useApi';
import ProtectedRoute from '@/components/ProtectedRoute';
import ImageUpload from '@/components/ImageUpload';
import { FaUser, FaEnvelope, FaCalendar, FaUserTag, FaSave, FaEdit, FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Footer from '@/components/Footer';
import toast from 'react-hot-toast';

export default function Profile() {
   const router = useRouter();
   const { user, isAuthenticated, refreshUser } = useAuth();
   const api = useApi();
   const [isEditing, setIsEditing] = useState(false);
   const [isSaving, setIsSaving] = useState(false);
   const [formData, setFormData] = useState({
      name: user?.name || '',
      email: user?.email || '',
   });
   const [localImages, setLocalImages] = useState({
      profilePicture: user?.profilePicture || '',
      headerImage: user?.headerImage || '',
   });

   // Update form data when user changes
   useEffect(() => {
      if (user) {
         setFormData({
            name: user.name || '',
            email: user.email || '',
         });
         setLocalImages({
            profilePicture: user.profilePicture || '',
            headerImage: user.headerImage || '',
         });
      }
   }, [user]);

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({
         ...formData,
         [e.target.name]: e.target.value,
      });
   };

   const handleImageUploaded = async (imageType: 'profilePicture' | 'headerImage', imageUrl: string) => {
      // Update local state immediately for better UX
      setLocalImages(prev => ({
         ...prev,
         [imageType]: imageUrl
      }));

      // Refresh user data after image upload
      await refreshUser();
   };

   const handleSaveProfile = async () => {
      if (!formData.name.trim()) {
         toast.error('Name is required');
         return;
      }

      setIsSaving(true);
      try {
         const response = await api.patch('/api/user/profile', {
            name: formData.name.trim()
         });

         toast.success('Profile updated successfully!');
         setIsEditing(false);

         // Refresh user data to get updated information
         await refreshUser();
      } catch (error) {
         console.error('Save profile error:', error);
         toast.error('Failed to update profile');
      } finally {
         setIsSaving(false);
      }
   };

   const handleCancelEdit = () => {
      setFormData({
         name: user?.name || '',
         email: user?.email || '',
      });
      setLocalImages({
         profilePicture: user?.profilePicture || '',
         headerImage: user?.headerImage || '',
      });
      setIsEditing(false);
   };

   return (
      <ProtectedRoute>
         <div className="min-h-screen bg-gray-50 mt-14">
            <div className='fixed top-0 left-0 z-10 bg-blue-50/80 backdrop-blur-sm w-full flex flex-row items-center justify-between px-4 md:px-10 py-3 border-b border-gray-300'>
               <div>
                  <Image src="/logo.png" alt="Taskio Logo" width={300} height={300} className="w-30 h-auto" />
               </div>
               <button className='bg-sky-900 hover:bg-sky-800 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-lg text-xs sm:text-sm cursor-pointer' onClick={() => router.push('/')}>Go To Home</button>
            </div>

            {/* Header Image Section */}
            <div className='relative w-full h-[15vh] md:h-[30vh]'>
               {localImages.headerImage ? (
                  <Image
                     src={localImages.headerImage}
                     alt="Profile Header"
                     fill
                     className='object-cover'
                     priority
                  />
               ) : (
                  <div className='w-full h-full bg-gray-200'></div>
               )}

               {/* Header Image Upload Overlay */}
               {isEditing && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center p-4">
                     <ImageUpload
                        currentImage={localImages.headerImage}
                        imageType="headerImage"
                        onImageUploaded={(imageUrl) => handleImageUploaded('headerImage', imageUrl)}
                        aspectRatio="wide"
                        size="large"
                        className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"
                     />
                  </div>
               )}

               {/* Profile Picture Section */}
               <div className='absolute -bottom-16 md:-bottom-24 md:left-8 left-4 md:w-48 md:h-48 w-32 h-32'>
                  <div className="relative w-full h-full">
                     {localImages.profilePicture ? (
                        <Image
                           src={localImages.profilePicture}
                           alt="Profile Picture"
                           fill
                           className='object-cover md:w-48 md:h-48 w-32 h-32 rounded-full border-4 border-white'
                           priority
                        />
                     ) : (
                        <Image
                           src="/user.png"
                           alt="Default Profile"
                           fill
                           className='object-cover md:w-48 md:h-48 w-32 h-32 rounded-full border-4 border-white'
                           priority
                        />
                     )}

                     {/* Profile Picture Upload Overlay */}
                     {isEditing && (
                        <div className="absolute inset-0">
                           <ImageUpload
                              currentImage={localImages.profilePicture}
                              imageType="profilePicture"
                              onImageUploaded={(imageUrl) => handleImageUploaded('profilePicture', imageUrl)}
                              size="large"
                              className="w-full h-full"
                           />
                        </div>
                     )}
                  </div>
               </div>
            </div>

            <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
               <div className="px-4 py-6 sm:px-0">
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                     <div className="px-4 py-5 sm:p-6">
                        {/* Header with Edit Button */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                           <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Profile Information</h1>
                           {!isEditing ? (
                              <button
                                 onClick={() => setIsEditing(true)}
                                 className="bg-sky-900 text-white px-4 py-2 rounded-md hover:bg-sky-800 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                              >
                                 <FaEdit className="h-4 w-4" />
                                 <span>Edit Profile</span>
                              </button>
                           ) : (
                              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                                 <button
                                    onClick={handleCancelEdit}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                                    disabled={isSaving}
                                 >
                                    <FaTimes className="h-4 w-4" />
                                    Cancel
                                 </button>
                                 <button
                                    onClick={handleSaveProfile}
                                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                    disabled={isSaving}
                                 >
                                    <FaSave className="h-4 w-4" />
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                 </button>
                              </div>
                           )}
                        </div>

                        {/* Profile Information */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                           {/* Name */}
                           <div className="bg-gray-50 p-6 rounded-lg">
                              <div className="flex items-center mb-4">
                                 <FaUser className="h-5 w-5 text-gray-400 mr-3" />
                                 <h3 className="text-lg font-medium text-gray-900">Full Name</h3>
                              </div>
                              {isEditing ? (
                                 <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                    placeholder="Enter your full name"
                                 />
                              ) : (
                                 <p className="text-lg text-gray-900">{user?.name}</p>
                              )}
                           </div>

                           {/* Email */}
                           <div className="bg-gray-50 p-6 rounded-lg">
                              <div className="flex items-center mb-4">
                                 <FaEnvelope className="h-5 w-5 text-gray-400 mr-3" />
                                 <h3 className="text-lg font-medium text-gray-900">Email Address</h3>
                              </div>
                              <p className="text-lg text-gray-900">{user?.email}</p>
                              <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                           </div>

                           {/* User Role */}
                           <div className="bg-gray-50 p-6 rounded-lg">
                              <div className="flex items-center mb-4">
                                 <FaUserTag className="h-5 w-5 text-gray-400 mr-3" />
                                 <h3 className="text-lg font-medium text-gray-900">User Role</h3>
                              </div>
                              <div className="flex items-center">
                                 <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${user?.role === 'taskio'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-blue-100 text-blue-800'
                                    }`}>
                                    {user?.role === 'taskio' ? 'Taskio' : 'Service Seeker'}
                                 </span>
                              </div>
                           </div>

                           {/* Account Created */}
                           <div className="bg-gray-50 p-6 rounded-lg">
                              <div className="flex items-center mb-4">
                                 <FaCalendar className="h-5 w-5 text-gray-400 mr-3" />
                                 <h3 className="text-lg font-medium text-gray-900">Account Created</h3>
                              </div>
                              <p className="text-lg text-gray-900">
                                 {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                 }) : 'N/A'}
                              </p>
                           </div>
                        </div>

                        {/* Role-specific information */}
                        <div className="mt-8">
                           <h2 className="text-xl font-semibold text-gray-900 mb-4">
                              Information
                           </h2>
                           <div className="bg-sky-50 p-6 rounded-lg">
                              <p className="text-gray-700">
                                 {user?.role === 'taskio'
                                    ? 'As a Taskio, you can provide services to customers. Manage your service offerings, view incoming requests, and track your earnings.'
                                    : 'As a Service Seeker, you can browse and book services from our network of qualified Taskios. View your booking history and manage your requests.'
                                 }
                              </p>
                              <div className="mt-4">
                                 <button
                                    className="bg-sky-900 text-white px-4 py-2 rounded-md hover:bg-sky-800 transition-colors"
                                    onClick={() => {
                                       if (user?.role === 'taskio') {
                                          router.push('/dashboard/service-list');
                                       } else {
                                          router.push('/bookings');
                                       }
                                    }}
                                 >
                                    {user?.role === 'taskio' ? 'Manage Services' : 'View Bookings'}
                                 </button>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <Footer />
         </div>
      </ProtectedRoute>
   );
} 