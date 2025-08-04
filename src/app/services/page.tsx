'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import { FaSearch, FaFilter, FaStar, FaMapMarkerAlt, FaClock, FaDollarSign } from 'react-icons/fa';

interface Taskio {
   _id: string;
   name: string;
   profilePicture?: string;
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
   additionalInfo: {
      estimatedDuration: string;
      equipmentProvided: string[];
      serviceType: 'individual' | 'group' | 'both';
   };
   taskio: Taskio;
   createdAt: string;
}

const Services = () => {
   const router = useRouter();
   const [services, setServices] = useState<Service[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState('');
   const [selectedCategory, setSelectedCategory] = useState('all');

   const categories = [
      'all',
      'Home Services',
      'Freelance',
      'Fitness',
      'Education',
      'Technology',
      'Creative',
      'Professional Services',
      'Health & Wellness',
      'Transportation',
      'Other'
   ];

   useEffect(() => {
      fetchServices();
   }, [searchTerm, selectedCategory]);

   const fetchServices = async () => {
      try {
         setIsLoading(true);
         const params = new URLSearchParams();
         if (searchTerm) params.append('search', searchTerm);
         if (selectedCategory !== 'all') params.append('category', selectedCategory);

         const response = await fetch(`/api/services/public?${params}`);
         const data = await response.json();

         if (response.ok) {
            setServices(data.services);
         } else {
            console.error('Failed to fetch services:', data.error);
         }
      } catch (error) {
         console.error('Error fetching services:', error);
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

   const handleServiceClick = (serviceId: string) => {
      router.push(`/services/${serviceId}`);
   };

   return (
      <div>
         <Navbar />
         <div className='relative w-full h-[40vh] md:h-[60vh]'>
            <Image
               src="/services.jpg"
               alt="services"
               fill
               className='object-cover'
               priority
            />
            <div className='absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center'>
               <h1 className='text-white text-2xl md:text-4xl font-bold'>Your to-do list, our to-do list.</h1>
            </div>
         </div>

         <div className='py-16 px-4 max-w-7xl mx-auto'>
            <h2 className='text-3xl font-bold text-center mb-8'>Hire a trusted Taskio presto</h2>

            {/* Search and Filter Section */}
            <div className='mb-8'>
               <div className='flex flex-col md:flex-row gap-4 mb-6'>
                  <div className='flex-1 relative'>
                     <FaSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                     <input
                        type='text'
                        placeholder='Search services...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500'
                     />
                  </div>
                  <div className='relative'>
                     <FaFilter className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                     <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className='pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 appearance-none bg-white'
                     >
                        {categories.map(category => (
                           <option key={category} value={category}>
                              {category === 'all' ? 'All Categories' : category}
                           </option>
                        ))}
                     </select>
                  </div>
               </div>
            </div>

            {/* Services Grid */}
            {isLoading ? (
               <div className='text-center py-12'>
                  <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-sky-900 mx-auto mb-4'></div>
                  <p className='text-gray-600'>Loading services...</p>
               </div>
            ) : services.length === 0 ? (
               <div className='text-center py-12'>
                  <div className='text-gray-500 mb-4'>
                     <FaSearch className='h-16 w-16 mx-auto' />
                  </div>
                  <h3 className='text-lg font-medium text-gray-900 mb-2'>No services found</h3>
                  <p className='text-gray-600'>Try adjusting your search or filter criteria.</p>
               </div>
            ) : (
               <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                  {services.map((service) => (
                     <div
                        key={service._id}
                        className='bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl'
                     >
                        {/* Service Image */}
                        {service.serviceImage ? (
                           <div className='relative w-full h-48'>
                              <Image
                                 src={service.serviceImage}
                                 alt={service.title}
                                 width={500}
                                 height={500}
                                 className='object-cover w-full h-full'
                              />
                           </div>
                        ) : (
                           <div className='w-full h-48 bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center'>
                              <div className='text-sky-500 text-4xl'>📋</div>
                           </div>
                        )}

                        <div className='p-6'>
                           {/* Taskio Info */}
                           <div className='flex items-center mb-4'>
                              <div className='relative w-12 h-12 mr-3'>
                                 {service.taskio.profilePicture ? (
                                    <Image
                                       src={service.taskio.profilePicture}
                                       alt={service.taskio.name}
                                       width={48}
                                       height={48}
                                       className='rounded-full object-cover'
                                    />
                                 ) : (
                                    <div className='w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center'>
                                       <span className='text-sky-600 font-semibold text-lg'>
                                          {service.taskio.name.charAt(0).toUpperCase()}
                                       </span>
                                    </div>
                                 )}
                              </div>
                              <div>
                                 <h4 className='font-semibold text-gray-900'>{service.taskio.name}</h4>
                                 <p className='text-sm text-gray-500'>{service.category}</p>
                              </div>
                           </div>

                           {/* Service Title and Description */}
                           <div className='mb-4'>
                              <h3 className='text-xl font-semibold text-gray-900 mb-2'>{service.title}</h3>
                              <p className='text-gray-600 text-sm line-clamp-3'>{service.description}</p>
                           </div>

                           {/* Service Details */}
                           <div className='space-y-3 mb-4'>
                              <div className='flex items-center gap-2 text-sm text-gray-600'>
                                 <FaDollarSign className='text-green-500' />
                                 <span className='font-medium'>{getPricingText(service)}</span>
                                 {service.isNegotiable && (
                                    <span className='bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs'>
                                       Negotiable
                                    </span>
                                 )}
                              </div>

                              <div className='flex items-center gap-2 text-sm text-gray-600'>
                                 <FaMapMarkerAlt className='text-red-500' />
                                 <span className='capitalize'>{service.location.type}</span>
                                 {service.location.serviceArea && (
                                    <span className='text-xs text-gray-500'>• {service.location.serviceArea}</span>
                                 )}
                              </div>

                              <div className='flex items-center gap-2 text-sm text-gray-600'>
                                 <FaClock className='text-blue-500' />
                                 <span>{service.additionalInfo.estimatedDuration}</span>
                              </div>
                           </div>

                           {/* Tags */}
                           {service.tags.length > 0 && (
                              <div className='mb-4'>
                                 <div className='flex flex-wrap gap-1'>
                                    {service.tags.slice(0, 3).map((tag, index) => (
                                       <span key={index} className='bg-sky-100 text-sky-800 px-2 py-1 rounded-full text-xs'>
                                          {tag}
                                       </span>
                                    ))}
                                    {service.tags.length > 3 && (
                                       <span className='bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs'>
                                          +{service.tags.length - 3} more
                                       </span>
                                    )}
                                 </div>
                              </div>
                           )}

                           {/* Skills Preview */}
                           {service.experience.skills.length > 0 && (
                              <div className='mb-4'>
                                 <p className='text-xs text-gray-500 mb-2'>Skills:</p>
                                 <div className='flex flex-wrap gap-1'>
                                    {service.experience.skills.slice(0, 2).map((skill, index) => (
                                       <span key={index} className='bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs'>
                                          {skill}
                                       </span>
                                    ))}
                                    {service.experience.skills.length > 2 && (
                                       <span className='bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs'>
                                          +{service.experience.skills.length - 2} more
                                       </span>
                                    )}
                                 </div>
                              </div>
                           )}

                           {/* Action Button */}
                           <button
                              className='w-full bg-sky-900 text-white py-3 rounded-lg hover:bg-sky-800 cursor-pointer transition-colors font-medium'
                              onClick={(e) => {
                                 e.stopPropagation();
                                 handleServiceClick(service._id);
                              }}
                           >
                              View Details
                           </button>
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </div>
         <Footer />
      </div>
   );
};

export default Services;
