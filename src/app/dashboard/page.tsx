'use client';

import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';

export default function Dashboard() {
   const { user } = useAuth();
   const router = useRouter();

   // Redirect non-taskio users to profile page
   useEffect(() => {
      if (user && user.role !== 'taskio') {
         router.push('/profile');
      }
   }, [user, router]);

   // Show loading while checking role
   if (!user || user.role !== 'taskio') {
      return (
         <div className="min-h-screen flex items-center justify-center w-full px-4">
            <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-900 mx-auto mb-4"></div>
               <p className="text-gray-600 text-sm sm:text-base">Loading...</p>
            </div>
         </div>
      );
   }

   return (
      <ProtectedRoute>
         <div className="min-h-screen bg-gray-50 w-full">
            <div className="max-w-7xl mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
               <div className="space-y-6 sm:space-y-8">
                  {/* Header Section */}
                  <div className="bg-white overflow-hidden shadow-sm sm:shadow rounded-lg">
                     <div className="px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
                           <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                              <div className="flex-shrink-0 self-start sm:self-center">
                                 <Image
                                    src={user.profilePicture || "/user.png"}
                                    alt="Profile Picture"
                                    width={80}
                                    height={80}
                                    className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full object-cover"
                                 />
                              </div>
                              <div className="flex-1 min-w-0">
                                 <p className='text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2'>Welcome, {user.name}</p>
                                 <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 leading-tight">Taskio Dashboard</h1>
                                 <p className="text-xs sm:text-sm lg:text-base text-gray-600 mt-1 sm:mt-2">Manage your services and earnings</p>
                              </div>
                           </div>
                           <div className="flex-shrink-0 self-start sm:self-center">
                              <button
                                 onClick={() => router.push('/dashboard/service-list')}
                                 className="w-full sm:w-auto bg-sky-900 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg hover:bg-sky-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base font-medium shadow-sm hover:shadow-md"
                              >
                                 Manage Services
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Stats Overview */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                     <div className="bg-white overflow-hidden shadow-sm sm:shadow rounded-lg">
                        <div className="p-3 sm:p-4 lg:p-5">
                           <div className="flex items-center">
                              <div className="flex-1 min-w-0">
                                 <dl>
                                    <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                                       Total Earnings
                                    </dt>
                                    <dd className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mt-1">
                                       $2,450
                                    </dd>
                                 </dl>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="bg-white overflow-hidden shadow-sm sm:shadow rounded-lg">
                        <div className="p-3 sm:p-4 lg:p-5">
                           <div className="flex items-center">
                              <div className="flex-1 min-w-0">
                                 <dl>
                                    <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                                       Active Jobs
                                    </dt>
                                    <dd className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mt-1">
                                       5
                                    </dd>
                                 </dl>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="bg-white overflow-hidden shadow-sm sm:shadow rounded-lg">
                        <div className="p-3 sm:p-4 lg:p-5">
                           <div className="flex items-center">
                              <div className="flex-1 min-w-0">
                                 <dl>
                                    <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                                       Rating
                                    </dt>
                                    <dd className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mt-1">
                                       4.8/5
                                    </dd>
                                 </dl>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="bg-white overflow-hidden shadow-sm sm:shadow rounded-lg">
                        <div className="p-3 sm:p-4 lg:p-5">
                           <div className="flex items-center">
                              <div className="flex-1 min-w-0">
                                 <dl>
                                    <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                                       Completed Jobs
                                    </dt>
                                    <dd className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mt-1">
                                       24
                                    </dd>
                                 </dl>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                     <button
                        onClick={() => router.push('/dashboard/service-list')}
                        className="bg-white p-4 sm:p-6 rounded-lg shadow-sm sm:shadow border border-gray-200 hover:shadow-md transition-all duration-200 text-left group hover:border-sky-200"
                     >
                        <div className="flex items-start gap-3 sm:gap-4">
                           <div className="flex-1 min-w-0">
                              <h3 className="text-sm sm:text-base lg:text-lg font-medium text-gray-900 group-hover:text-sky-900 transition-colors">Manage Services</h3>
                              <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2 leading-relaxed">Add, edit, or remove your service offerings</p>
                           </div>
                        </div>
                     </button>

                     <button className="bg-white p-4 sm:p-6 rounded-lg shadow-sm sm:shadow border border-gray-200 hover:shadow-md transition-all duration-200 text-left group hover:border-sky-200">
                        <div className="flex items-start gap-3 sm:gap-4">
                           <div className="flex-1 min-w-0">
                              <h3 className="text-sm sm:text-base lg:text-lg font-medium text-gray-900 group-hover:text-sky-900 transition-colors">View Schedule</h3>
                              <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2 leading-relaxed">Check your upcoming jobs and availability</p>
                           </div>
                        </div>
                     </button>

                     <button className="bg-white p-4 sm:p-6 rounded-lg shadow-sm sm:shadow border border-gray-200 hover:shadow-md transition-all duration-200 text-left group hover:border-sky-200 sm:col-span-2 lg:col-span-1">
                        <div className="flex items-start gap-3 sm:gap-4">
                           <div className="flex-1 min-w-0">
                              <h3 className="text-sm sm:text-base lg:text-lg font-medium text-gray-900 group-hover:text-sky-900 transition-colors">Earnings Report</h3>
                              <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2 leading-relaxed">View detailed earnings and payment history</p>
                           </div>
                        </div>
                     </button>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white overflow-hidden shadow-sm sm:shadow rounded-lg">
                     <div className="px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
                        <h3 className="text-base sm:text-lg lg:text-xl leading-6 font-medium text-gray-900 mb-4 sm:mb-6">
                           Recent Activity
                        </h3>
                        <div className="space-y-3 sm:space-y-4">
                           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-2 sm:gap-4">
                              <div className="flex-1 min-w-0">
                                 <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">Plumbing Repair - Kitchen Sink</p>
                                 <p className="text-xs sm:text-sm text-gray-500 mt-1">Completed • $120 earned</p>
                              </div>
                              <span className="text-xs sm:text-sm text-gray-500 flex-shrink-0">2 hours ago</span>
                           </div>
                           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-2 sm:gap-4">
                              <div className="flex-1 min-w-0">
                                 <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">Electrical Installation - Ceiling Fan</p>
                                 <p className="text-xs sm:text-sm text-gray-500 mt-1">In Progress • $85</p>
                              </div>
                              <span className="text-xs sm:text-sm text-gray-500 flex-shrink-0">1 day ago</span>
                           </div>
                           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-2 sm:gap-4">
                              <div className="flex-1 min-w-0">
                                 <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">Carpentry - Cabinet Repair</p>
                                 <p className="text-xs sm:text-sm text-gray-500 mt-1">Scheduled • $95</p>
                              </div>
                              <span className="text-xs sm:text-sm text-gray-500 flex-shrink-0">Tomorrow</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </ProtectedRoute>
   );
}
