import React from 'react'

const Hero = () => {
   return (
      <div className='relative min-h-screen flex items-center justify-center overflow-hidden pt-16'>
         <div
            className="absolute inset-0 bg-[url(/hero.jpg)] bg-cover bg-center bg-no-repeat"
         >
            <div className="absolute inset-0 bg-black/50" />
         </div>

         <div className='text-center max-w-2xl z-10 px-4'>
            <h1 className='text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 sm:mb-8'>
               Book <span className='text-sky-500'>trusted</span> help for campus services
            </h1>
            <form className="flex items-center justify-center w-full max-w-xl mx-auto py-10">
               <input
                  type="text"
                  placeholder="What do you need help with?"
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-l-full text-base sm:text-lg font-semibold bg-white text-gray-900 border border-gray-200 shadow-lg focus:outline-none"
               />
               <button
                  type="submit"
                  className="group bg-sky-900 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-r-full flex items-center justify-center text-xl sm:text-2xl shadow-lg border border-blue-900"
                  aria-label="Search"
               >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 sm:w-7 sm:h-7 group-hover:scale-110 transition duration-500">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
                  </svg>
               </button>
            </form>
         </div>
      </div>
   )
}

export default Hero
