'use client';
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { atomDarkMode } from "../_state/atom";
import { BsFillMoonStarsFill } from "react-icons/bs";
import { MdSunny } from "react-icons/md";
import { HiComputerDesktop } from "react-icons/hi2";
import Link from "next/link";
import { cookies } from "next/headers";
export default function Navbar() {
  const [darkMode, setDarkMode] = useAtom(atomDarkMode);
  const [prefersDarkScheme, setPrefersDarkScheme] = useState(false);
  const [theme, setTheme] = useState<"true" | "false" | "system">('system');

  useEffect(() => {
    setPrefersDarkScheme(window.matchMedia("(prefers-color-scheme: dark)").matches);
    switch (localStorage.getItem("theme")) {
      case "system":
        setTheme("system");
        setDarkMode(prefersDarkScheme);
        break;
      case "dark":
        setTheme("true");
        setDarkMode(true);
        break;
      case "light":
        setTheme("false");
        setDarkMode(false);
        break;
      default:
        localStorage.setItem("theme", 'system');
        setDarkMode(prefersDarkScheme);
    }
    
  }, [prefersDarkScheme, setDarkMode]);

  const handleTheme = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target as HTMLElement;

    switch (target.closest('div')?.id) {
      case "dark":
        setDarkMode(true);
        setTheme("true");
        localStorage.setItem("theme", 'dark');
        break;
      case "system":
        setDarkMode(prefersDarkScheme);
        setTheme("system");
        localStorage.setItem("theme", 'system');
        break;
      case "light":
        setDarkMode(false);
        setTheme("false");
        localStorage.setItem("theme", 'light');
        break;
      default:
        handleThemeSection();
    }
  };

  const handleThemeSection = () => {
    const themeSection = document.getElementById("themeSection");
    themeSection?.classList.toggle("hidden");
  };

  return (
    <>
      <nav className="w-full h-16 dark:text-white dark:bg-black flex justify-between items-center relative">
        <div className="flex justify-between items-center csw">
          {/* left */}
          <div className="flex justify-between items-center gap-3">
            <h1 className="text-xl">PickGro</h1>
          </div>
          {/* right */}
          <div className="flex justify-center items-center gap-3">
            <span className=" " onClick={handleThemeSection}>
              <div className="text-theme">
                {darkMode === true ? <MdSunny /> : <BsFillMoonStarsFill />}
              </div>
            </span>
            <span><Link href='/auth'>LogIn/SignUp</Link></span>
          </div>
        </div>

        <section id="themeSection" className="hidden absolute top-0 right-0 inset-0 w-[100vw] h-[100vh]" onClick={handleThemeSection}>
          <div className="fixed w-full h-full mx-auto" >
            <div className="csw h-full relative">
              <section className=" absolute  dark:bg-black-bg dark:border-none border-black-icon border dark:text-white w-36 h-24 py-2  rounded-lg top-20 right-3 ">
                <div
                  id="light"
                  className={`theme-options ${theme == 'false' && 'text-theme'}`}
                  onClick={handleTheme}
                >

                  <span className={`text-black-icon text-lg ${theme == 'false' && 'text-theme'}`}>
                    <MdSunny />
                  </span>
                  Ligth
                </div>
                <div
                  id="dark"
                  className={`theme-options ${theme == 'true' && 'text-theme'}`}
                  onClick={handleTheme}
                >

                  <span className={`text-black-icon text-lg ${theme == 'true' && 'text-theme'}`}>
                    <BsFillMoonStarsFill />
                  </span>
                  Dark
                </div>
                <div
                  id="system"
                  onClick={handleTheme}
                  className={`theme-options ${theme == 'system' && 'text-theme'}`}
                >
                  <span className={`text-black-icon text-lg ${theme == 'system' && 'text-theme'}`}>
                    <HiComputerDesktop />
                  </span>
                  System
                </div>
              </section>
            </div>
          </div>
        </section>
      </nav>
    </>
  );
}
