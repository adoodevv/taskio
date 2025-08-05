'use client';

import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useApi } from '@/hooks/useApi';
import { FaDollarSign, FaBriefcase, FaStar, FaCheckCircle, FaSpinner } from 'react-icons/fa';

interface DashboardStats {
   totalEarnings: number;
   activeJobs: number;
   completedJobs: number;
   totalServices: number;
   averageRating: number;
}

interface RecentActivity {
   id: string;
   serviceTitle: string;
   customerName: string;
   status: string;
   amount: number;
   createdAt: string;
   timeAgo: string;
}

export default function Dashboard() {
   const { user } = useAuth();
   const router = useRouter();
   const api = useApi();
   const [stats, setStats] = useState<DashboardStats | null>(null);
   const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
   const [isLoading, setIsLoading] = useState(true);

   // Redirect non-taskio users to profile page
   useEffect(() => {
      if (user && user.role !== 'taskio') {
         router.push('/profile');
      }
   }, [user, router]);

   // Fetch dashboard data
   useEffect(() => {
      if (user && user.role === 'taskio') {
         fetchDashboardData();
      }
   }, [user]);

   const fetchDashboardData = async () => {
      try {
         setIsLoading(true);
         const response = await api.get('/api/dashboard/stats');
         setStats(response.stats);
         setRecentActivity(response.recentActivity);
      } catch (error) {
         console.error('Error fetching dashboard data:', error);
         // Set default values if API fails
         setStats({
            totalEarnings: 0,
            activeJobs: 0,
            completedJobs: 0,
            totalServices: 0,
            averageRating: 0
         });
         setRecentActivity([]);
      } finally {
         setIsLoading(false);
      }
   };

   const getStatusColor = (status: string) => {
      switch (status) {
         case 'pending':
            return 'text-yellow-600';
         case 'confirmed':
            return 'text-blue-600';
         case 'in-progress':
            return 'text-purple-600';
         case 'completed':
            return 'text-green-600';
         case 'cancelled':
            return 'text-red-600';
         default:
            return 'text-gray-600';
      }
   };

   const getStatusText = (status: string) => {
      switch (status) {
         case 'pending':
            return 'Pending';
         case 'confirmed':
            return 'Confirmed';
         case 'in-progress':
            return 'In Progress';
         case 'completed':
            return 'Completed';
         case 'cancelled':
            return 'Cancelled';
         default:
            return status;
      }
   };

   // Show loading while checking role or fetching data
   if (!user || user.role !== 'taskio' || isLoading) {
      return (
         <div className="min-h-screen flex items-center justify-center w-full px-4">
            <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-900 mx-auto mb-4"></div>
               <p className="text-gray-600 text-sm sm:text-base">Loading dashboard...</p>
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
                           <div className="flex flex-shrink-0 self-start sm:self-center gap-2">
                              <button
                                 onClick={() => router.push('/dashboard/service-list')}
                                 className="w-full sm:w-auto bg-sky-900 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-lg hover:bg-sky-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base font-medium shadow-sm hover:shadow-md"
                              >
                                 Manage Services
                              </button>
                              <button
                                 onClick={() => router.push('/dashboard/bookings')}
                                 className="w-full sm:w-auto bg-green-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base font-medium shadow-sm hover:shadow-md"
                              >
                                 View Bookings
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
                                    <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate flex items-center gap-1">
                                       Total Earnings
                                    </dt>
                                    <dd className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mt-1">
                                       ${stats?.totalEarnings?.toLocaleString() || '0'}
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
                                    <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate flex items-center gap-1">
                                       Active Jobs
                                    </dt>
                                    <dd className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mt-1">
                                       {stats?.activeJobs || '0'}
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
                                    <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate flex items-center gap-1">
                                       Rating
                                    </dt>
                                    <dd className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mt-1">
                                       {stats?.averageRating?.toFixed(1) || '0.0'}/5
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
                                    <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate flex items-center gap-1">
                                       Completed Jobs
                                    </dt>
                                    <dd className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mt-1">
                                       {stats?.completedJobs || '0'}
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

                     <button
                        onClick={() => router.push('/dashboard/bookings')}
                        className="bg-white p-4 sm:p-6 rounded-lg shadow-sm sm:shadow border border-gray-200 hover:shadow-md transition-all duration-200 text-left group hover:border-sky-200"
                     >
                        <div className="flex items-start gap-3 sm:gap-4">
                           <div className="flex-1 min-w-0">
                              <h3 className="text-sm sm:text-base lg:text-lg font-medium text-gray-900 group-hover:text-sky-900 transition-colors">View Bookings</h3>
                              <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2 leading-relaxed">Check your upcoming jobs and manage bookings</p>
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
                        {recentActivity.length === 0 ? (
                           <div className="text-center py-8">
                              <p className="text-gray-500 text-sm">No recent activity</p>
                              <p className="text-gray-400 text-xs mt-1">Your recent bookings will appear here</p>
                           </div>
                        ) : (
                           <div className="space-y-3 sm:space-y-4">
                              {recentActivity.map((activity) => (
                                 <div key={activity.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-2 sm:gap-4">
                                    <div className="flex-1 min-w-0">
                                       <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{activity.serviceTitle}</p>
                                       <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                          <span className={getStatusColor(activity.status)}>{getStatusText(activity.status)}</span>
                                          {activity.status === 'completed' && ` • $${activity.amount} earned`}
                                          {activity.status !== 'completed' && ` • $${activity.amount}`}
                                          {` • ${activity.customerName}`}
                                       </p>
                                    </div>
                                    <span className="text-xs sm:text-sm text-gray-500 flex-shrink-0">{activity.timeAgo}</span>
                                 </div>
                              ))}
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </ProtectedRoute>
   );
}
