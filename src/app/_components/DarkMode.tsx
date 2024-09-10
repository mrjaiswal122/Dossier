'use client';
import { ReactNode } from "react";
import { useAppSelector } from "../_store/hooks";
import Navbar from "./navbar";
import { SessionProvider } from 'next-auth/react';
export default function DarkMode({children}:{children: ReactNode}) {
    const darkMode = useAppSelector((state) => state.darkModeRedux);
  
  return (
<section className={darkMode==true?'dark':''}>
  <Navbar/>
 
   <SessionProvider>

    {children}
   </SessionProvider>
  
   <footer className="w-full h-14 dark:bg-black dark:text-white"> the end</footer>
</section>
)
}
