'use client'
import React, { useState } from 'react'

const tasks = [
   {
      name: 'Assembly',
      icon: '/assets/assembly.svg',
      items: ['Help Moving', 'Heavy Lifting & Loading', 'Rearrange Furniture', 'Junk Haul Away'],
   },
   {
      name: 'Cleaning',
      icon: '/assets/cleaning.svg',
      items: ['Cleaning', 'Deep Clean', 'Room Cleaning'],
   },
   {
      name: 'Outdoor Help',
      icon: '/assets/outdoor.svg',
      items: ['Lawn Mowing', 'Yard Work', 'Snow Removal'],
   },
   {
      name: 'Trending',
      icon: '/assets/trending.svg',
      items: ['Trending', 'Popular', 'New'],
   },
]

const TaskFilter = () => {
   const [selectedTab, setSelectedTab] = useState(tasks[2].name)
   const currentTask = tasks.find((task) => task.name === selectedTab)

   return (
      <div className='max-w-6xl mx-auto py-6 sm:py-10 px-2 sm:px-0'>
         <div className='flex flex-wrap sm:flex-nowrap items-center justify-center gap-6 sm:gap-16 border-b border-gray-300 pb-2'>
            {tasks.map((task) => (
               <div
                  key={task.name}
                  className={`flex flex-col font-bold items-center gap-2 cursor-pointer relative ${selectedTab === task.name ? 'text-sky-900' : 'text-black'}`}
                  onClick={() => setSelectedTab(task.name)}
               >
                  <span className={`p-2 ${selectedTab === task.name ? 'bg-sky-100 rounded-full' : ''}`}>
                     <img src={task.icon} alt={task.name} className='w-8 h-8' />
                  </span>
                  <p>{task.name}</p>
                  {selectedTab === task.name && <span className='absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-12 h-0.5 bg-blue-900 rounded'></span>}
               </div>
            ))}
         </div>
         <div className='flex flex-wrap justify-center gap-2 sm:gap-4 mt-4 sm:mt-6'>
            {currentTask?.items.map((item) => (
               <button
                  key={item}
                  className='border border-gray-400 rounded-full px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base font-medium hover:bg-blue-50 transition'
               >
                  {item}
               </button>
            ))}
         </div>
      </div>
   )
}

export default TaskFilter
