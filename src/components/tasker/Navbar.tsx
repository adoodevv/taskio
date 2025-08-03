import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import Image from 'next/image'

const Navbar = () => {
   const router = useRouter();

   return (
      <div className='flex items-center px-4 md:px-10 py-3 justify-between border-b border-gray-300'>
         <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.png" alt="Taskio Logo" width={300} height={300} className="w-30 h-auto" />
         </Link>
         <button className='bg-sky-900 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-lg text-xs sm:text-sm cursor-pointer' onClick={() => router.push('/')}>Exit Dashboard</button>
      </div>
   )
}

export default Navbar