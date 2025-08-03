'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useApi } from '@/hooks/useApi';
import { FaPlus, FaTimes, FaSave } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface ServiceFormProps {
   onSuccess?: () => void;
   onCancel?: () => void;
}

export default function ServiceForm({ onSuccess, onCancel }: ServiceFormProps) {
   const { user } = useAuth();
   const api = useApi();
   const [isSubmitting, setIsSubmitting] = useState(false);

   const [formData, setFormData] = useState({
      title: '',
      category: '',
      tags: [] as string[],
      description: '',
      pricingModel: 'hourly' as 'hourly' | 'fixed' | 'package',
      priceRange: {
         min: 0,
         max: 0,
         currency: 'USD'
      },
      isNegotiable: false,
      availability: {
         days: [] as string[],
         times: [] as string[],
         urgency: 'medium' as 'low' | 'medium' | 'high'
      },
      location: {
         type: 'in-person' as 'in-person' | 'remote' | 'both',
         serviceRadius: 0,
         serviceArea: ''
      },
      experience: {
         skills: [] as string[],
         certifications: [] as string[],
         yearsOfExperience: 0
      },
      portfolio: {
         images: [] as string[],
         links: [] as string[]
      },
      booking: {
         type: 'approval' as 'instant' | 'approval' | 'consultation',
         requirements: [] as string[],
         cancellationPolicy: ''
      },
      additionalInfo: {
         estimatedDuration: '',
         equipmentProvided: [] as string[],
         serviceType: 'individual' as 'individual' | 'group' | 'both'
      }
   });

   const [tempTag, setTempTag] = useState('');
   const [tempSkill, setTempSkill] = useState('');
   const [tempCertification, setTempCertification] = useState('');
   const [tempRequirement, setTempRequirement] = useState('');
   const [tempEquipment, setTempEquipment] = useState('');
   const [tempPortfolioLink, setTempPortfolioLink] = useState('');

   const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
   const timeSlots = ['morning', 'afternoon', 'evening', 'night'];
   const categories = [
      'Home Services', 'Freelance', 'Fitness', 'Education', 'Technology',
      'Creative', 'Professional Services', 'Health & Wellness', 'Transportation', 'Other'
   ];

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;

      if (type === 'checkbox') {
         const checked = (e.target as HTMLInputElement).checked;
         setFormData(prev => ({
            ...prev,
            [name]: checked
         }));
      } else {
         setFormData(prev => ({
            ...prev,
            [name]: value
         }));
      }
   };

   const handleNestedChange = (section: string, field: string, value: any) => {
      setFormData(prev => ({
         ...prev,
         [section]: {
            ...(prev as any)[section],
            [field]: value
         }
      }));
   };

   const addArrayItem = (section: string, field: string, value: string) => {
      if (value.trim()) {
         setFormData(prev => {
            // Handle direct arrays (like tags)
            if (section === field) {
               return {
                  ...prev,
                  [section]: [...(prev as any)[section], value.trim()]
               };
            }

            // Handle nested object arrays
            return {
               ...prev,
               [section]: {
                  ...(prev as any)[section],
                  [field]: [...(prev as any)[section][field], value.trim()]
               }
            };
         });
      }
   };

   const removeArrayItem = (section: string, field: string, index: number) => {
      setFormData(prev => {
         // Handle direct arrays (like tags)
         if (section === field) {
            return {
               ...prev,
               [section]: (prev as any)[section].filter((_: any, i: number) => i !== index)
            };
         }

         // Handle nested object arrays
         return {
            ...prev,
            [section]: {
               ...(prev as any)[section],
               [field]: (prev as any)[section][field].filter((_: any, i: number) => i !== index)
            }
         };
      });
   };

   const toggleArrayItem = (section: string, field: string, value: string) => {
      setFormData(prev => {
         const currentArray = (prev as any)[section][field];
         const newArray = currentArray.includes(value)
            ? currentArray.filter((item: string) => item !== value)
            : [...currentArray, value];

         return {
            ...prev,
            [section]: {
               ...(prev as any)[section],
               [field]: newArray
            }
         };
      });
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
         await api.post('/api/services', formData);
         toast.success('Service created successfully!');
         onSuccess?.();
      } catch (error) {
         toast.error('Failed to create service. Please try again.');
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
         <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Add New Service</h2>
            <button
               onClick={onCancel}
               className="text-gray-500 hover:text-gray-700"
            >
               <FaTimes className="h-6 w-6" />
            </button>
         </div>

         <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Service Details */}
            <div className="bg-gray-50 p-6 rounded-lg">
               <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Service Details</h3>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                        Service Title *
                     </label>
                     <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                        placeholder="e.g., House Cleaning, Graphic Design"
                        required
                     />
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                     </label>
                     <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                        required
                     >
                        <option value="">Select a category</option>
                        {categories.map(category => (
                           <option key={category} value={category}>{category}</option>
                        ))}
                     </select>
                  </div>
               </div>

               <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                     {formData.tags.map((tag, index) => (
                        <span key={index} className="bg-sky-100 text-sky-900 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                           {tag}
                           <button
                              type="button"
                              onClick={() => removeArrayItem('tags', 'tags', index)}
                              className="text-sky-600 hover:text-sky-900"
                           >
                              <FaTimes className="h-3 w-3" />
                           </button>
                        </span>
                     ))}
                  </div>
                  <div className="flex gap-2">
                     <input
                        type="text"
                        value={tempTag}
                        onChange={(e) => setTempTag(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                        placeholder="Add a tag"
                     />
                     <button
                        type="button"
                        onClick={() => {
                           addArrayItem('tags', 'tags', tempTag);
                           setTempTag('');
                        }}
                        className="px-4 py-2 bg-sky-900 text-white rounded-md hover:bg-sky-800"
                     >
                        <FaPlus className="h-4 w-4" />
                     </button>
                  </div>
               </div>

               <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     Description *
                  </label>
                  <textarea
                     name="description"
                     value={formData.description}
                     onChange={handleInputChange}
                     rows={4}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                     placeholder="Describe your service in detail..."
                     required
                  />
               </div>
            </div>

            {/* Pricing & Availability */}
            <div className="bg-gray-50 p-6 rounded-lg">
               <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Availability</h3>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pricing Model *
                     </label>
                     <select
                        name="pricingModel"
                        value={formData.pricingModel}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                        required
                     >
                        <option value="hourly">Hourly</option>
                        <option value="fixed">Fixed Price</option>
                        <option value="package">Package Deal</option>
                     </select>
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Price *
                     </label>
                     <input
                        type="number"
                        value={formData.priceRange.min}
                        onChange={(e) => handleNestedChange('priceRange', 'min', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                        min="0"
                        required
                     />
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum Price *
                     </label>
                     <input
                        type="number"
                        value={formData.priceRange.max}
                        onChange={(e) => handleNestedChange('priceRange', 'max', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                        min="0"
                        required
                     />
                  </div>
               </div>

               <div className="mt-4 flex items-center">
                  <input
                     type="checkbox"
                     name="isNegotiable"
                     checked={formData.isNegotiable}
                     onChange={handleInputChange}
                     className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                     Price is negotiable
                  </label>
               </div>

               <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     Available Days
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                     {daysOfWeek.map(day => (
                        <label key={day} className="flex items-center">
                           <input
                              type="checkbox"
                              checked={formData.availability.days.includes(day)}
                              onChange={() => toggleArrayItem('availability', 'days', day)}
                              className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                           />
                           <span className="ml-2 text-sm text-gray-700 capitalize">{day}</span>
                        </label>
                     ))}
                  </div>
               </div>

               <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     Available Times
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                     {timeSlots.map(time => (
                        <label key={time} className="flex items-center">
                           <input
                              type="checkbox"
                              checked={formData.availability.times.includes(time)}
                              onChange={() => toggleArrayItem('availability', 'times', time)}
                              className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                           />
                           <span className="ml-2 text-sm text-gray-700 capitalize">{time}</span>
                        </label>
                     ))}
                  </div>
               </div>

               <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     Urgency Level
                  </label>
                  <select
                     value={formData.availability.urgency}
                     onChange={(e) => handleNestedChange('availability', 'urgency', e.target.value)}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                     <option value="low">Low</option>
                     <option value="medium">Medium</option>
                     <option value="high">High</option>
                  </select>
               </div>
            </div>

            {/* Location & Service Area */}
            <div className="bg-gray-50 p-6 rounded-lg">
               <h3 className="text-lg font-semibold text-gray-900 mb-4">Location & Service Area</h3>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                        Service Type *
                     </label>
                     <select
                        value={formData.location.type}
                        onChange={(e) => handleNestedChange('location', 'type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                        required
                     >
                        <option value="in-person">In-Person</option>
                        <option value="remote">Remote</option>
                        <option value="both">Both</option>
                     </select>
                  </div>

                  {formData.location.type !== 'remote' && (
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                           Service Radius (miles)
                        </label>
                        <input
                           type="number"
                           value={formData.location.serviceRadius}
                           onChange={(e) => handleNestedChange('location', 'serviceRadius', Number(e.target.value))}
                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                           min="0"
                        />
                     </div>
                  )}
               </div>

               <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     Service Area
                  </label>
                  <input
                     type="text"
                     value={formData.location.serviceArea}
                     onChange={(e) => handleNestedChange('location', 'serviceArea', e.target.value)}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                     placeholder="e.g., Within 10 miles of NYC"
                  />
               </div>
            </div>

            {/* Experience & Qualifications */}
            <div className="bg-gray-50 p-6 rounded-lg">
               <h3 className="text-lg font-semibold text-gray-900 mb-4">Experience & Qualifications</h3>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                        Years of Experience
                     </label>
                     <input
                        type="number"
                        value={formData.experience.yearsOfExperience}
                        onChange={(e) => handleNestedChange('experience', 'yearsOfExperience', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                        min="0"
                     />
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                        Service Type *
                     </label>
                     <select
                        value={formData.additionalInfo.serviceType}
                        onChange={(e) => handleNestedChange('additionalInfo', 'serviceType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                        required
                     >
                        <option value="individual">Individual</option>
                        <option value="group">Group</option>
                        <option value="both">Both</option>
                     </select>
                  </div>
               </div>

               <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     Skills
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                     {formData.experience.skills.map((skill, index) => (
                        <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                           {skill}
                           <button
                              type="button"
                              onClick={() => removeArrayItem('experience', 'skills', index)}
                              className="text-green-600 hover:text-green-800"
                           >
                              <FaTimes className="h-3 w-3" />
                           </button>
                        </span>
                     ))}
                  </div>
                  <div className="flex gap-2">
                     <input
                        type="text"
                        value={tempSkill}
                        onChange={(e) => setTempSkill(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                        placeholder="Add a skill"
                     />
                     <button
                        type="button"
                        onClick={() => {
                           addArrayItem('experience', 'skills', tempSkill);
                           setTempSkill('');
                        }}
                        className="px-4 py-2 bg-sky-900 text-white rounded-md hover:bg-sky-800"
                     >
                        <FaPlus className="h-4 w-4" />
                     </button>
                  </div>
               </div>

               <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     Certifications
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                     {formData.experience.certifications.map((cert, index) => (
                        <span key={index} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                           {cert}
                           <button
                              type="button"
                              onClick={() => removeArrayItem('experience', 'certifications', index)}
                              className="text-purple-600 hover:text-purple-800"
                           >
                              <FaTimes className="h-3 w-3" />
                           </button>
                        </span>
                     ))}
                  </div>
                  <div className="flex gap-2">
                     <input
                        type="text"
                        value={tempCertification}
                        onChange={(e) => setTempCertification(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                        placeholder="Add a certification"
                     />
                     <button
                        type="button"
                        onClick={() => {
                           addArrayItem('experience', 'certifications', tempCertification);
                           setTempCertification('');
                        }}
                        className="px-4 py-2 bg-sky-900 text-white rounded-md hover:bg-sky-800"
                     >
                        <FaPlus className="h-4 w-4" />
                     </button>
                  </div>
               </div>
            </div>

            {/* Booking & Requirements */}
            <div className="bg-gray-50 p-6 rounded-lg">
               <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking & Requirements</h3>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                        Booking Type *
                     </label>
                     <select
                        value={formData.booking.type}
                        onChange={(e) => handleNestedChange('booking', 'type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                        required
                     >
                        <option value="instant">Instant Booking</option>
                        <option value="approval">Request Approval</option>
                        <option value="consultation">Consultation First</option>
                     </select>
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estimated Duration *
                     </label>
                     <input
                        type="text"
                        value={formData.additionalInfo.estimatedDuration}
                        onChange={(e) => handleNestedChange('additionalInfo', 'estimatedDuration', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                        placeholder="e.g., 2-hour session"
                        required
                     />
                  </div>
               </div>

               <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     Client Requirements
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                     {formData.booking.requirements.map((req, index) => (
                        <span key={index} className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                           {req}
                           <button
                              type="button"
                              onClick={() => removeArrayItem('booking', 'requirements', index)}
                              className="text-orange-600 hover:text-orange-800"
                           >
                              <FaTimes className="h-3 w-3" />
                           </button>
                        </span>
                     ))}
                  </div>
                  <div className="flex gap-2">
                     <input
                        type="text"
                        value={tempRequirement}
                        onChange={(e) => setTempRequirement(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                        placeholder="Add a requirement"
                     />
                     <button
                        type="button"
                        onClick={() => {
                           addArrayItem('booking', 'requirements', tempRequirement);
                           setTempRequirement('');
                        }}
                        className="px-4 py-2 bg-sky-900 text-white rounded-md hover:bg-sky-800"
                     >
                        <FaPlus className="h-4 w-4" />
                     </button>
                  </div>
               </div>

               <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     Equipment/Tools Provided
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                     {formData.additionalInfo.equipmentProvided.map((equipment, index) => (
                        <span key={index} className="bg-sky-100 text-sky-900 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                           {equipment}
                           <button
                              type="button"
                              onClick={() => removeArrayItem('additionalInfo', 'equipmentProvided', index)}
                              className="text-sky-600 hover:text-sky-900"
                           >
                              <FaTimes className="h-3 w-3" />
                           </button>
                        </span>
                     ))}
                  </div>
                  <div className="flex gap-2">
                     <input
                        type="text"
                        value={tempEquipment}
                        onChange={(e) => setTempEquipment(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                        placeholder="Add equipment/tool"
                     />
                     <button
                        type="button"
                        onClick={() => {
                           addArrayItem('additionalInfo', 'equipmentProvided', tempEquipment);
                           setTempEquipment('');
                        }}
                        className="px-4 py-2 bg-sky-900 text-white rounded-md hover:bg-sky-800"
                     >
                        <FaPlus className="h-4 w-4" />
                     </button>
                  </div>
               </div>

               <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     Cancellation Policy *
                  </label>
                  <textarea
                     value={formData.booking.cancellationPolicy}
                     onChange={(e) => handleNestedChange('booking', 'cancellationPolicy', e.target.value)}
                     rows={3}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                     placeholder="Describe your cancellation policy..."
                     required
                  />
               </div>
            </div>

            {/* Portfolio Links */}
            <div className="bg-gray-50 p-6 rounded-lg">
               <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Links</h3>

               <div className="flex flex-wrap gap-2 mb-2">
                  {formData.portfolio.links.map((link, index) => (
                     <span key={index} className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                        {link}
                        <button
                           type="button"
                           onClick={() => removeArrayItem('portfolio', 'links', index)}
                           className="text-indigo-600 hover:text-indigo-800"
                        >
                           <FaTimes className="h-3 w-3" />
                        </button>
                     </span>
                  ))}
               </div>
               <div className="flex gap-2">
                  <input
                     type="url"
                     value={tempPortfolioLink}
                     onChange={(e) => setTempPortfolioLink(e.target.value)}
                     className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                     placeholder="Add portfolio link"
                  />
                  <button
                     type="button"
                     onClick={() => {
                        addArrayItem('portfolio', 'links', tempPortfolioLink);
                        setTempPortfolioLink('');
                     }}
                     className="px-4 py-2 bg-sky-900 text-white rounded-md hover:bg-sky-800"
                  >
                     <FaPlus className="h-4 w-4" />
                  </button>
               </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
               <button
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
               >
                  Cancel
               </button>
               <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-sky-900 text-white rounded-md hover:bg-sky-800 disabled:opacity-50 flex items-center gap-2"
               >
                  <FaSave className="h-4 w-4" />
                  {isSubmitting ? 'Creating...' : 'Create Service'}
               </button>
            </div>
         </form>
      </div>
   );
} 