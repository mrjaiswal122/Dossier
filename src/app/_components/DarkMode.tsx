'use client';
import { ReactNode } from "react";
import { useAppSelector } from "../_store/hooks";
import Navbar from "./navbar";
export default function DarkMode({children}:{children: ReactNode}) {
    const darkMode = useAppSelector((state) => state.darkModeRedux);
  return (
<section className={darkMode==true?'dark':''}>
  <Navbar/>
    {children}
    footer
</section>
)
}
