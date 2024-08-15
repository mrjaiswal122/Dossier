"use client";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { atomDarkMode } from "../_state/atom";
import { BsFillMoonStarsFill } from "react-icons/bs";
import { MdSunny } from "react-icons/md";
import { HiComputerDesktop } from "react-icons/hi2";
export default function Navbar() {
  const [darkMode, setDarkMode] = useAtom(atomDarkMode);
  const [prefersDarkScheme, setPrefersDarkScheme] = useState(false);
  const [theme, setTheme] = useState<"true" | "false" | "system">("system");

  useEffect(() => {
    setPrefersDarkScheme(
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
    console.log(window.matchMedia("(prefers-color-scheme: dark)"));

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
        localStorage.setItem("theme", "system");
        setDarkMode(prefersDarkScheme);
    }
  }, []);

  const handleTheme = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target as HTMLElement;

    switch (target.closest("div")?.id) {
      case "dark":
        setDarkMode(true);
        setTheme("true");
        localStorage.setItem("theme", "dark");
        break;
      case "system":
        setDarkMode(prefersDarkScheme);
        setTheme("system");
        localStorage.setItem("theme", "system");
        break;
      case "light":
        setDarkMode(false);
        setTheme("false");
        localStorage.setItem("theme", "light");
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
      <nav className="relative">
        <div className="w-full  dark:text-white dark:bg-black flex justify-between items-center">
          <div className="flex justify-between items-center csw h-16">
            {/* left */}
            <div className="flex justify-between items-center gap-3">
              <h1 className="text-xl">PickGro</h1>
            </div>
            {/* right */}
            <div>
              <span className=" text-theme" onClick={handleThemeSection}>
                {darkMode === true ? <MdSunny /> : <BsFillMoonStarsFill />}
              </span>
            </div>
          </div>
        </div>

        <div
          id="themeSection"
          className="absolute top-0 right-0 inset-0   hidden"
          onClick={handleThemeSection}
        >
          <div className="fixed ">
            <div className="relative w-[100vw] h-[100vh]">
              <section className="absolute dark:bg-black-bg dark:border-none border-black-icon border dark:text-white w-36 h-24 py-2  rounded-lg top-20 right-4 ">
                <div
                  id="light"
                  className={`flex items-center pl-2 gap-2 dark:hover:bg-gray-600 cursor-pointer ${
                    theme === "false" && "text-theme"
                  }`}
                  onClick={handleTheme}
                >
                  <span
                    className={`text-black-icon text-lg ${
                      theme === "false" && "text-theme"
                    }`}
                  >
                    <MdSunny />
                  </span>
                  Ligth
                </div>
                <div
                  id="dark"
                  className={`flex items-center pl-2 gap-2 dark:hover:bg-gray-600 cursor-pointer ${
                    theme === "true" && "text-theme"
                  }`}
                  onClick={handleTheme}
                >
                  <span
                    className={`text-black-icon text-lg ${
                      theme === "true" && "text-theme"
                    }`}
                  >
                    <BsFillMoonStarsFill />
                  </span>
                  Dark
                </div>
                <div
                  id="system"
                  onClick={handleTheme}
                  className={`flex items-center pl-2 gap-2 dark:hover:bg-gray-600 cursor-pointer ${
                    theme === "system" && "text-theme"
                  }`}
                >
                  <span
                    className={`text-black-icon text-lg ${
                      theme === "system" && "text-theme"
                    }`}
                  >
                    <HiComputerDesktop />
                  </span>
                  System
                </div>
              </section>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
