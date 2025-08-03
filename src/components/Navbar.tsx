'use client';

import { useState } from 'react';
import Link from 'next/link'
import Image from 'next/image';
import { FiMenu } from 'react-icons/fi';
import { IoMdClose } from "react-icons/io";
import { assets } from '@/assets/assets';
import { useAuth } from '@/context/AuthContext';
import { FaUser, FaSignOutAlt, FaCaretDown } from 'react-icons/fa';
import UserMenu from './UserMenu';

const Navbar = () => {
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const { user, isAuthenticated, isLoading, logout } = useAuth();

   return (
      <header className="border-b border-gray-300 text-black z-20 fixed top-0 left-0 right-0 bg-blue-50/80 backdrop-blur-sm">
         <div className="container relative mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
            <div className='flex items-center justify-center gap-6'>
               <Link href="/">
                  <Image src="/logo.png" alt="Taskio Logo" width={300} height={300} className="w-30 h-auto" />
               </Link>
               <nav className="hidden md:flex items-center gap-4 lg:gap-8 max-md:hidden">
                  <Link href="/services" className='hover:translate-y-[-2px] transition duration-300'>
                     Services
                  </Link>
                  <Link href="/about" className='hover:translate-y-[-2px] transition duration-300'>
                     About Us
                  </Link>
                  <Link href="/contact" className='hover:translate-y-[-2px] transition duration-300'>
                     Contact Us
                  </Link>

                  {isAuthenticated && user?.role === 'taskio' && (
                     <Link href="/dashboard" className="text-xs border px-4 py-1.5 rounded-full">
                        Taskio Dashboard
                     </Link>
                  )}
               </nav>
            </div>

            <div className='flex items-center gap-4'>
               <div className='hidden md:flex items-center gap-4'>
                  <Image className="w-5 h-5" src={assets.search_icon} alt="search icon" />

                  {/* Show "Become a Taskio" only for non-authenticated users or seekers */}
                  {(!isAuthenticated || user?.role === 'seeker') && (
                     <Link href="/auth" className="border border-sky-900 font-bold text-sky-900 px-4 py-2 rounded-md hover:bg-sky-900 hover:text-white transition duration-500">
                        Become a Taskio
                     </Link>
                  )}

                  {/* Show authentication buttons or user menu */}
                  {!isLoading && (
                     <>
                        {isAuthenticated ? (
                           <UserMenu />
                        ) : (
                           <ul className="hidden md:flex items-center gap-4">
                              <Link href="/auth" className="flex items-center gap-2 hover:text-gray-900 transition">
                                 <Image src={assets.user_icon} alt="user icon" />
                                 Sign In / Sign Up
                              </Link>
                           </ul>
                        )}
                     </>
                  )}
               </div>
               <div className="md:hidden">
                  <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
                     {isMenuOpen ? <IoMdClose className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
                  </button>
               </div>
            </div>
         </div>

         {isMenuOpen && (
            <div className="md:hidden bg-background border-b border-gray-300">
               <div className="container px-4 py-4 flex flex-col items-center gap-4">
                  {isAuthenticated && user?.role === 'taskio' && (
                     <Link href="/dashboard" className="text-xs border px-4 py-1.5 rounded-full">
                        Taskio Dashboard
                     </Link>
                  )}

                  <Link href="/services" className='hover:translate-y-[-2px] transition duration-300'>Services</Link>
                  <Link href="/about" className='hover:translate-y-[-2px] transition duration-300'>About Us</Link>
                  <Link href="/contact" className='hover:translate-y-[-2px] transition duration-300'>Contact Us</Link>

                  {(!isAuthenticated || user?.role === 'seeker') && (
                     <Link href="/auth" className="border border-sky-900 font-bold text-sky-900 px-4 py-2 rounded-md hover:bg-sky-900 hover:text-white transition duration-500">
                        Become a Taskio
                     </Link>
                  )}

                  {!isLoading && (
                     <>
                        {isAuthenticated ? (
                           <div className="flex flex-col gap-2 w-full items-center">
                              <div>
                                 {isAuthenticated && (
                                    <Link href="/profile" className="w-full flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors">
                                       My Profile
                                    </Link>
                                 )}
                              </div>

                              <button
                                 onClick={() => {
                                    logout();
                                    setIsMenuOpen(false);
                                 }}
                                 className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                 <FaSignOutAlt />
                                 <span>Sign Out</span>
                              </button>
                           </div>
                        ) : (
                           <Link href="/auth" className="flex items-center gap-2 hover:text-gray-900 transition">
                              <Image src={assets.user_icon} alt="user icon" />
                              Sign In / Sign Up
                           </Link>
                        )}
                     </>
                  )}
               </div>
            </div>
         )}
      </header>
   )
}

export default Navbar