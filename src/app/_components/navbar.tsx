'use client';
import { useEffect, useState } from "react";

import { BsFillMoonStarsFill } from "react-icons/bs";
import { MdSunny } from "react-icons/md";
import { HiComputerDesktop } from "react-icons/hi2";
import Link from "next/link";
import axios from "axios";
import Profile from "./profile";
import { setThemeRedux } from "../_features/theme/themeSlice";
import {toggleDarkMode} from '../_features/darkMode/darkSlice';
import { useAppSelector,useAppDispatch } from "../_store/hooks";

type ThemeType='system'|'dark'|'light';

export default function Navbar() {
  const dispatch = useAppDispatch();
  const reduxTheme:ThemeType=useAppSelector((state)=>state.theme);
  const darkModeRedux=useAppSelector(state=>state.darkModeRedux);
  
  const [prefersDarkScheme, setPrefersDarkScheme] = useState(false);
  
  const [user,setUser] = useState<{name:string,email:string,imageUrl:string,role:string,username:string}>();
  const [login,setLogin] = useState<boolean>();
   
    
useEffect(() => {
  const fetchData = async () => {
    try {
      setPrefersDarkScheme(window.matchMedia("(prefers-color-scheme: dark)").matches);
      // api call
      const response = await axios.get('/api/check-login');
      

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
}, [])
  useEffect(() => {
    setPrefersDarkScheme(window.matchMedia("(prefers-color-scheme: dark)").matches);
    switch (localStorage.getItem("theme")) {
      case "system":
      
        dispatch(toggleDarkMode(prefersDarkScheme))
        dispatch(setThemeRedux('system'));
        break;
      case "dark":
       
        dispatch(toggleDarkMode(true));
        dispatch(setThemeRedux('dark'));
        break;
      case "light":
       
        dispatch(toggleDarkMode(false));
        dispatch(setThemeRedux('light'));
        break;
      default:
        localStorage.setItem("theme", 'system');
       ;
        dispatch(toggleDarkMode(prefersDarkScheme));
        dispatch(setThemeRedux('system'));
     
    }
   
  }, [dispatch, prefersDarkScheme]);

  const handleTheme = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target as HTMLElement;

    switch (target.closest('div')?.id) {
      case "dark":
   
        dispatch(toggleDarkMode(true));
        dispatch(setThemeRedux('dark'));
        localStorage.setItem("theme", 'dark');
        break;
      case "system":
    
        dispatch(toggleDarkMode(prefersDarkScheme));
        dispatch(setThemeRedux('system'));
        localStorage.setItem("theme", 'system');
        break;
      case "light":
      
        dispatch(toggleDarkMode(false));
        dispatch(setThemeRedux('light'));
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
      <nav className="w-full h-16 dark:text-white dark:bg-black bg-theme-light shadow-2xl flex justify-between items-center relative backdrop-blur-lg">
        <div className="flex justify-between items-center csw">
          {/* left */}
          <div className="flex justify-between items-center gap-3">
            <Link href="/" className="text-xl">Dossier</Link>
          </div>
          {/* right */}
          <div className="flex justify-center items-center gap-3">
            <span className=" " onClick={handleThemeSection}>
              <div className="text-theme">
                {darkModeRedux === true ? <MdSunny /> : <BsFillMoonStarsFill />}
              </div>
            </span>{
            user==undefined?
            <LoginOrSignup login={login}/>:<Profile user={user}/>
            }
          </div>
        </div>

        <section id="themeSection" className="hidden absolute top-0 right-0 z-[1]  w-[100vw] h-[100vh]" onClick={handleThemeSection}>
          <div className="fixed w-full h-full mx-auto" >
            <div className="csw h-full relative">
              <section className=" absolute z-10 dark:bg-black-bg dark:border-none bg-theme-light shadow-lg border-black-icon border dark:text-white w-36 h-24 py-2  rounded-lg top-20 right-3 ">
                <div
                  id="light"
                  className={`theme-options ${reduxTheme == 'light' && 'text-theme'}`}
                  onClick={handleTheme}
                >

                  <span className={`text-black-icon text-lg ${reduxTheme == 'light' && 'text-theme'}`}>
                    <MdSunny />
                  </span>
                  Ligth
                </div>
                <div
                  id="dark"
                  className={`theme-options ${reduxTheme == 'dark' && 'text-theme'}`}
                  onClick={handleTheme}
                >

                  <span className={`text-black-icon text-lg ${reduxTheme == 'dark' && 'text-theme'}`}>
                    <BsFillMoonStarsFill />
                  </span>
                  Dark
                </div>
                <div
                  id="system"
                  onClick={handleTheme}
                  className={`theme-options ${reduxTheme == 'system' && 'text-theme'}`}
                >
                  <span className={`text-black-icon text-lg ${reduxTheme == 'system' && 'text-theme'}`}>
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
function LoginOrSignup({login}:{login:boolean|undefined}){
  return(
    <span>{login==true?<Link href='/auth'>LogIn</Link>:<Link href='/auth/signup'>Signup</Link>}</span>
  )
}
