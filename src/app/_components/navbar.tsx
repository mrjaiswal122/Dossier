'use client';
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { atomDarkMode } from "../_state/atom";
import { BsFillMoonStarsFill } from "react-icons/bs";
import { MdSunny } from "react-icons/md";
import { HiComputerDesktop } from "react-icons/hi2";
export default function Navbar() {
  const [darkMode, setDarkMode] = useAtom(atomDarkMode);
  const[prefersDarkScheme,setPrefersDarkScheme] = useState(false);
  const [theme, setTheme] = useState<"true" | "false" | "system">('system');
   
  useEffect(() => {
     setPrefersDarkScheme(window.matchMedia("(prefers-color-scheme: dark)").matches);
     switch(localStorage.getItem("theme")){
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
  }, [prefersDarkScheme,setDarkMode]);

  const handleTheme = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target as HTMLElement;
    switch (target.id) {
      case "dark":
        setDarkMode(true);
        setTheme("true");
        localStorage.setItem("theme", 'dark');
        break;
      case "system":
        // const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
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
      <nav className="w-full h-16 dark:text-white dark:bg-black flex justify-between items-center">
        <div className="flex justify-between items-center csw">
          {/* left */}
          <div className="flex justify-between items-center gap-3">
            <h1 className="text-xl">PickGro</h1>
          </div>
          {/* right */}
          <div>
            <span className="relative " onClick={handleThemeSection}>
              <div className="text-theme">
                {darkMode === true ? <MdSunny /> : <BsFillMoonStarsFill />}
              </div>
              <section
                id="themeSection"
                className="absolute  hidden dark:bg-black-bg dark:border-none border-black-icon border dark:text-white w-36 h-24 py-2  rounded-lg -bottom-32 -left-8"
              >
                <div
                  id="light"
                  className={
                    theme == "false"
                      ? "flex items-center pl-2 gap-2 dark:hover:bg-gray- cursor-pointer text-theme"
                      : "flex items-center pl-2 gap-2 dark:hover:bg-gray-600 cursor-pointer"
                  }
                  onClick={handleTheme}
                >
                  {" "}
                  <span className="text-black-icon text-lg">
                    <MdSunny />
                  </span>
                  Ligth
                </div>
                <div
                  id="dark"
                  className={
                    theme == "true"
                      ? "flex items-center pl-2 gap-2 dark:hover:bg-gray-600 cursor-pointer text-theme"
                      : "flex items-center pl-2 gap-2 dark:hover:bg-gray-600 cursor-pointer"
                  }
                  onClick={handleTheme}
                >
                 
                  <span className="text-black-icon text-lg">
                    <BsFillMoonStarsFill />
                  </span>
                  Dark
                </div>
                <div
                  id="system"
                  onClick={handleTheme}
                  className={
                    theme == "system"
                      ? "flex items-center pl-2 gap-2 dark:hover:bg-gray-600 cursor-pointer text-theme"
                      : "flex items-center pl-2 gap-2 dark:hover:bg-gray-600 cursor-pointer"
                  }
                >
                  <span className="text-black-icon text-lg">
                    <HiComputerDesktop />
                  </span>
                  System
                </div>
              </section>
            </span>
          </div>
        </div>
      </nav>
    </>
  );
}
