'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaSearch, FaMapMarkerAlt, FaDollarSign, FaClock } from 'react-icons/fa';

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

const Hero = () => {
   const router = useRouter();
   const [searchTerm, setSearchTerm] = useState('');
   const [searchResults, setSearchResults] = useState<Service[]>([]);
   const [isSearching, setIsSearching] = useState(false);
   const [showResults, setShowResults] = useState(false);
   const searchRef = useRef<HTMLDivElement>(null);

   // Close search results when clicking outside
   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
            setShowResults(false);
         }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
   }, []);

   // Search services when search term changes
   useEffect(() => {
      const searchServices = async () => {
         if (searchTerm.trim().length === 0) {
            setSearchResults([]);
            setShowResults(false);
            return;
         }

         if (searchTerm.trim().length < 2) {
            return;
         }

         setIsSearching(true);
         try {
            const params = new URLSearchParams();
            params.append('search', searchTerm.trim());

            const response = await fetch(`/api/services/public?${params}`);
            const data = await response.json();

            if (response.ok) {
               setSearchResults(data.services.slice(0, 5)); // Limit to 5 results
               setShowResults(true);
            } else {
               console.error('Failed to fetch services:', data.error);
               setSearchResults([]);
            }
         } catch (error) {
            console.error('Error fetching services:', error);
            setSearchResults([]);
         } finally {
            setIsSearching(false);
         }
      };

      const debounceTimer = setTimeout(searchServices, 300);
      return () => clearTimeout(debounceTimer);
   }, [searchTerm]);

   const handleServiceClick = (serviceId: string) => {
      router.push(`/services/${serviceId}`);
      setShowResults(false);
      setSearchTerm('');
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

   return (
      <div className='relative min-h-screen flex items-center justify-center overflow-hidden pt-16'>
         <div
            className="absolute inset-0 bg-[url(/hero.jpg)] bg-cover bg-center bg-no-repeat"
         >
            <div className="absolute inset-0 bg-black/50" />
         </div>

         <div className='text-center max-w-2xl z-10 px-4'>
            <h1 className='text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 sm:mb-8'>
               Book <span className='text-sky-500'>trusted</span> help for campus services
            </h1>

            {/* Search Form */}
            <div className="relative w-full max-w-xl mx-auto" ref={searchRef}>
               <form className="flex items-center justify-center w-full" onSubmit={(e) => e.preventDefault()}>
                  <div className="relative w-full">
                     <input
                        type="text"
                        placeholder="What do you need help with?"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-l-full text-base sm:text-lg font-semibold bg-white text-gray-900 border border-gray-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                     />
                     {isSearching && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                           <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-sky-500"></div>
                        </div>
                     )}
                  </div>
                  <button
                     type="submit"
                     className="group bg-sky-900 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-r-full flex items-center justify-center text-xl sm:text-2xl shadow-lg border border-blue-900"
                     aria-label="Search"
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 sm:w-7 sm:h-7 group-hover:scale-110 transition duration-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
                     </svg>
                  </button>
               </form>

               {/* Search Results Dropdown */}
               {showResults && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-50">
                     {searchResults.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                           {isSearching ? 'Searching...' : 'No services found'}
                        </div>
                     ) : (
                        <div className="py-2">
                           {searchResults.map((service) => (
                              <div
                                 key={service._id}
                                 className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                 onClick={() => handleServiceClick(service._id)}
                              >
                                 <div className="flex items-start gap-3">
                                    {/* Service Image */}
                                    <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                                       {service.serviceImage ? (
                                          <Image
                                             src={service.serviceImage}
                                             alt={service.title}
                                             width={48}
                                             height={48}
                                             className="object-cover w-full h-full"
                                          />
                                       ) : (
                                          <div className="w-full h-full bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center">
                                             <span className="text-sky-500 text-lg">📋</span>
                                          </div>
                                       )}
                                    </div>

                                    {/* Service Details */}
                                    <div className="flex-1 min-w-0">
                                       <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">
                                          {service.title}
                                       </h3>
                                       <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                                          {service.description}
                                       </p>

                                       {/* Service Meta */}
                                       <div className="flex items-center gap-4 text-xs text-gray-500">
                                          <div className="flex items-center gap-1">
                                             <FaDollarSign className="text-green-500" />
                                             <span>{getPricingText(service)}</span>
                                          </div>
                                          <div className="flex items-center gap-1">
                                             <FaMapMarkerAlt className="text-red-500" />
                                             <span className="capitalize">{service.location.type}</span>
                                          </div>
                                          <div className="flex items-center gap-1">
                                             <FaClock className="text-blue-500" />
                                             <span>{service.additionalInfo.estimatedDuration}</span>
                                          </div>
                                       </div>

                                       {/* Taskio Name */}
                                       <div className="flex items-center gap-2 mt-2">
                                          <div className="w-6 h-6 rounded-full bg-sky-100 flex items-center justify-center">
                                             <span className="text-sky-600 font-semibold text-xs">
                                                {service.taskio.name.charAt(0).toUpperCase()}
                                             </span>
                                          </div>
                                          <span className="text-xs text-gray-600 font-medium">
                                             {service.taskio.name}
                                          </span>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           ))}

                           {/* View All Results Link */}
                           {searchResults.length > 0 && (
                              <div className="px-4 py-3 border-t border-gray-200">
                                 <button
                                    onClick={() => {
                                       router.push(`/services?search=${encodeURIComponent(searchTerm)}`);
                                       setShowResults(false);
                                       setSearchTerm('');
                                    }}
                                    className="w-full text-center text-sky-600 hover:text-sky-700 font-medium text-sm"
                                 >
                                    View all results for "{searchTerm}"
                                 </button>
                              </div>
                           )}
                        </div>
                     )}
                  </div>
               )}
            </div>
         </div>
      </div>
   )
}

export default Hero
