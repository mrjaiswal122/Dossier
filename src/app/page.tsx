'use client';
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { atomDarkMode } from './_state/atom';
import Navbar from './_components/navbar';

export default function Home() {
  const [darkMode,_] = useAtom(atomDarkMode);

  
  return (
    <main className={darkMode==true?"dark":""}>
      <Navbar/>
      
      <div className=''></div>
    </main>
  );
}