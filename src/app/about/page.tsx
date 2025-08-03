import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import Image from 'next/image'

const team = [
   {
      name: 'Temiloluwa Ifedepa Titloye',
      role: 'Senior Backend Developer',
      image: '/team/temiloluwa.jpg',
   },
   {
      name: 'Jonathan Darko Adoo',
      role: 'Senior Frontend Developer',
      image: '/team/jonathan.png',
   },
   {
      name: 'Fazl Maltiti Yahaya Froko',
      role: 'Senior UI/UX Designer',
      image: '/team/temiloluwa.png',
   },
   {
      name: 'Eshun Papa Kojo Afoa',
      role: 'Junior Backend Developer',
      image: '/team/temiloluwa.png',
   }
]

const About = () => {
   return (
      <div>
         <Navbar />
         <div className='relative w-full h-[60vh]'>
            <Image
               src="/about.jpg"
               alt="About"
               fill
               className='object-cover'
               priority
            />
            <div className='absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center'>
               <h1 className='text-white text-4xl font-bold'>About Us</h1>
            </div>
         </div>
         <div className='py-16 px-4 max-w-7xl mx-auto'>
            <h2 className='text-3xl font-bold text-center mb-4'>Transforming the way you get things done</h2>
            <p className='text-gray-600 text-center max-w-2xl mx-auto'>
               Taskio is a task-matching platform where users can find available people to complete tasks for them or offer their own services.
               Whether you need help with a project or want to offer your skills, Taskio connects you with the right people.
            </p>
         </div>
         <div className='py-16 px-4 max-w-7xl mx-auto'>
            <h2 className='text-3xl font-bold text-center mb-4'>Our Team</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
               {team.map((member, index) => (
                  <div key={index} className='bg-white rounded-lg shadow-md p-4 flex items-center justify-center'>
                     <div className='relative w-32 h-32'>
                        <Image
                           src={member.image}
                           alt={member.name}
                           fill
                           className='object-cover rounded-full w-32 h-32'
                           priority
                        />
                     </div>
                     <div className='p-4'>
                        <h3 className='lg:text-lg text-base font-bold mb-2'>{member.name}</h3>
                        <p className='lg:text-base text-sm text-gray-600'>{member.role}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
         <Footer />
      </div>
   )
}

export default About
