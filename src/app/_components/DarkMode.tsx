'use client';
import { ReactNode } from "react";
import { useAppSelector } from "../_store/hooks";
import Navbar from "./navbar";
import { SessionProvider } from 'next-auth/react';





export default function DarkMode({children}:{children: ReactNode}) {
    const darkMode = useAppSelector((state) => state.darkModeRedux);
  
  return (
<section className={darkMode==true?'dark':''}>
<nav className="fixed w-full  z-20 ">
<Navbar/>

  </nav> 
  <div className="w-full h-16"></div>
   <SessionProvider>
   <div className="dark:bg-black bg-theme-light">

    {children}
   </div>
   </SessionProvider>
  
   <footer className="w-full h-14 dark:bg-black bg-theme-light  dark:text-white  flex items-center justify-center text-xs">@Copywrite Ankush jaiswal #2024 </footer>
</section>
)
}
