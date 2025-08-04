'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import { FaMapMarkerAlt, FaClock, FaDollarSign, FaStar, FaCheck, FaPhone, FaEnvelope, FaCalendar, FaUser, FaTag, FaTools, FaShieldAlt } from 'react-icons/fa';
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
   tags: string[];
   description: string;
   serviceImage?: string;
   pricingModel: 'hourly' | 'fixed' | 'package';
   priceRange: {
      min: number;
      max: number;
      currency: string;
   };
   isNegotiable: boolean;
   availability: {
      days: string[];
      times: string[];
      urgency: 'low' | 'medium' | 'high';
   };
   location: {
      type: 'in-person' | 'remote' | 'both';
      serviceRadius?: number;
      serviceArea?: string;
   };
   experience: {
      skills: string[];
      certifications: string[];
      yearsOfExperience: number;
   };
   portfolio: {
      images: string[];
      links: string[];
   };
   booking: {
      type: 'instant' | 'approval' | 'consultation';
      requirements: string[];
      cancellationPolicy: string;
   };
   additionalInfo: {
      estimatedDuration: string;
      equipmentProvided: string[];
      serviceType: 'individual' | 'group' | 'both';
   };
   taskio: Taskio;
   createdAt: string;
}

const ServiceDetail = () => {
   const params = useParams();
   const router = useRouter();
   const [service, setService] = useState<Service | null>(null);
   const [isLoading, setIsLoading] = useState(true);
   const [showBookingModal, setShowBookingModal] = useState(false);

   useEffect(() => {
      if (params.id) {
         fetchService();
      }
   }, [params.id]);

   const fetchService = async () => {
      try {
         setIsLoading(true);
         const response = await fetch(`/api/services/${params.id}`);
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

   const formatPrice = (min: number, max: number, model: string) => {
      if (min === max) {
         return `$${min}`;
      }
      return `$${min}-$${max}`;
   };

   const getPricingText = (service: Service) => {
      const price = formatPrice(service.priceRange.min, service.priceRange.max, service.pricingModel);
      const model = service.pricingModel.charAt(0).toUpperCase() + service.pricingModel.slice(1);
      return `${price} (${model})`;
   };

   const formatDays = (days: string[]) => {
      return days.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(', ');
   };

   const formatTimes = (times: string[]) => {
      return times.map(time => time.charAt(0).toUpperCase() + time.slice(1)).join(', ');
   };

   if (isLoading) {
      return (
         <div>
            <Navbar />
            <div className="min-h-screen bg-gray-50 pt-20">
               <div className="max-w-7xl mx-auto py-12 px-4">
                  <div className="text-center">
                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-900 mx-auto mb-4"></div>
                     <p className="text-gray-600">Loading service details...</p>
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
                     <p className="text-gray-600 mb-6">The service you're looking for doesn't exist or has been removed.</p>
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
                     <li className="text-gray-900">{service.title}</li>
                  </ol>
               </nav>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Main Content */}
                  <div className="lg:col-span-2">
                     {/* Service Image */}
                     {service.serviceImage ? (
                        <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
                           <Image
                              src={service.serviceImage}
                              alt={service.title}
                              fill
                              className="object-cover"
                           />
                        </div>
                     ) : (
                        <div className="w-full h-96 bg-gradient-to-br from-sky-100 to-blue-100 rounded-lg mb-8 flex items-center justify-center">
                           <div className="text-sky-500 text-8xl">📋</div>
                        </div>
                     )}

                     {/* Service Title and Taskio Info */}
                     <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                        <div className="flex items-start justify-between mb-6">
                           <div className="flex-1">
                              <h1 className="text-3xl font-bold text-gray-900 mb-2">{service.title}</h1>
                              <p className="text-lg text-gray-600 mb-4">{service.description}</p>

                              {/* Taskio Info */}
                              <div className="flex items-center">
                                 <div className="relative w-16 h-16 mr-4">
                                    {service.taskio?.profilePicture ? (
                                       <Image
                                          src={service.taskio.profilePicture}
                                          alt={service.taskio.name || 'Taskio'}
                                          width={64}
                                          height={64}
                                          className="rounded-full object-cover"
                                       />
                                    ) : (
                                       <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center">
                                          <span className="text-sky-600 font-semibold text-2xl">
                                             {(service.taskio?.name || 'T').charAt(0).toUpperCase()}
                                          </span>
                                       </div>
                                    )}
                                 </div>
                                 <div>
                                    <h3 className="text-xl font-semibold text-gray-900">{service.taskio?.name || 'Unknown Taskio'}</h3>
                                    <p className="text-gray-600">{service.category}</p>
                                    {service.experience.yearsOfExperience > 0 && (
                                       <p className="text-sm text-gray-500">
                                          {service.experience.yearsOfExperience} years of experience
                                       </p>
                                    )}
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Quick Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           <div className="flex items-center gap-2">
                              Price:
                              <span className='text-gray-600'>{getPricingText(service)}</span>
                              {service.isNegotiable && (
                                 <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                                    Negotiable
                                 </span>
                              )}
                           </div>
                           <div className="flex items-center gap-2">
                              Location:
                              <span className='text-gray-600'>{service.location.type}</span>
                           </div>
                           <div className="flex items-center gap-2">
                              Duration:
                              <span className='text-gray-600'>{service.additionalInfo.estimatedDuration}</span>
                           </div>
                        </div>
                     </div>

                     {/* Detailed Information */}
                     <div className="space-y-8">
                        {/* Skills & Experience */}
                        {service.experience.skills.length > 0 && (
                           <div className="bg-white rounded-lg shadow-sm p-6">
                              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                 Skills & Expertise
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                 {service.experience.skills.map((skill, index) => (
                                    <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                       {skill}
                                    </span>
                                 ))}
                              </div>
                           </div>
                        )}

                        {/* Certifications */}
                        {service.experience.certifications.length > 0 && (
                           <div className="bg-white rounded-lg shadow-sm p-6">
                              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                 Certifications
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                 {service.experience.certifications.map((cert, index) => (
                                    <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                                       {cert}
                                    </span>
                                 ))}
                              </div>
                           </div>
                        )}

                        {/* Availability */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                           <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                              Availability
                           </h3>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                 <h4 className="font-medium text-gray-900 mb-2">Available Days</h4>
                                 <p className="text-gray-600">{formatDays(service.availability.days)}</p>
                              </div>
                              <div>
                                 <h4 className="font-medium text-gray-900 mb-2">Available Times</h4>
                                 <p className="text-gray-600">{formatTimes(service.availability.times)}</p>
                              </div>
                           </div>
                        </div>

                        {/* Equipment Provided */}
                        {service.additionalInfo.equipmentProvided.length > 0 && (
                           <div className="bg-white rounded-lg shadow-sm p-6">
                              <h3 className="text-xl font-semibold text-gray-900 mb-4">Equipment & Tools Provided</h3>
                              <div className="flex flex-wrap gap-2">
                                 {service.additionalInfo.equipmentProvided.map((equipment, index) => (
                                    <span key={index} className="bg-sky-100 text-sky-800 px-3 py-1 rounded-full text-sm">
                                       {equipment}
                                    </span>
                                 ))}
                              </div>
                           </div>
                        )}

                        {/* Cancellation Policy */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                           <h3 className="text-xl font-semibold text-gray-900 mb-4">Cancellation Policy</h3>
                           <p className="text-gray-600">{service.booking.cancellationPolicy}</p>
                        </div>
                     </div>
                  </div>

                  {/* Sidebar */}
                  <div className="lg:col-span-1">
                     <div className="sticky top-24">
                        {/* Booking Card */}
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                           <h3 className="text-xl font-semibold text-gray-900 mb-4">Book This Service</h3>

                           <div className="space-y-4 mb-6">
                              <div className="flex justify-between items-center">
                                 <span className="text-gray-600">Price:</span>
                                 <span className="font-semibold text-lg">{getPricingText(service)}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                 <span className="text-gray-600">Duration:</span>
                                 <span>{service.additionalInfo.estimatedDuration}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                 <span className="text-gray-600">Service Type:</span>
                                 <span className="capitalize">{service.additionalInfo.serviceType}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                 <span className="text-gray-600">Booking Type:</span>
                                 <span className="capitalize">{service.booking.type}</span>
                              </div>
                           </div>

                           <button
                              onClick={() => setShowBookingModal(true)}
                              className="w-full bg-sky-900 text-white py-3 rounded-lg hover:bg-sky-800 transition-colors font-medium mb-4"
                           >
                              Book Now
                           </button>

                           <div className="text-center">
                              <p className="text-sm text-gray-500">
                                 {service.booking.type === 'instant' ? 'Instant booking available' :
                                    service.booking.type === 'approval' ? 'Request approval required' :
                                       'Consultation required'}
                              </p>
                           </div>
                        </div>

                        {/* Contact Info */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                           <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
                           <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                 Taskio:
                                 <span className='text-gray-600'>{service.taskio?.name || 'Unknown Taskio'}</span>
                              </div>
                              {service.taskio?.email && (
                                 <div className="flex items-center gap-3">
                                    Email:
                                    <span className='text-gray-600'>{service.taskio.email}</span>
                                 </div>
                              )}
                              <div className="flex items-center gap-3">
                                 Location:
                                 <span className='text-gray-600'>{service.location.type}</span>
                                 {service.location.serviceArea && (
                                    <span className="text-sm text-gray-500">• {service.location.serviceArea}</span>
                                 )}
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Booking Modal */}
         {showBookingModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
               <div className="bg-white rounded-lg max-w-md w-full p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Book Service</h3>
                  <p className="text-gray-600 mb-6">
                     This feature is coming soon! For now, please contact {service.taskio?.name || 'the taskio'} directly to book this service.
                  </p>
                  <div className="flex gap-3">
                     <button
                        onClick={() => setShowBookingModal(false)}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                     >
                        Close
                     </button>
                     <button
                        onClick={() => {
                           setShowBookingModal(false);
                           // Here you could implement actual booking logic
                           toast.success('Booking feature coming soon!');
                        }}
                        className="flex-1 bg-sky-900 text-white px-4 py-2 rounded-md hover:bg-sky-800"
                     >
                        Coming Soon
                     </button>
                  </div>
               </div>
            </div>
         )}

         <Footer />
      </div>
   );
};

export default ServiceDetail; 