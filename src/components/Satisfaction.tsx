import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Satisfaction = () => {
   return (
      <div className="max-w-6xl mx-auto py-6 sm:py-10 px-4">
         <h2 className="text-2xl sm:text-3xl font-bold text-center">Your Satisfaction,<span className='text-sky-900'> Guaranteed</span></h2>
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6 items-start">
            <div className="flex flex-col items-center justify-center">
               <h3 className="text-lg font-bold">Happiness Pledge</h3>
               <p className="text-sm text-gray-500 text-center">If you're not satisfied, <Link href="/contact" className='text-sky-900 underline'>we'll make it right.</Link></p>
               <Image
                  src="/assets/pledge.webp"
                  alt="Happiness Pledge"
                  width={500}
                  height={500}
                  className="w-1/2 h-full object-cover mt-4"
               />
            </div>
            <div className="flex flex-col items-center justify-center">
               <h3 className="text-lg font-bold">Vetted Yakubus</h3>
               <p className="text-sm text-gray-500 text-center">Taskers are always background checked before joining the platform.</p>
            </div>
            <div className="flex flex-col items-center justify-center">
               <h3 className="text-lg font-bold">Dedicated Support</h3>
               <p className="text-sm text-gray-500 text-center">Friendly service when you need us – every day of the week.</p>
            </div>
         </div>
      </div>
   )
}

export default Satisfaction
