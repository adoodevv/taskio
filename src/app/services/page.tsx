import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import Image from 'next/image'

const services = [
   {
      title: 'Featured Tasks',
      description: 'Let Taskio help tackle your to-do list.',
      image: '/waiting.jpg',
      list: [
         'Home Repairs',
         'Heavy Lifting',
         'Wait in Line',
         'Closet Organization Service',
         'Laundry Service',
         'Moving Help',
      ]
   },
   {
      title: 'Handyman',
      description: 'Hire a Taskio for help around the house.',
      image: '/laundry.jpg',
      list: [
         'Light Installation',
         'Carpentry Services',
         'Baby Proofing',
         'Smart Home Installation',
         'Laundry Service',
         'Pet Care',
      ]
   },
   {
      title: 'Moving Services',
      description: 'From the heavy lifting to unpacking and organizing make your move with Taskio!',
      image: '/moving.jpg',
      list: [
         'Help Moving',
         'Truck Assisted Help Moving',
         'Packing Services & Help',
         'Unpacking Services & Help',
         'Hostel & Apartment Moving',
         'Storage Unit Moving',
         'Moving Supplies',
      ]
   },
   {
      title: 'Cleaning',
      description: 'Taskio will make your home sparkle!',
      image: '/cleaning.jpg',
      list: [
         'Hostel Cleaning',
         'Move In Cleaning',
         'Move Out Cleaning',
         'Car Washing',
         'One Time Cleaning',
      ]
   },
   {
      title: 'Shopping + Delivery',
      description: 'Get anything from groceries to supplies.',
      image: '/delivery.jpg',
      list: [
         'Delivery Service',
         'Grocery Shopping & Delivery',
         'Running Your Errands',
         'Wait in Line',
         'Contactless Delivery',
         'Return Items',
         'Drop Off Donations',
         'Pet Food Delivery',
         'Baby Supplies Delivery',
         'Breakfast Delivery',
      ]
   },
   {
      title: 'Personal Assistant',
      description: 'Hire a Taskio to be your personal assistant! Get help on an hourly or ongoing basis.',
      image: '/personal.jpg',
      list: [
         'Personal Assistant',
         'Running Your Errands',
         'Wait in Line',
         'Organization',
         'Virtual Assistant',
         'Dog Walking',
      ]
   },
   {
      title: 'Virtual & Online Tasks',
      description: 'Virtual assistance, organization, research, & more.',
      image: '/virtual.jpg',
      list: [
         'Virtual Assistant',
         'Organization',
         'Data Entry',
         'Computer Help',
      ]
   },
]

const Services = () => {
   return (
      <div>
         <Navbar />
         <div className='relative w-full h-[60vh]'>
            <Image
               src="/services.jpg"
               alt="services"
               fill
               className='object-cover'
               priority
            />
            <div className='absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center'>
               <h1 className='text-white text-4xl font-bold'>Your to-do list, our to-do list.</h1>
            </div>
         </div>
         <div className='py-16 px-4 max-w-7xl mx-auto'>
            <h2 className='text-3xl font-bold text-center mb-12'>Hire a trusted Taskio presto</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
               {services.map((service, index) => (
                  <div key={index} className='bg-white rounded-lg shadow-lg'>
                     <Image src={service.image} alt={service.title} width={500} height={500} className='rounded-t-lg w-full h-48 object-cover' />
                     <div className='p-6'>
                        <div className='border-b border-gray-200 pb-4 mb-4'>
                           <h3 className='text-xl font-semibold text-sky-900'>{service.title}</h3>
                           <p className='text-gray-600'>{service.description}</p>
                        </div>
                        <ul className='text-sky-900'>
                           {service.list.map((item, index) => (
                              <li key={index}>{item}</li>
                           ))}
                        </ul>
                     </div>
                  </div>
               ))}
            </div>
         </div>
         <Footer />
      </div>
   )
}

export default Services
