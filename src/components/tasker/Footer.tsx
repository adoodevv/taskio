import React from "react";
import Image from "next/image";
import { FaTiktok, FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";

const Footer = () => {
   return (
      <div className="flex md:flex-row flex-col-reverse items-center justify-between text-left w-full px-10 border-t border-gray-300">
         <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
               <Image src="/logo.png" alt="Taskio Logo" width={300} height={300} className="w-30 h-auto" />
            </div>
            <div className="hidden md:block h-7 w-px bg-gray-500/60"></div>
            <p className="py-4 text-center text-xs md:text-sm text-gray-500">
               © {new Date().getFullYear()} Taskio. All rights reserved.
            </p>
         </div>
         <div className="flex items-center gap-3">
            <a href="https://x.com">
               <FaXTwitter className="h-6 w-6" />
            </a>
            <a href="https://www.instagram.com">
               <FaInstagram className="h-6 w-6" />
            </a>
            <a href="https://www.tiktok.com">
               <FaTiktok className="h-6 w-6" />
            </a>
         </div>
      </div>
   );
};

export default Footer;