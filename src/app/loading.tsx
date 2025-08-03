import React from 'react'

const Loading = () => {
   return (
      <div className="flex justify-center items-center h-[70vh] bg-white/80">
         <div className="animate-spin rounded-full h-20 w-20 border-4 border-t-blue-50 border-sky-900"></div>
      </div>
   )
}

export default Loading