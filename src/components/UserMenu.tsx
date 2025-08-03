'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { FaUser, FaSignOutAlt, FaCaretDown } from 'react-icons/fa';
import Image from 'next/image';
import { assets } from '@/assets/assets';
import Link from 'next/link';

export default function UserMenu() {
   const { user, isAuthenticated, logout } = useAuth();
   const [isOpen, setIsOpen] = useState(false);

   if (!user) return null;

   return (
      <div className="relative">
         <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-4 py-2 text-black hover:text-gray-900 transition-colors"
         >
            {user.profilePicture ? (
               <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image
                     src={user.profilePicture}
                     alt="Profile"
                     width={32}
                     height={32}
                     className="w-8 h-8 rounded-full object-cover"
                  />
               </div>
            ) : (
               <Image src={assets.user_icon} alt="user icon" />
            )}
            <span className="hidden md:block">{user.name}</span>
            <FaCaretDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
         </button>

         {isOpen && (
            <div className="absolute right-0 mt-2 w-64 min-w-max bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
               <div className="px-4 py-2 border-b border-gray-100">
                  <div className="flex items-center gap-3 mb-2">
                     {user.profilePicture ? (
                        <Image
                           src={user.profilePicture}
                           alt="Profile"
                           width={40}
                           height={40}
                           className="w-10 h-10 rounded-full object-cover"
                        />
                     ) : (
                        <Image src={assets.user_icon} alt="user icon" />
                     )}
                     <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                     </div>
                  </div>
                  <p className="text-xs text-sky-600 capitalize">{user.role}</p>
               </div>
               <div>
                  {isAuthenticated && (
                     <Link href="/profile" className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                        <FaUser />
                        My Profile
                     </Link>
                  )}
               </div>

               <button
                  onClick={() => {
                     logout();
                     setIsOpen(false);
                  }}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
               >
                  <FaSignOutAlt />
                  <span>Sign Out</span>
               </button>
            </div>
         )}

         {/* Overlay to close menu when clicking outside */}
         {isOpen && (
            <div
               className="fixed inset-0 z-40"
               onClick={() => setIsOpen(false)}
            />
         )}
      </div>
   );
} 