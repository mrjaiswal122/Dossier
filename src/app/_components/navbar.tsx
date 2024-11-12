"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

import { BsFillMoonStarsFill } from "react-icons/bs";
import { MdArrowCircleRight, MdSunny } from "react-icons/md";
import { HiComputerDesktop } from "react-icons/hi2";
import Link from "next/link";
import axios from "axios";
import Profile from "./profile";
import { setThemeRedux } from "../_features/theme/themeSlice";
import { toggleDarkMode } from "../_features/darkMode/darkSlice";
import { useAppSelector, useAppDispatch } from "../_store/hooks";
import { BiMenu } from "react-icons/bi";
import { GrClose } from "react-icons/gr";
import { FiLogOut } from "react-icons/fi";
import { signOut } from "next-auth/react";

type LogedInUser = {
  name: string;
  email: string;
  imageUrl: string;
  role: string;
  username: string;
};
export default function Navbar() {
  const dispatch = useAppDispatch();
  const reduxTheme = useAppSelector((state) => state.theme);
  const darkModeRedux = useAppSelector((state) => state.darkModeRedux);
  const [prefersDarkScheme, setPrefersDarkScheme] = useState(false);
  const [user, setUser] = useState<LogedInUser>();
  const [login, setLogin] = useState<boolean>();
  const [toogleSideBar, setToogleSideBar] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setPrefersDarkScheme(
          window.matchMedia("(prefers-color-scheme: dark)").matches
        );
        // api call
        const response = await axios.get("/api/check-login");
        if (response.data.msg === "Show User") {
          setUser(response.data.data);
        } else if (response.data.msg === "Show Login") {
          setLogin(true);
        } else {
          setLogin(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    setPrefersDarkScheme(
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
    switch (localStorage.getItem("theme")) {
      case "system":
        dispatch(toggleDarkMode(prefersDarkScheme));
        dispatch(setThemeRedux("system"));
        break;
      case "dark":
        dispatch(toggleDarkMode(true));
        dispatch(setThemeRedux("dark"));
        break;
      case "light":
        dispatch(toggleDarkMode(false));
        dispatch(setThemeRedux("light"));
        break;
      default:
        localStorage.setItem("theme", "system");
        dispatch(toggleDarkMode(prefersDarkScheme));
        dispatch(setThemeRedux("system"));
    }
  }, [dispatch, prefersDarkScheme]);
  const handleTheme = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target as HTMLElement;
    switch (target.closest("div")?.id) {
      case "dark":
        dispatch(toggleDarkMode(true));
        dispatch(setThemeRedux("dark"));
        localStorage.setItem("theme", "dark");
        break;
      case "system":
        dispatch(toggleDarkMode(prefersDarkScheme));
        dispatch(setThemeRedux("system"));
        localStorage.setItem("theme", "system");
        break;
      case "light":
        dispatch(toggleDarkMode(false));
        dispatch(setThemeRedux("light"));
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
  const handleSideBar = (e: React.MouseEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).id === "sideBar") setToogleSideBar(false);
  };
  

  return (
    <>
      <nav className="w-full h-16 dark:text-white shadow-2xl flex justify-between items-center relative backdrop-blur-lg">
        <div className="flex justify-between items-center csw">
          {/* left */}
          <div className="flex justify-between items-center gap-3">
            <Link href="/" className="text-xl">
              Dossier
            </Link>
          </div>
          {/* right */}
          {/* for smaller screens */}
          <div
            className="sm:hidden flex justify-center items-center"
            onClick={() => setToogleSideBar(true)}
          >
            <BiMenu />
          </div>
          {/* for larger screens */}
          <div className="sm:flex hidden justify-center items-center gap-3">
            <span className=" " onClick={handleThemeSection}>
              <div className="text-theme">
                {darkModeRedux === true ? <MdSunny /> : <BsFillMoonStarsFill />}
              </div>
            </span>
            {user == undefined ? (
              <LoginOrSignup login={login} />
            ) : (
              <Profile user={user} />
            )}
          </div>
        </div>

        <section
          id="themeSection"
          className="hidden absolute top-0 right-0 z-[1]  w-[100vw] h-[100vh]"
          onClick={handleThemeSection}
        >
          <div className="fixed w-full h-full mx-auto">
            <div className="csw h-full relative">
              <section className=" absolute z-10 dark:bg-black-bg dark:border-none bg-theme-light shadow-lg border-black-icon border dark:text-white w-36 h-24 py-2  rounded-lg top-20 right-3 ">
                <div
                  id="light"
                  className={`theme-options ${
                    reduxTheme == "light" && "text-theme"
                  }`}
                  onClick={handleTheme}
                >
                  <span
                    className={`text-black-icon text-lg ${
                      reduxTheme == "light" && "text-theme"
                    }`}
                  >
                    <MdSunny />
                  </span>
                  Ligth
                </div>
                <div
                  id="dark"
                  className={`theme-options ${
                    reduxTheme == "dark" && "text-theme"
                  }`}
                  onClick={handleTheme}
                >
                  <span
                    className={`text-black-icon text-lg ${
                      reduxTheme == "dark" && "text-theme"
                    }`}
                  >
                    <BsFillMoonStarsFill />
                  </span>
                  Dark
                </div>
                <div
                  id="system"
                  onClick={handleTheme}
                  className={`theme-options ${
                    reduxTheme == "system" && "text-theme"
                  }`}
                >
                  <span
                    className={`text-black-icon text-lg ${
                      reduxTheme == "system" && "text-theme"
                    }`}
                  >
                    <HiComputerDesktop />
                  </span>
                  System
                </div>
              </section>
            </div>
          </div>
        </section>
        {/* SIDE Bar */}
        {toogleSideBar && (
          <section
            className="fixed top-0 right-0 w-screen h-screen bg-black bg-opacity-65"
            id="sideBar"
            onClick={(e) => {
              handleSideBar(e);
            }}
          >
            <SideBar
              setToogleSideBar={setToogleSideBar}
              user={user}
              login={login}
            />
          </section>
        )}
      </nav>
    </>
  );
}
function SideBar({
  setToogleSideBar,
  user,
  login,
}: {
  setToogleSideBar: Dispatch<SetStateAction<boolean>>;
  user: LogedInUser | undefined;
  login: boolean | undefined;
}) {
const logout = async (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    e.stopPropagation();

    try {
      // Calling logout API on the server
      await axios.get('/api/logout');
      // Redirect to home page or login page
      await signOut();
      window.location.href = '/';
    } catch (err) {
      console.error('Logout failed:', err);
      // Provide user feedback if necessary
      alert('Logout failed. Please try again.');
    }
  };
  return (
    <>
      <div className=" bg-gray-700 w-[250px] h-screen float-right rounded-lg">
        {/* close */}
        <button
          className="float-right m-3 hover:text-reds"
          onClick={() => setToogleSideBar(false)}
        >
          <GrClose />
        </button>
        <div className="h-full w-full flex flex-col justify-between">
          {/* navigation make state to track if user is on a portfolio  */}
          <div className="flex flex-col gap-6">
            <Link href="/[username]/">Profile</Link>
            <a href="">Projects</a>
            <a href="">Work Experience</a>
          </div>
          {/* user deatail */}
           <div className="mb-16 text-sm">
            {user ? (
              <div className="flex justify-between items-center px-3 ">
                 <div className="flex gap-3">
                <Profile user={user} />
                {user.name}
                 </div>
                 <FiLogOut className="hover:scale-105 transition-all duration-200 ease-in-out hover:text-red-700 hover:font-bold cursor-pointer "  aria-label="Logout" onClick={logout}/>

              </div>
            ) : (
        
              <Link href="/auth" className="flex gap-1 hover:gap-3 hover:text-blue-muted transition-all duration-200 px-3 text-lg items-center" onClick={()=>setToogleSideBar(false)}>LogIn <MdArrowCircleRight /></Link> 
              

                )}{" "}
           </div>


           

        </div>
      </div>
    </>
  );
}
function LoginOrSignup({ login }: { login: boolean | undefined }) {
  return (
    <span >
      {login == true ? (
       <Link href="/auth">LogIn</Link>
      ) : (
        <Link href="/auth/signup">Signup</Link>
      )} 
    </span>
  );
}
