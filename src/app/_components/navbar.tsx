"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

import { BsFillMoonStarsFill } from "react-icons/bs";
import { MdArrowCircleRight, MdOutlineWork, MdSunny } from "react-icons/md";
import { HiComputerDesktop } from "react-icons/hi2";
import Link from "next/link";
import axios from "axios";
import Profile from "./profile";
import { setThemeRedux } from "../_features/theme/themeSlice";
import { toggleDarkMode } from "../_features/darkMode/darkSlice";
import { useAppSelector, useAppDispatch } from "../_store/hooks";
import { BiEdit, BiMenu } from "react-icons/bi";
import { GrClose, GrProjects } from "react-icons/gr";
import { FiLogOut } from "react-icons/fi";
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { ImProfile } from "react-icons/im";
import { FaExternalLinkAlt } from "react-icons/fa";
import { setToastMsgRedux } from "../_features/toastMsg/toastMsgSlice";
import SurePrompt from "./SurePrompt";

type LogedInUser = {
  name: string;
  email: string;
  imageUrl: string;
  role: string;
  username: string;
};
export default function Navbar() {
  const dispatch = useAppDispatch();
  const portfolio = useAppSelector((state) => state.portfolioSlice);
  const [prefersDarkScheme, setPrefersDarkScheme] = useState(false);
  const [user, setUser] = useState<LogedInUser>();
  const [toogleSideBar, setToogleSideBar] = useState(false);
  const pathname = usePathname().slice(1);
  const [isOpen, setIsOpen] = useState(false)


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
        }
      } catch (error) {
        dispatch(
          setToastMsgRedux({ msg: "Please Login Again !!", type: "error" })
        );
      }
    };

    fetchData();
  }, [dispatch]);
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
          <div className="flex">
            {/* for larger screens */}
            {pathname == portfolio.routeName && pathname != "" && (
              <div className="  gap-6 mr-6 text-sm hidden md:flex">
                <Link
                  href={`/${portfolio.routeName}`}
                  className="flex gap-3 items-center hover:bg-grays rounded-lg py-2 px-3"
                  onClick={() => setToogleSideBar(false)}
                >
                  <ImProfile /> Profile
                </Link>
                {portfolio.projects && portfolio.projects?.length>0&&
                  <Link
                  href={`/${portfolio.routeName}#projectSection`}
                  className="flex gap-3 items-center hover:bg-grays rounded-lg py-2 px-3"
                  onClick={() => setToogleSideBar(false)}
                  >
                  <GrProjects />
                  Projects
                </Link>
                }{portfolio.experience && portfolio.experience.length>0&&

                  <Link
                  href={`/${portfolio.routeName}#experienceSection`}
                  className="flex gap-3 items-center hover:bg-grays rounded-lg py-2 px-3"
                  onClick={() => setToogleSideBar(false)}
                  >
                  <MdOutlineWork />
                  Work Experience
                </Link>
                }
              </div>
            )}

            {/* hamburger */}
            <div
              className=" flex justify-center items-center"
              onClick={() => setToogleSideBar(true)}
            >
              <BiMenu className="hover:text-theme cursor-pointer"/>
            </div>
          </div>
        </div>

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
              handleTheme={handleTheme}
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
  handleTheme,
}: {
  setToogleSideBar: Dispatch<SetStateAction<boolean>>;
  user: LogedInUser | undefined;
  handleTheme: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}) {
  const portfolio = useAppSelector((state) => state.portfolioSlice);
  const pathname = usePathname().slice(1);
  const reduxTheme = useAppSelector((state) => state.theme);
  const [isOpen, setIsOpen] = useState(false)
  const [openChangeRouteName,setOpenChangeRouteName]=useState(false)


  
  const handleChangeRouteName=()=>{

  }
  const logout = async () => {
    // e.stopPropagation();

    try {
      // Calling logout API on the server
      await axios.get("/api/logout");
      // Redirect to home page or login page
      await signOut();
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
      // Provide user feedback if necessary
      alert("Logout failed. Please try again.");
    }
  };
  return (
    <>
      <div className=" bg-black bg-opacity-80 w-[280px] h-screen float-right rounded-lg  border-[1px] border-grays text-whites ">
        {/* close */}
        <button
          className="float-right m-3 hover:text-reds"
          onClick={() => setToogleSideBar(false)}
        >
          <GrClose />
        </button>
        <div className="h-full w-full flex flex-col justify-between">
          {/* to keep the justify-between working */}
          <div className="w-full h-2"></div>

          {/* navigation make state to track if user is on a portfolio  */}
          {pathname == portfolio.routeName && pathname != "" && (
            <div className="flex flex-col gap-6 mx-3 md:hidden">
              <Link
                href={`/${portfolio.routeName}`}
                className="flex gap-3 items-center hover:bg-grays rounded-lg py-2 px-3"
                onClick={() => setToogleSideBar(false)}
              >
                <ImProfile /> Profile
              </Link>
              <Link
                href={`/${portfolio.routeName}#projectSection`}
                className="flex gap-3 items-center hover:bg-grays rounded-lg py-2 px-3"
                onClick={() => setToogleSideBar(false)}
              >
                <GrProjects />
                Projects
              </Link>
              <Link
                href={`/${portfolio.routeName}#experienceSection`}
                className="flex gap-3 items-center hover:bg-grays rounded-lg py-2 px-3"
                onClick={() => setToogleSideBar(false)}
              >
                <MdOutlineWork />
                Work Experience
              </Link>
            </div>
          )}

          {/* binding to the bottom */}
          <div className="border-t border-grays mx-2 pt-3 ">
            {user?.username && (
              <div className="text-xs flex justify-between items-center mx-3">
                      Your Portfolio : 
              <Link
                href={user.username}
                className="hover:text-blue-500 text-xs  "
                onClick={() => setToogleSideBar(false)}
                >
                  {user.username} 
              </Link>
                <BiEdit className="scale-110 hover:text-grays hover:scale-125" onClick={()=>setOpenChangeRouteName(true)}/> 
                </div>
            )}
            {/* settings */}

            <span className="flex  m-3 px-3 py-1 justify-between  border border-grays rounded-2xl ">
              <div
                id="light"
                onClick={handleTheme}
                className={`${
                  reduxTheme == "light"
                    ? "bg-theme  text-black font-bold"
                    : "hover:bg-gray-600"
                } cursor-pointer flex flex-col-reverse gap-1 justify-center items-center text-xs px-3 py-2 rounded-xl`}
              >
                Light <MdSunny />
              </div>
              <div
                id="dark"
                onClick={handleTheme}
                className={`${
                  reduxTheme == "dark"
                    ? "bg-theme text-black font-bold"
                    : "hover:bg-gray-600"
                } cursor-pointer flex flex-col-reverse gap-1 justify-center items-center text-xs px-3 py-2 rounded-xl`}
              >
                Dark <BsFillMoonStarsFill />
              </div>
              <div
                id="system"
                onClick={handleTheme}
                className={`${
                  reduxTheme == "system"
                    ? "bg-theme  text-black font-bold"
                    : "hover:bg-gray-600"
                } cursor-pointer flex flex-col-reverse gap-1 justify-center items-center text-xs px-3 py-2 rounded-xl`}
              >
                System <HiComputerDesktop />
              </div>
            </span>

            {/* user deatail */}

            <div className="mb-16 text-sm border-t-[1px]  border-grays   ">
              {user ? (
                <div className="flex justify-between items-center p-3 ">
                  <div className="flex gap-3">
                    <Profile user={user} />
                    {user.name}
                  </div>
                  <FiLogOut
                    className="hover:scale-105 transition-all duration-200 ease-in-out hover:text-red-600 hover:font-bold cursor-pointer "
                    aria-label="Logout"
                    onClick={()=>setIsOpen(true)}
                  />
                </div>
              ) : (
                <Link
                  href="/auth"
                  className="flex gap-1 hover:gap-3 hover:text-blue-muted transition-all duration-200 p-3 text-lg items-center"
                  onClick={() => setToogleSideBar(false)}
                >
                  LogIn <MdArrowCircleRight />
                </Link>
              )}{" "}
            </div>
          </div>
        </div>
      </div>
      {openChangeRouteName&&<ChangeRouteName setOpenChangeRouteName={setOpenChangeRouteName}/>}
      {isOpen&& <SurePrompt setIsOpen={setIsOpen} msg="Are you sure, you want logout?" action={logout}/>}
    </>
  );
}

type ChangeRouteNameProps={
  setOpenChangeRouteName:Dispatch<SetStateAction<boolean>>
}
function ChangeRouteName({setOpenChangeRouteName}:ChangeRouteNameProps){
    const portfolio=useAppSelector((state)=>state.portfolioSlice)
    const [routename,setRouteName]=useState(portfolio.routeName)
    const handleChangeRouteForm=(e:React.MouseEvent<HTMLElement, MouseEvent>)=>{
    const section =(e.target)as HTMLElement ;
    if(section.id==='changeRoute'){
      setOpenChangeRouteName(false)
    }
    }
    const handleChangeRouteNames=(e:React.ChangeEvent<HTMLInputElement>)=>{
     setRouteName(e.target.value)
    }
  return(
    <> 

    <section className="fixed flex justify-center items-center top-0 right-0 w-screen h-screen bg-black bg-opacity-65 " id="changeRoute" onClick={handleChangeRouteForm}>

        <form action="" className="border border-grays rounded-lg w-[300px] flex flex-col p-6 text-whites shadow-2xl bg-black">
          <div className="flex justify-between items-center text-xl mb-6">
          <h1>Change Route Name</h1>
          <GrClose className="hover:text-reds" onClick={()=>setOpenChangeRouteName(false)}/>
          </div>
          <div className=" flex justify-between">
           
            <input id="routeName" type="text" className="border-grays bg-grays" value={routename} onChange={(e)=>handleChangeRouteNames(e)}/>
            <button className="py-2 px-3 bg-greens rounded-lg" disabled={portfolio.routeName==routename}>Check</button>
          </div>
        </form>
    </section>
    </>
  )

}