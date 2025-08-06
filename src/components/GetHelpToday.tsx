import Link from 'next/link'
import { FaArrowRight } from "react-icons/fa";

const services = [
   {
      name: 'Delivery',
      link: '/services/delivery'
   },
   {
      name: 'Cleaning',
      link: '/services/cleaning'
   },
   {
      name: 'Homework',
      link: '/services/homework'
   }
]

const GetHelpToday = () => {
   return (
      <div className="max-w-6xl mx-auto py-6 sm:py-10 px-4">
         <div className='justify-between items-center flex'>
            <h2 className="text-2xl sm:text-3xl font-bold text-center">Get Help Today</h2>
            <Link href="/services" className='hover:underline group flex items-center gap-1'>
               <p>See all services</p>
               <FaArrowRight className='group-hover:translate-x-1 transition-all duration-300 h-3 w-3' />
            </Link>
         </div>
         <div className="flex gap-4 items-center py-8">
            {services.map((service) => (
               <div key={service.name}>
                  <Link href={service.link} className='border border-gray-400 rounded-full px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base font-medium hover:bg-blue-50 transition'>
                     {service.name}
                  </Link>
               </div>
            ))}
         </div>
      </div>
   )
}

export default GetHelpToday
