import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const Navbar = () => {
   const [isMenuOpen, setIsMenuOpen] = useState(false)

   const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen)
   }

   return (
      <div className='flex items-center px-4 md:px-10 py-3 justify-between border-b border-gray-300 relative'>
         <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.png" alt="Taskio Logo" width={300} height={300} priority className="w-20 h-auto sm:w-24 md:w-30" />
         </Link>

         {/* Desktop Navigation */}
         <div className='hidden md:flex flex-row items-center gap-4 lg:gap-6'>
            <Link href="/about" className="text-gray-700 hover:text-sky-900 transition-colors">
               About Us
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-sky-900 transition-colors">
               Contact Us
            </Link>
            <Link href="/">
               <button className='bg-sky-900 hover:bg-sky-800 text-white px-4 py-2 lg:px-6 lg:py-2 rounded-lg cursor-pointer transition-colors text-sm lg:text-base'>
                  Go To Home
               </button>
            </Link>
         </div>

         {/* Mobile Menu Button */}
         <button
            className='md:hidden flex flex-col space-y-1 p-2'
            onClick={toggleMenu}
            aria-label="Toggle menu"
         >
            <span className={`block w-6 h-0.5 bg-gray-600 transition-transform ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-600 transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-600 transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
         </button>

         {/* Mobile Navigation Menu */}
         <div className={`md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-300 shadow-lg transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
            <div className='flex flex-col items-center py-4 space-y-4'>
               <Link
                  href="/about"
                  className="text-gray-700 hover:text-sky-900 transition-colors text-lg"
                  onClick={() => setIsMenuOpen(false)}
               >
                  About Us
               </Link>
               <Link
                  href="/contact"
                  className="text-gray-700 hover:text-sky-900 transition-colors text-lg"
                  onClick={() => setIsMenuOpen(false)}
               >
                  Contact Us
               </Link>
               <Link href="/" onClick={() => setIsMenuOpen(false)}>
                  <button className='bg-sky-900 hover:bg-sky-800 text-white px-6 py-3 rounded-lg cursor-pointer transition-colors text-lg w-full max-w-xs'>
                     Go To Home
                  </button>
               </Link>
            </div>
         </div>
      </div>
   )
}

export default Navbar