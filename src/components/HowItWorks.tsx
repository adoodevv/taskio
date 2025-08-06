import Image from 'next/image'
import React from 'react'

const HowItWorks = () => {
   return (
      <div className="bg-blue-50">
         <div className="relative max-w-6xl mx-auto py-6 sm:py-10 px-4 flex flex-col lg:block">
            <Image
               src="/how-it-works.jpg"
               alt="How It Works"
               width={1500}
               height={1500}
               className="w-full h-48 xs:h-64 sm:h-96 lg:h-full object-cover rounded-xl"
            />
            <div
               className="lg:absolute lg:top-1/2 lg:-right-12 lg:transform lg:-translate-y-1/2 lg:w-1/3 w-full mt-4 lg:mt-0 bg-sky-900 rounded-xl p-3 sm:p-4 flex flex-col gap-3 sm:gap-4"
            >
               <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white text-center">How It Works</h2>
               <div className="flex flex-col gap-4 sm:gap-6 text-white">
                  <div className='flex items-center gap-2'>
                     <div className='relative flex items-center justify-center'>
                        <span className='p-4 sm:p-6 rounded-full bg-white'></span>
                        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg sm:text-2xl font-bold text-sky-900'>1</div>
                     </div>
                     <p className='text-base sm:text-lg text-left'>Choose a Tasker by price, skills, and reviews.</p>
                  </div>
                  <div className='flex items-center gap-2'>
                     <div className='relative flex items-center justify-center'>
                        <span className='p-4 sm:p-6 rounded-full bg-white'></span>
                        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg sm:text-2xl font-bold text-sky-900'>2</div>
                     </div>
                     <p className='text-base sm:text-lg text-left'>Schedule a Tasker as early as today.</p>
                  </div>
                  <div className='flex items-center gap-2'>
                     <div className='relative flex items-center justify-center'>
                        <span className='p-4 sm:p-6 rounded-full bg-white'></span>
                        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg sm:text-2xl font-bold text-sky-900'>3</div>
                     </div>
                     <p className='text-base sm:text-lg text-left'>Chat, pay, tip, and review all in one place.</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default HowItWorks
