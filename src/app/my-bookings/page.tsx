'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useApi } from '@/hooks/useApi';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { FaCalendar, FaClock, FaMapMarkerAlt, FaDollarSign, FaUser, FaTools } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface Booking {
   _id: string;
   service: {
      _id: string;
      title: string;
      category: string;
      serviceImage?: string;
   };
   taskio: {
      _id: string;
      name: string;
      profilePicture?: string;
   };
   customer: {
      _id: string;
      name: string;
      profilePicture?: string;
   };
   price: number;
   quantity: number;
   totalPrice: number;
   bookingDate: string;
   bookingTime: string;
   address: string;
   city: string;
   state: string;
   zipCode: string;
   specialInstructions?: string;
   contactPhone: string;
   contactEmail: string;
   status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
   createdAt: string;
   updatedAt: string;
}

const MyBookings = () => {
   const { user } = useAuth();
   const api = useApi();
   const [bookings, setBookings] = useState<Booking[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [activeTab, setActiveTab] = useState<'customer' | 'taskio'>('customer');

   useEffect(() => {
      if (user) {
         fetchBookings();
      }
   }, [user, activeTab]);

   const fetchBookings = async () => {
      try {
         setIsLoading(true);
         const response = await api.get(`/api/bookings?role=${activeTab}`);
         setBookings(response.bookings);
      } catch (error) {
         console.error('Error fetching bookings:', error);
         toast.error('Failed to load bookings');
      } finally {
         setIsLoading(false);
      }
   };

   const getStatusColor = (status: string) => {
      switch (status) {
         case 'pending':
            return 'bg-yellow-100 text-yellow-800';
         case 'confirmed':
            return 'bg-blue-100 text-blue-800';
         case 'in-progress':
            return 'bg-purple-100 text-purple-800';
         case 'completed':
            return 'bg-green-100 text-green-800';
         case 'cancelled':
            return 'bg-red-100 text-red-800';
         default:
            return 'bg-gray-100 text-gray-800';
      }
   };

   const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
         year: 'numeric',
         month: 'long',
         day: 'numeric'
      });
   };

   const formatTime = (timeString: string) => {
      return timeString;
   };

   if (isLoading) {
      return (
         <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 pt-20">
               <div className="max-w-7xl mx-auto py-12 px-4 w-full">
                  <div className="text-center">
                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-900 mx-auto mb-4"></div>
                     <p className="text-gray-600">Loading bookings...</p>
                  </div>
               </div>
            </div>
         </ProtectedRoute>
      );
   }

   return (
      <ProtectedRoute>
         <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="pt-20">
               <div className="max-w-7xl mx-auto py-8 px-4">
                  {/* Header */}
                  <div className="mb-8">
                     <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
                     <p className="text-gray-600">Manage your service bookings</p>
                  </div>

                  {/* Tabs */}
                  <div className="mb-8">
                     <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                           <button
                              onClick={() => setActiveTab('customer')}
                              className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'customer'
                                 ? 'border-sky-500 text-sky-600'
                                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                 }`}
                           >
                              Bookings I Made
                           </button>
                           {user?.role === 'taskio' && (
                              <button
                                 onClick={() => setActiveTab('taskio')}
                                 className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'taskio'
                                    ? 'border-sky-500 text-sky-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                              >
                                 Bookings for My Services
                              </button>
                           )}
                        </nav>
                     </div>
                  </div>

                  {/* Bookings List */}
                  {bookings.length === 0 ? (
                     <div className="text-center py-12">
                        <FaTools className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                           {activeTab === 'customer' ? 'No bookings yet' : 'No bookings for your services'}
                        </h3>
                        <p className="text-gray-600 mb-6">
                           {activeTab === 'customer'
                              ? 'Start by booking a service from our marketplace.'
                              : 'When customers book your services, they will appear here.'
                           }
                        </p>
                        {activeTab === 'customer' && (
                           <a
                              href="/services"
                              className="bg-sky-900 text-white px-6 py-3 rounded-lg hover:bg-sky-800 transition-colors"
                           >
                              Browse Services
                           </a>
                        )}
                     </div>
                  ) : (
                     <div className="space-y-6">
                        {bookings.map((booking) => (
                           <div key={booking._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                              <div className="p-6">
                                 <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                    {/* Service Info */}
                                    <div className="flex-1">
                                       <div className="flex items-start space-x-4">
                                          {booking.service.serviceImage ? (
                                             <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                                                <Image
                                                   src={booking.service.serviceImage}
                                                   alt={booking.service.title}
                                                   fill
                                                   className="object-cover"
                                                />
                                             </div>
                                          ) : (
                                             <div className="w-20 h-20 bg-gradient-to-br from-sky-100 to-blue-100 rounded-lg flex items-center justify-center">
                                                <div className="text-sky-500 text-2xl">📋</div>
                                             </div>
                                          )}

                                          <div className="flex-1">
                                             <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                {booking.service.title}
                                             </h3>
                                             <p className="text-sm text-gray-600 mb-2">{booking.service.category}</p>

                                             {/* User Info */}
                                             <div className="flex items-center space-x-4">
                                                <div className="flex items-center">
                                                   <div className="relative w-8 h-8 mr-2">
                                                      {activeTab === 'customer' ? (
                                                         booking.taskio.profilePicture ? (
                                                            <Image
                                                               src={booking.taskio.profilePicture}
                                                               alt={booking.taskio.name}
                                                               width={32}
                                                               height={32}
                                                               className="rounded-full object-cover"
                                                            />
                                                         ) : (
                                                            <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center">
                                                               <span className="text-sky-600 font-semibold text-sm">
                                                                  {booking.taskio.name.charAt(0).toUpperCase()}
                                                               </span>
                                                            </div>
                                                         )
                                                      ) : (
                                                         booking.customer.profilePicture ? (
                                                            <Image
                                                               src={booking.customer.profilePicture}
                                                               alt={booking.customer.name}
                                                               width={32}
                                                               height={32}
                                                               className="rounded-full object-cover"
                                                            />
                                                         ) : (
                                                            <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center">
                                                               <span className="text-sky-600 font-semibold text-sm">
                                                                  {booking.customer.name.charAt(0).toUpperCase()}
                                                               </span>
                                                            </div>
                                                         )
                                                      )}
                                                   </div>
                                                   <span className="text-sm text-gray-600">
                                                      {activeTab === 'customer' ? booking.taskio.name : booking.customer.name}
                                                   </span>
                                                </div>
                                             </div>
                                          </div>
                                       </div>
                                    </div>

                                    {/* Status and Price */}
                                    <div className="flex flex-col items-end space-y-2">
                                       <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                       </span>
                                       <div className="text-right">
                                          <p className="text-lg font-bold text-gray-900">${booking.totalPrice}</p>
                                          <p className="text-sm text-gray-500">
                                             ${booking.price} × {booking.quantity}
                                          </p>
                                       </div>
                                    </div>
                                 </div>

                                 {/* Booking Details */}
                                 <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="flex items-center space-x-2">
                                       <FaCalendar className="text-gray-400" />
                                       <span className="text-sm text-gray-600">{formatDate(booking.bookingDate)}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                       <FaClock className="text-gray-400" />
                                       <span className="text-sm text-gray-600">{formatTime(booking.bookingTime)}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                       <FaMapMarkerAlt className="text-gray-400" />
                                       <span className="text-sm text-gray-600">
                                          {booking.city}, {booking.state}
                                       </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                       <FaDollarSign className="text-gray-400" />
                                       <span className="text-sm text-gray-600">
                                          {booking.quantity} {booking.quantity === 1 ? 'time' : 'times'}
                                       </span>
                                    </div>
                                 </div>

                                 {/* Special Instructions */}
                                 {booking.specialInstructions && (
                                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                       <p className="text-sm text-gray-600">
                                          <span className="font-medium">Special Instructions:</span> {booking.specialInstructions}
                                       </p>
                                    </div>
                                 )}

                                 {/* Contact Info */}
                                 <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                       <div>
                                          <span className="font-medium text-gray-900">Contact:</span>
                                          <p className="text-gray-600">{booking.contactPhone}</p>
                                          <p className="text-gray-600">{booking.contactEmail}</p>
                                       </div>
                                       <div>
                                          <span className="font-medium text-gray-900">Address:</span>
                                          <p className="text-gray-600">
                                             {booking.address}<br />
                                             {booking.city}, {booking.state} {booking.zipCode}
                                          </p>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            </div>
            <Footer />
         </div>
      </ProtectedRoute>
   );
};

export default MyBookings;
