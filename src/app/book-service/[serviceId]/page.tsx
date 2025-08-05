'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { FaMapMarkerAlt, FaClock, FaDollarSign, FaCalendar, FaUser, FaArrowLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface Taskio {
   _id: string;
   name: string;
   profilePicture?: string;
   email?: string;
}

interface Service {
   _id: string;
   title: string;
   category: string;
   description: string;
   serviceImage?: string;
   pricingModel: 'hourly' | 'fixed' | 'package';
   priceRange: {
      min: number;
      max: number;
      currency: string;
   };
   isNegotiable: boolean;
   location: {
      type: 'in-person' | 'remote' | 'both';
      serviceRadius?: number;
      serviceArea?: string;
   };
   additionalInfo: {
      estimatedDuration: string;
      serviceType: 'individual' | 'group' | 'both';
   };
   taskio: Taskio;
}

interface BookingForm {
   serviceId: string;
   taskioId: string;
   customerId: string;
   price: number;
   quantity: number;
   totalPrice: number;
   bookingDate: string;
   bookingTime: string;
   address: string;
   city: string;
   state: string;
   zipCode: string;
   specialInstructions: string;
   contactPhone: string;
   contactEmail: string;
}

const BookService = () => {
   const params = useParams();
   const router = useRouter();
   const { user, token } = useAuth();
   const [service, setService] = useState<Service | null>(null);
   const [isLoading, setIsLoading] = useState(true);
   const [isSubmitting, setIsSubmitting] = useState(false);

   const [bookingForm, setBookingForm] = useState<BookingForm>({
      serviceId: '',
      taskioId: '',
      customerId: '',
      price: 0,
      quantity: 1,
      totalPrice: 0,
      bookingDate: '',
      bookingTime: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      specialInstructions: '',
      contactPhone: '',
      contactEmail: ''
   });

   useEffect(() => {
      if (params.serviceId) {
         fetchService();
      }
   }, [params.serviceId]);

   useEffect(() => {
      if (service) {
         setBookingForm(prev => ({
            ...prev,
            serviceId: service._id,
            taskioId: service.taskio._id,
            customerId: user?.id || '',
            price: service.priceRange.min,
            totalPrice: service.priceRange.min
         }));
      }
   }, [service, user]);

   const fetchService = async () => {
      try {
         setIsLoading(true);
         const response = await fetch(`/api/services/${params.serviceId}`);
         const data = await response.json();

         if (response.ok) {
            setService(data.service);
         } else {
            toast.error('Service not found');
            router.push('/services');
         }
      } catch (error) {
         console.error('Error fetching service:', error);
         toast.error('Failed to load service');
         router.push('/services');
      } finally {
         setIsLoading(false);
      }
   };

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setBookingForm(prev => {
         const updated = { ...prev, [name]: value };

         // Recalculate total price when price or quantity changes
         if (name === 'price' || name === 'quantity') {
            const price = name === 'price' ? parseFloat(value) : prev.price;
            const quantity = name === 'quantity' ? parseInt(value) : prev.quantity;
            updated.totalPrice = price * quantity;
         }

         return updated;
      });
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!user) {
         toast.error('Please login to book a service');
         return;
      }

      // Validate required fields
      const requiredFields = ['bookingDate', 'bookingTime', 'address', 'city', 'state', 'zipCode', 'contactPhone'];
      for (const field of requiredFields) {
         if (!bookingForm[field as keyof BookingForm]) {
            toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
            return;
         }
      }

      setIsSubmitting(true);

      try {
         const response = await fetch('/api/bookings', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(bookingForm),
         });

         const data = await response.json();

         if (response.ok) {
            toast.success('Booking created successfully!');
            router.push(`/booking-success?bookingId=${data.booking._id}`);
         } else {
            toast.error(data.error || 'Failed to create booking');
         }
      } catch (error) {
         console.error('Booking error:', error);
         toast.error('Failed to create booking');
      } finally {
         setIsSubmitting(false);
      }
   };

   if (isLoading) {
      return (
         <div>
            <Navbar />
            <div className="min-h-screen bg-gray-50 pt-20">
               <div className="max-w-7xl mx-auto py-12 px-4">
                  <div className="text-center">
                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-900 mx-auto mb-4"></div>
                     <p className="text-gray-600">Loading booking form...</p>
                  </div>
               </div>
            </div>
         </div>
      );
   }

   if (!service) {
      return (
         <div>
            <Navbar />
            <div className="min-h-screen bg-gray-50 pt-20">
               <div className="max-w-7xl mx-auto py-12 px-4">
                  <div className="text-center">
                     <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h1>
                     <p className="text-gray-600 mb-6">The service you're trying to book doesn't exist.</p>
                     <button
                        onClick={() => router.push('/services')}
                        className="bg-sky-900 text-white px-6 py-3 rounded-lg hover:bg-sky-800 transition-colors"
                     >
                        Back to Services
                     </button>
                  </div>
               </div>
            </div>
         </div>
      );
   }

   return (
      <div>
         <Navbar />
         <div className="min-h-screen bg-gray-50 pt-20">
            <div className="max-w-7xl mx-auto py-8 px-4">
               {/* Breadcrumb */}
               <nav className="mb-8">
                  <ol className="flex items-center space-x-2 text-sm text-gray-500">
                     <li>
                        <button onClick={() => router.push('/services')} className="hover:text-sky-600">
                           Services
                        </button>
                     </li>
                     <li>/</li>
                     <li>
                        <button onClick={() => router.push(`/services/${service._id}`)} className="hover:text-sky-600">
                           {service.title}
                        </button>
                     </li>
                     <li>/</li>
                     <li className="text-gray-900">Book Service</li>
                  </ol>
               </nav>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Booking Form */}
                  <div className="lg:col-span-2">
                     <div className="bg-white rounded-lg shadow-sm p-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-6">Book Service</h1>

                        <form onSubmit={handleSubmit} className="space-y-6">
                           {/* Service Details */}
                           <div className="border-b border-gray-200 pb-6">
                              <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Details</h2>
                              <div className="flex items-start space-x-4">
                                 {service.serviceImage ? (
                                    <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                                       <Image
                                          src={service.serviceImage}
                                          alt={service.title}
                                          fill
                                          className="object-cover"
                                       />
                                    </div>
                                 ) : (
                                    <div className="w-24 h-24 bg-gradient-to-br from-sky-100 to-blue-100 rounded-lg flex items-center justify-center">
                                       <div className="text-sky-500 text-2xl">📋</div>
                                    </div>
                                 )}
                                 <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">{service.title}</h3>
                                    <p className="text-gray-600 text-sm">{service.description}</p>
                                    <div className="flex items-center mt-2">
                                       <div className="relative w-8 h-8 mr-2">
                                          {service.taskio?.profilePicture ? (
                                             <Image
                                                src={service.taskio.profilePicture}
                                                alt={service.taskio.name}
                                                width={32}
                                                height={32}
                                                className="rounded-full object-cover"
                                             />
                                          ) : (
                                             <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center">
                                                <span className="text-sky-600 font-semibold text-sm">
                                                   {service.taskio?.name?.charAt(0).toUpperCase() || 'T'}
                                                </span>
                                             </div>
                                          )}
                                       </div>
                                       <span className="text-sm text-gray-600">{service.taskio?.name}</span>
                                    </div>
                                 </div>
                              </div>
                           </div>

                           {/* Pricing */}
                           <div>
                              <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h2>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                       Price per {service.pricingModel === 'hourly' ? 'hour' : 'service'}
                                    </label>
                                    <input
                                       type="number"
                                       name="price"
                                       value={bookingForm.price}
                                       onChange={handleInputChange}
                                       min={service.priceRange.min}
                                       max={service.priceRange.max}
                                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                                       required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                       Range: ${service.priceRange.min} - ${service.priceRange.max}
                                    </p>
                                 </div>
                                 <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                       Number of Times
                                    </label>
                                    <input
                                       type="number"
                                       name="quantity"
                                       value={bookingForm.quantity}
                                       onChange={handleInputChange}
                                       min="1"
                                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                                       required
                                    />
                                 </div>
                              </div>
                           </div>

                           {/* Date and Time */}
                           <div>
                              <h2 className="text-lg font-semibold text-gray-900 mb-4">Schedule</h2>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                       Preferred Date
                                    </label>
                                    <input
                                       type="date"
                                       name="bookingDate"
                                       value={bookingForm.bookingDate}
                                       onChange={handleInputChange}
                                       min={new Date().toISOString().split('T')[0]}
                                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                                       required
                                    />
                                 </div>
                                 <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                       Preferred Time
                                    </label>
                                    <input
                                       type="time"
                                       name="bookingTime"
                                       value={bookingForm.bookingTime}
                                       onChange={handleInputChange}
                                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                                       required
                                    />
                                 </div>
                              </div>
                           </div>

                           {/* Address */}
                           <div>
                              <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Address</h2>
                              <div className="space-y-4">
                                 <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                       Street Address
                                    </label>
                                    <input
                                       type="text"
                                       name="address"
                                       value={bookingForm.address}
                                       onChange={handleInputChange}
                                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                                       placeholder="Enter your street address"
                                       required
                                    />
                                 </div>
                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                       <label className="block text-sm font-medium text-gray-700 mb-2">
                                          City
                                       </label>
                                       <input
                                          type="text"
                                          name="city"
                                          value={bookingForm.city}
                                          onChange={handleInputChange}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                                          required
                                       />
                                    </div>
                                    <div>
                                       <label className="block text-sm font-medium text-gray-700 mb-2">
                                          State
                                       </label>
                                       <input
                                          type="text"
                                          name="state"
                                          value={bookingForm.state}
                                          onChange={handleInputChange}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                                          required
                                       />
                                    </div>
                                    <div>
                                       <label className="block text-sm font-medium text-gray-700 mb-2">
                                          ZIP Code
                                       </label>
                                       <input
                                          type="text"
                                          name="zipCode"
                                          value={bookingForm.zipCode}
                                          onChange={handleInputChange}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                                          required
                                       />
                                    </div>
                                 </div>
                              </div>
                           </div>

                           {/* Contact Information */}
                           <div>
                              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                       Phone Number
                                    </label>
                                    <input
                                       type="tel"
                                       name="contactPhone"
                                       value={bookingForm.contactPhone}
                                       onChange={handleInputChange}
                                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                                       required
                                    />
                                 </div>
                                 <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                       Email
                                    </label>
                                    <input
                                       type="email"
                                       name="contactEmail"
                                       value={bookingForm.contactEmail}
                                       onChange={handleInputChange}
                                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                                       required
                                    />
                                 </div>
                              </div>
                           </div>

                           {/* Special Instructions */}
                           <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                 Special Instructions (Optional)
                              </label>
                              <textarea
                                 name="specialInstructions"
                                 value={bookingForm.specialInstructions}
                                 onChange={handleInputChange}
                                 rows={4}
                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                                 placeholder="Any special requirements or instructions for the taskio..."
                              />
                           </div>
                        </form>
                     </div>
                  </div>

                  {/* Booking Summary */}
                  <div className="lg:col-span-1">
                     <div className="sticky top-24">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                           <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Summary</h2>

                           <div className="space-y-4 mb-6">
                              <div className="flex justify-between">
                                 <span className="text-gray-600">Service:</span>
                                 <span className="font-medium">{service.title}</span>
                              </div>
                              <div className="flex justify-between">
                                 <span className="text-gray-600">Taskio:</span>
                                 <span className="font-medium">{service.taskio?.name}</span>
                              </div>
                              <div className="flex justify-between">
                                 <span className="text-gray-600">Price per {service.pricingModel === 'hourly' ? 'hour' : 'service'}:</span>
                                 <span className="font-medium">${bookingForm.price}</span>
                              </div>
                              <div className="flex justify-between">
                                 <span className="text-gray-600">Quantity:</span>
                                 <span className="font-medium">{bookingForm.quantity}</span>
                              </div>
                              <div className="border-t border-gray-200 pt-2">
                                 <div className="flex justify-between">
                                    <span className="text-lg font-semibold">Total:</span>
                                    <span className="text-lg font-bold text-sky-900">${bookingForm.totalPrice}</span>
                                 </div>
                              </div>
                           </div>

                           <button
                              onClick={handleSubmit}
                              disabled={isSubmitting}
                              className="w-full bg-sky-900 text-white py-3 rounded-lg hover:bg-sky-800 transition-colors font-medium disabled:opacity-50"
                           >
                              {isSubmitting ? 'Creating Booking...' : 'Confirm Booking'}
                           </button>

                           <p className="text-xs text-gray-500 mt-3 text-center">
                              By confirming this booking, you agree to our terms of service and cancellation policy.
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <Footer />
      </div>
   );
};

export default BookService; 