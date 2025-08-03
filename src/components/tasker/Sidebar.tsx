import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaCalendar, FaHome, FaTools } from 'react-icons/fa';

const SideBar = () => {
   const pathname = usePathname()
   const menuItems = [
      { name: 'My Dashboard', path: '/dashboard', icon: <FaHome /> },
      { name: 'Service List', path: '/dashboard/service-list', icon: <FaTools /> },
      { name: 'Bookings', path: '/dashboard/bookings', icon: <FaCalendar /> },
   ];

   return (
      <div className='md:w-64 w-16 min-h-screen border-r text-base border-gray-300 py-2 flex flex-col'>
         {menuItems.map((item) => {

            const isActive = pathname === item.path;

            return (
               <Link href={item.path} key={item.name} passHref>
                  <div
                     className={
                        `flex items-center py-3 px-4 gap-3 ${isActive
                           ? "border-r-4 md:border-r-[6px] bg-blue-900/10 border-blue-900/90"
                           : "hover:bg-gray-100/90 border-white"
                        }`
                     }
                  >
                     {item.icon}
                     <p className='md:block hidden text-center'>{item.name}</p>
                  </div>
               </Link>
            );
         })}
      </div>
   );
};

export default SideBar;