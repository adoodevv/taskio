'use client'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import Image from 'next/image'
import { FaPhone } from 'react-icons/fa'
import { FaEnvelope } from 'react-icons/fa'
import { FaLocationDot } from 'react-icons/fa6'
import toast from "react-hot-toast";
import { useState } from 'react';

const Contact = () => {
   const [form, setForm] = useState({
      name: '',
      email: '',
      message: '',
   });
   const [error, setError] = useState('');
   const [success, setSuccess] = useState('');

   const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
      setForm({ ...form, [e.target.name]: e.target.value });
      setError('');
      setSuccess('');
   };

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!form.name || !form.email || !form.message) {
         setError('Please fill in all fields.');
         return;
      }
      // Simulate successful signup
      toast.success('Message sent successfully!');
      setForm({ name: '', email: '', message: '' });
   };

   return (
      <div>
         <Navbar />
         <div className='relative w-full h-[40vh] md:h-[60vh]'>
            <Image
               src="/contact.jpg"
               alt="About"
               fill
               className='object-cover'
               priority
            />
            <div className='absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center'>
               <h1 className='text-white text-2xl md:text-4xl font-bold'>Contact Us</h1>
            </div>
         </div>
         <div className='py-16 px-4 max-w-7xl mx-auto'>
            <h2 className='text-3xl font-bold text-center mb-4'>Get in touch with us</h2>
            <p className='text-gray-600 text-center max-w-2xl mx-auto'>
               We're here to help you with any questions or concerns you may have.
            </p>
            <div className='flex md:flex-row flex-col items-start justify-center mt-12 gap-12 max-w-7xl mx-auto'>
               <div className='md:w-1/2 w-full'>
                  <h3 className='text-2xl font-bold mb-4'>Send us a message</h3>
                  <form className='flex flex-col gap-4'>
                     <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                           id="name"
                           name="name"
                           type="text"
                           autoComplete="name"
                           required
                           value={form.name}
                           onChange={handleChange}
                           className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 focus:z-10 sm:text-sm"
                           placeholder="Jonathan Maltiti "
                        />
                     </div>
                     <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                           id="email"
                           name="email"
                           type="email"
                           autoComplete="email"
                           required
                           value={form.email}
                           onChange={handleChange}
                           className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 focus:z-10 sm:text-sm"
                           placeholder="jonathan@gmail.com"
                        />
                     </div>
                     <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                        <textarea
                           id="message"
                           name="message"
                           required
                           value={form.message}
                           onChange={handleChange}
                           className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 focus:z-10 sm:text-sm"
                           placeholder="Your message"
                        />
                     </div>
                     <button type='submit' className='bg-sky-900 text-white p-2 rounded-md' onClick={handleSubmit}>Send Message</button>
                  </form>
               </div>
               <div className='md:w-1/2 w-full flex flex-col gap-4'>
                  <h3 className='text-2xl font-bold mb-4'>Contact Information</h3>
                  <p className='flex items-center gap-2'>
                     <FaPhone />
                     +233 000 000 0000
                  </p>
                  <p className='flex items-center gap-2'>
                     <FaEnvelope />
                     info@taskio.com
                  </p>
                  <p className='flex items-center gap-2'>
                     <FaLocationDot />
                     Accra, Ghana
                  </p>
               </div>
            </div>
         </div>
         <Footer />
      </div>
   )
}

export default Contact
