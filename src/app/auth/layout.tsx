'use client';
import React from "react";
import Navbar from "../_components/navbar";
import { atomDarkMode } from "../_state/atom";
import { useAtom } from "jotai";

export default function AuthLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const [darkMode] = useAtom(atomDarkMode);
    return (
        <>
      <section className={darkMode==true?"dark":""}>
       <Navbar/>
         <div className="dark:bg-black">

        {children}
         </div>
      </section>
        </>

    );
  }

