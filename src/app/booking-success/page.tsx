'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FaCheckCircle, FaCalendar, FaUser, FaMapMarkerAlt } from 'react-icons/fa';

const BookingSuccess = () => {
   const router = useRouter();
   const searchParams = useSearchParams();
   const [countdown, setCountdown] = useState(5);
   const bookingId = searchParams.get('bookingId');

   // Handle countdown timer
   useEffect(() => {
      // Only start the timer if we're on the client side
      if (typeof window !== 'undefined') {
         const timer = setInterval(() => {
            setCountdown(prev => {
               if (prev <= 1) {
                  return 0;
               }
               return prev - 1;
            });
         }, 1000);

         return () => clearInterval(timer);
      }
   }, []);

   // Handle navigation when countdown reaches 0
   useEffect(() => {
      if (countdown === 0) {
         router.push('/my-bookings');
      }
   }, [countdown, router]);

   return (
      <div>
         <Navbar />
         <div className="min-h-screen bg-gray-50 pt-20">
            <div className="max-w-2xl mx-auto py-16 px-4">
               <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  {/* Success Icon */}
                  <div className="mb-6">
                     <FaCheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                  </div>

                  {/* Success Message */}
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                     Booking Confirmed!
                  </h1>
                  <p className="text-lg text-gray-600 mb-6">
                     Your service has been successfully booked. We've sent you a confirmation email with all the details.
                  </p>

                  {/* Booking ID */}
                  {bookingId && (
                     <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <p className="text-sm text-gray-600 mb-2">Booking ID</p>
                        <p className="font-mono text-lg font-semibold text-gray-900">{bookingId}</p>
                     </div>
                  )}

                  {/* Next Steps */}
                  <div className="bg-sky-50 rounded-lg p-6 mb-8">
                     <h2 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h2>
                     <div className="space-y-3 text-left">
                        <div className="flex items-start gap-3">
                           <FaUser className="text-sky-500 mt-1 flex-shrink-0" />
                           <div>
                              <p className="font-medium text-gray-900">Taskio Contact</p>
                              <p className="text-sm text-gray-600">The taskio will contact you within 24 hours to confirm details.</p>
                           </div>
                        </div>
                        <div className="flex items-start gap-3">
                           <FaCalendar className="text-sky-500 mt-1 flex-shrink-0" />
                           <div>
                              <p className="font-medium text-gray-900">Service Date</p>
                              <p className="text-sm text-gray-600">Make sure you're available on the scheduled date and time.</p>
                           </div>
                        </div>
                        <div className="flex items-start gap-3">
                           <FaMapMarkerAlt className="text-sky-500 mt-1 flex-shrink-0" />
                           <div>
                              <p className="font-medium text-gray-900">Service Location</p>
                              <p className="text-sm text-gray-600">Ensure the service address is accessible and ready for the taskio.</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                     <button
                        onClick={() => router.push('/my-bookings')}
                        className="bg-sky-900 text-white px-6 py-3 rounded-lg hover:bg-sky-800 transition-colors font-medium"
                     >
                        View My Bookings
                     </button>
                     <button
                        onClick={() => router.push('/services')}
                        className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                     >
                        Book Another Service
                     </button>
                  </div>

                  {/* Countdown */}
                  <div className="mt-6 text-sm text-gray-500">
                     Redirecting to My Bookings in {countdown} seconds...
                  </div>
               </div>
            </div>
         </div>
         <Footer />
      </div>
   );
};

export default BookingSuccess;