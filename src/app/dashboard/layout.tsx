'use client'
import Footer from '@/components/tasker/Footer';
import Navbar from '@/components/tasker/Navbar'
import Sidebar from '@/components/tasker/Sidebar';
import React, { ReactNode } from 'react'

interface LayoutProps {
   children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
   return (
      <div>
         <Navbar />
         <div className='flex w-full'>
            <Sidebar />
            {children}
         </div>
         <Footer />
      </div>
   )
}

export default Layout