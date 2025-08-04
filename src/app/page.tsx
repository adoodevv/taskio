import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reviews from "@/components/Reviews";
import TaskFilter from "@/components/TaskFilter";
import Satisfaction from "@/components/Satisfaction";
import HowItWorks from "@/components/HowItWorks";
import GetHelpToday from "@/components/GetHelpToday";
import { LuCircleHelp } from "react-icons/lu";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative">
      <Navbar />
      <div className="fixed bottom-10 left-10 z-10">
        <Link href="/contact" className="items-center justify-center font-bold flex bg-sky-900 text-white px-4 py-2 rounded-full gap-2 hover:scale-105 transition duration-300">
          <LuCircleHelp className="text-2xl" />
          Help
        </Link>
      </div>
      <div>
        <Hero />
        <TaskFilter />
        <Reviews />
        <Satisfaction />
        <HowItWorks />
        <GetHelpToday />
      </div>
      <Footer />
    </div>
  );
}
