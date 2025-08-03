import Link from "next/link";
import React from "react";
import { FaInstagram } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa";
import Image from "next/image";

const Footer = () => {
   return (
      <footer className="bg-blue-50">
         <div className="flex flex-col md:flex-row items-start justify-center px-4 sm:px-6 md:px-16 lg:px-32 gap-6 md:gap-10 py-8 md:py-14 border-b border-gray-500/30 text-black">
            <div className="w-full md:w-4/5">
               <Link href="/">
                  <Image src="/logo.png" alt="Taskio Logo" width={300} height={300} className="w-30 h-auto" />
               </Link>
               <p className="text-sm mt-4">
                  Taskio is a task-matching platform where users can find available people to complete tasks for them or offer their own services. Whether you need help with a project or want to offer your skills, Taskio connects you with the right people.
               </p>
               <div className="flex items-center gap-4 mt-6 text-2xl">
                  <Link href="/">
                     <FaInstagram />
                  </Link>
                  <Link href="/">
                     <FaXTwitter />
                  </Link>
                  <Link href="/">
                     <FaTiktok />
                  </Link>
               </div>
            </div>

            <div className="w-full md:w-1/2 flex items-center justify-start md:justify-center mt-8 md:mt-0">
               <div>
                  <h2 className="font-medium text-gray-900 mb-5">Discover</h2>
                  <ul className="text-sm space-y-2 text-gray-500">
                     <li>
                        <a className="hover:underline transition" href="/become-a-taskio">Become a Taskio</a>
                     </li>
                     <li>
                        <a className="hover:underline transition" href="#">Services Nearby</a>
                     </li>
                     <li>
                        <a className="hover:underline transition" href="/services">All Services</a>
                     </li>
                     <li>
                        <a className="hover:underline transition" href="#">Elite Taskios</a>
                     </li>
                     <li>
                        <a className="hover:underline transition" href="#">Help</a>
                     </li>
                  </ul>
               </div>
            </div>

            <div className="w-full md:w-1/2 flex items-center justify-start md:justify-center mt-8 md:mt-0">
               <div>
                  <h2 className="font-medium text-gray-900 mb-5">Company</h2>
                  <ul className="text-sm space-y-2 text-gray-500">
                     <li>
                        <a className="hover:underline transition" href="/">Home</a>
                     </li>
                     <li>
                        <a className="hover:underline transition" href="/about">About us</a>
                     </li>
                     <li>
                        <a className="hover:underline transition" href="/contact">Contact us</a>
                     </li>
                     <li>
                        <a className="hover:underline transition" href="#">Privacy policy</a>
                     </li>
                  </ul>
               </div>
            </div>

            <div className="w-full md:w-1/2 flex items-start justify-start md:justify-center mt-8 md:mt-0">
               <div>
                  <h2 className="font-medium text-gray-900 mb-5">Get in touch</h2>
                  <div className="text-sm space-y-2 text-gray-500">
                     <p>+1-234-567-890</p>
                     <p>contact@taskio.com</p>
                  </div>
               </div>
            </div>
         </div>
         <p className="py-3 md:py-4 text-center text-xs sm:text-sm">
            Copyright 2025 © All Right Reserved.
         </p>
      </footer>
   );
};

export default Footer;