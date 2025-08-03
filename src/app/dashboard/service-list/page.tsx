'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useApi } from '@/hooks/useApi';
import ProtectedRoute from '@/components/ProtectedRoute';
import ServiceForm from '@/components/ServiceForm';
import { FaPlus, FaEdit, FaTrash, FaExclamationTriangle, FaTools, FaEye, FaEyeSlash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
   isActive: boolean;
   createdAt: string;
   updatedAt: string;
}

export default function ServiceList() {
   const { user } = useAuth();
   const router = useRouter();
   const api = useApi();
   const [services, setServices] = useState<Service[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [showForm, setShowForm] = useState(false);
   const [selectedService, setSelectedService] = useState<Service | null>(null);
   const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; serviceId: string; serviceTitle: string }>({
      show: false,
      serviceId: '',
      serviceTitle: ''
   });

   // Redirect non-taskio users to profile page
   useEffect(() => {
      if (user && user.role !== 'taskio') {
         router.push('/profile');
         return;
      }
   }, [user, router]);

   useEffect(() => {
      if (user && user.role === 'taskio') {
         fetchServices();
      }
   }, [user]);

   const fetchServices = async () => {
      try {
         const response = await api.get('/api/services');
         setServices(response.services);
      } catch (error) {
         console.error('Service fetch error:', error);
         if (error instanceof Error) {
            if (error.message.includes('Access denied') || error.message.includes('Only taskios can manage services')) {
               toast.error('You do not have permission to access this page. Redirecting...');
               router.push('/profile');
            } else if (error.message.includes('Session expired')) {
               toast.error('Session expired. Please login again.');
            } else {
               toast.error(`Failed to fetch services: ${error.message}`);
            }
         } else {
            toast.error('Failed to fetch services');
         }
      } finally {
         setIsLoading(false);
      }
   };

   const handleServiceCreated = () => {
      setShowForm(false);
      fetchServices();
   };

   const handleEditService = (service: Service) => {
      setSelectedService(service);
      setShowForm(true);
   };

   const handleDeleteService = async (serviceId: string, serviceTitle: string) => {
      setDeleteConfirm({ show: true, serviceId, serviceTitle });
   };

   const confirmDelete = async () => {
      try {
         await api.delete(`/api/services/${deleteConfirm.serviceId}`);
         toast.success('Service deleted successfully');
         fetchServices();
      } catch (error) {
         toast.error('Failed to delete service');
      } finally {
         setDeleteConfirm({ show: false, serviceId: '', serviceTitle: '' });
      }
   };

   const cancelDelete = () => {
      setDeleteConfirm({ show: false, serviceId: '', serviceTitle: '' });
   };

   const toggleServiceStatus = async (serviceId: string, currentStatus: boolean) => {
      try {
         await api.patch(`/api/services/${serviceId}`, { isActive: !currentStatus });
         toast.success(`Service ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
         fetchServices();
      } catch (error) {
         toast.error('Failed to update service status');
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

   // Show loading while checking role or if user is not a taskio
   if (!user || user.role !== 'taskio') {
      return (
         <div className="min-h-screen flex items-center justify-center w-full">
            <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-900 mx-auto mb-4"></div>
               <p className="text-gray-600">Loading...</p>
            </div>
         </div>
      );
   }

   if (isLoading) {
      return (
         <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 pt-20 w-full">
               <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                  <div className="text-center">
                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-900 mx-auto mb-4"></div>
                     <p className="text-gray-600">Loading services...</p>
                  </div>
               </div>
            </div>
         </ProtectedRoute>
      );
   }

   return (
      <ProtectedRoute>
         <div className="min-h-screen bg-gray-50 w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
               {/* Header */}
               <div className="mb-8">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                     <div className="flex-1">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Services</h1>
                        <p className="text-gray-600 mt-2">Manage your service offerings</p>
                     </div>
                     <div className="flex-shrink-0">
                        <button
                           onClick={() => setShowForm(true)}
                           className="w-full sm:w-auto bg-sky-900 text-white px-4 py-2 rounded-md hover:bg-sky-800 transition-colors flex items-center justify-center gap-2"
                        >
                           <FaPlus className="h-4 w-4 text-white" />
                           <span className="hidden sm:inline">Add New Service</span>
                           <span className="sm:hidden">Add Service</span>
                        </button>
                     </div>
                  </div>
               </div>

               {/* Service Form Modal */}
               {showForm && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                     <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <ServiceForm
                           onSuccess={handleServiceCreated}
                           onCancel={() => {
                              setShowForm(false);
                              setSelectedService(null);
                           }}
                        />
                     </div>
                  </div>
               )}

               {/* Delete Confirmation Modal */}
               {deleteConfirm.show && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                     <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                           <div className="flex-shrink-0">
                              <FaExclamationTriangle className="h-6 w-6 text-red-500" />
                           </div>
                           <div>
                              <h3 className="text-lg font-semibold text-gray-900">Delete Service</h3>
                           </div>
                        </div>
                        <p className="text-gray-600 mb-6">
                           Are you sure you want to delete <span className="font-semibold">"{deleteConfirm.serviceTitle}"</span>?
                           This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end">
                           <button
                              onClick={cancelDelete}
                              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                           >
                              Cancel
                           </button>
                           <button
                              onClick={confirmDelete}
                              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                           >
                              Delete
                           </button>
                        </div>
                     </div>
                  </div>
               )}

               {/* Services Grid */}
               {services.length === 0 ? (
                  <div className="text-center py-12">
                     <FaTools className="h-16 w-16 text-sky-900 mx-auto mb-4" />
                     <h3 className="text-lg font-medium text-gray-900 mb-2">No services yet</h3>
                     <p className="text-gray-600 mb-6">Start by adding your first service to attract customers.</p>
                     <button
                        onClick={() => setShowForm(true)}
                        className="bg-sky-900 text-white px-6 py-3 rounded-md hover:bg-sky-800 transition-colors"
                     >
                        Add Your First Service
                     </button>
                  </div>
               ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                     {services.map((service) => (
                        <div key={service._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                           {/* Service Image */}
                           {service.serviceImage && (
                              <div className="relative w-full h-48">
                                 <Image
                                    src={service.serviceImage}
                                    alt={service.title}
                                    width={500}
                                    height={500}
                                    priority
                                    className="object-cover w-full h-48"
                                 />
                              </div>
                           )}

                           {/* Service Header */}
                           <div className="p-4 sm:p-6 border-b border-gray-200">
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                 <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">{service.title}</h3>
                                    <p className="text-sm text-gray-600 mb-2">{service.category}</p>
                                    <div className="flex flex-wrap gap-1 mb-3">
                                       {service.tags.slice(0, 3).map((tag, index) => (
                                          <span key={index} className="bg-sky-100 text-sky-800 px-2 py-1 rounded-full text-xs">
                                             {tag}
                                          </span>
                                       ))}
                                       {service.tags.length > 3 && (
                                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                                             +{service.tags.length - 3} more
                                          </span>
                                       )}
                                    </div>
                                 </div>
                                 <div className="flex-shrink-0">
                                    <button
                                       onClick={() => toggleServiceStatus(service._id, service.isActive)}
                                       className={`px-3 py-1 rounded-full text-xs font-medium ${service.isActive
                                          ? 'bg-green-100 text-green-800'
                                          : 'bg-red-100 text-red-800'
                                          }`}
                                    >
                                       {service.isActive ? 'Active' : 'Inactive'}
                                    </button>
                                 </div>
                              </div>
                           </div>

                           {/* Service Details */}
                           <div className="p-4 sm:p-6">
                              <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                                 {service.description}
                              </p>

                              <div className="space-y-3">
                                 <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <p className='text-gray-900'>Pricing:</p>
                                    <span className="truncate">{getPricingText(service)}</span>
                                    {service.isNegotiable && (
                                       <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs flex-shrink-0">
                                          Negotiable
                                       </span>
                                    )}
                                 </div>

                                 <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <p className='text-gray-900'>Location:</p>
                                    <span className="capitalize truncate">{service.location.type}</span>
                                    {service.location.serviceArea && (
                                       <span className="text-xs text-gray-500 truncate">• {service.location.serviceArea}</span>
                                    )}
                                 </div>

                                 <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <p className='text-gray-900'>Duration:</p>
                                    <span className="truncate">{service.additionalInfo.estimatedDuration}</span>
                                 </div>

                                 <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <p className='text-gray-900'>Service Type:</p>
                                    <span className="capitalize truncate">{service.additionalInfo.serviceType}</span>
                                 </div>
                              </div>

                              {/* Skills Preview */}
                              {service.experience.skills.length > 0 && (
                                 <div className="mt-4">
                                    <p className="text-xs text-gray-500 mb-2">Skills:</p>
                                    <div className="flex flex-wrap gap-1">
                                       {service.experience.skills.slice(0, 3).map((skill, index) => (
                                          <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                             {skill}
                                          </span>
                                       ))}
                                       {service.experience.skills.length > 3 && (
                                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                                             +{service.experience.skills.length - 3} more
                                          </span>
                                       )}
                                    </div>
                                 </div>
                              )}
                           </div>

                           {/* Action Buttons */}
                           <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                 <div className="flex items-center gap-4">
                                    <button
                                       onClick={() => handleEditService(service)}
                                       className="hover:scale-105 transition-all duration-300 text-sm font-medium flex items-center gap-1"
                                    >
                                       <FaEdit className="h-4 w-4" />
                                       <span className="hidden sm:inline">Edit</span>
                                    </button>
                                    <button
                                       onClick={() => handleDeleteService(service._id, service.title)}
                                       className="text-red-600 hover:scale-105 transition-all duration-300 text-sm font-medium flex items-center gap-1"
                                    >
                                       <FaTrash className="h-4 w-4" />
                                       <span className="hidden sm:inline">Delete</span>
                                    </button>
                                 </div>
                                 <span className="text-xs text-gray-500">
                                    Created {new Date(service.createdAt).toLocaleDateString()}
                                 </span>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               )}

               {/* Stats */}
               {services.length > 0 && (
                  <div className="mt-8 bg-white rounded-lg shadow p-4 sm:p-6">
                     <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Statistics</h3>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                           <div className="text-2xl font-bold">{services.length}</div>
                           <div className="text-sm text-gray-600">Total Services</div>
                        </div>
                        <div className="text-center">
                           <div className="text-2xl font-bold">
                              {services.filter(s => s.isActive).length}
                           </div>
                           <div className="text-sm text-gray-600">Active Services</div>
                        </div>
                        <div className="text-center">
                           <div className="text-2xl font-bold text">
                              {services.filter(s => s.location.type === 'remote').length}
                           </div>
                           <div className="text-sm text-gray-600">Remote Services</div>
                        </div>
                        <div className="text-center">
                           <div className="text-2xl font-bold ">
                              {services.filter(s => s.booking.type === 'instant').length}
                           </div>
                           <div className="text-sm text-gray-600">Instant Booking</div>
                        </div>
                     </div>
                  </div>
               )}
            </div>
         </div>
      </ProtectedRoute>
   );
} 