"use client";
import React, { Dispatch,  SetStateAction, useEffect, useState } from "react";
import gsap from "gsap"
import { BsFillMoonStarsFill } from "react-icons/bs";
import { MdArrowCircleRight, MdOutlineWork, MdSunny } from "react-icons/md";
import { HiComputerDesktop } from "react-icons/hi2";
import Link from "next/link";
import axios from "axios";
import Profile from "./profile";
import { setThemeRedux, ThemeType } from "../features/theme/themeSlice";
import { toggleDarkMode } from "../features/darkMode/darkSlice";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { BiEdit, BiMenu } from "react-icons/bi";
import { GrClose, GrProjects } from "react-icons/gr";
import { FiLogOut } from "react-icons/fi";
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { ImProfile } from "react-icons/im";
import { setToastMsgRedux } from "../features/toastMsg/toastMsgSlice";
import SurePrompt from "./SurePrompt";
import { updateRouteNameAsync } from "../features/portfolio/portfolioSlice";
import { FaGears } from "react-icons/fa6";
import { updateUser, UserType } from "../features/user/userSlice";
import { cn } from "../util/cn";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const portfolio = useAppSelector((state) => state.portfolioSlice);
  const user = useAppSelector((state) => state.userSlice);
  
  const [toogleSideBar, setToogleSideBar] = useState(false);
  const pathname = usePathname()?.slice(1) ?? "";
 

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const storedTheme = localStorage.getItem("theme") || "system";

    switch (storedTheme) {
      case "system":
        dispatch(toggleDarkMode(prefersDark));
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
        dispatch(toggleDarkMode(prefersDark));
        dispatch(setThemeRedux("system"));
    }
  }, [dispatch]);

  const handleTheme = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target as HTMLElement;
    const theme = target.closest("div")?.id! as ThemeType;

    if (!theme) {
      handleThemeSection();
      return;
    }

    const isDark = theme === "dark";
    const isSystem = theme === "system";
    
    dispatch(toggleDarkMode(isSystem ? window.matchMedia("(prefers-color-scheme: dark)").matches : isDark));
    dispatch(setThemeRedux(theme));
    localStorage.setItem("theme", theme);
  };

  const handleThemeSection = () => {
    document.getElementById("themeSection")?.classList.toggle("hidden");
  };

  const handleSideBar = (e: React.MouseEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).id === "sideBar") {
      setToogleSideBar(false);
    }
  };

  useEffect(() => {
    if (toogleSideBar) {
      gsap.to("#sideBar", {
        right: 0,
        duration: 0.3,
        ease: "power2.in",
      });
    }
  }, [toogleSideBar]);
  return (
    <>
      <nav className="w-full h-16 dark:text-white shadow-2xl flex justify-between items-center relative backdrop-blur-lg ">
        <div className="flex justify-between items-center csw">
          {/* left */}
          <div className="flex justify-between items-center gap-3">
            <Link href="/" className="text-2xl text-theme   font-extrabold ">
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
                  className="flex gap-3 items-center hover:bg-theme-dark dark:hover:bg-gray-600 rounded-lg py-2 px-3"
                  onClick={() => setToogleSideBar(false)}
                >
                  <ImProfile /> Profile
                </Link>
                {portfolio.skills && portfolio.skills.length>0 &&(
                  <Link className="flex gap-3 items-center hover:bg-theme-dark dark:hover:bg-gray-600 rounded-lg py-2 px-3" href={`/${portfolio.routeName}/#skillSection`}>
                  <FaGears />

                  Skills  
                  </Link>
                ) }
                {portfolio.projects && portfolio.projects?.length > 0 && (
                  <Link
                    href={`/${portfolio.routeName}#projectSection`}
                    className="flex gap-3 items-center hover:bg-theme-dark dark:hover:bg-gray-600 rounded-lg py-2 px-3"
                    onClick={() => setToogleSideBar(false)}
                  >
                    <GrProjects />
                    Projects
                  </Link>
                )}
                {portfolio.experience && portfolio.experience.length > 0 && (
                  <Link
                    href={`/${portfolio.routeName}#experienceSection`}
                    className="flex gap-3 items-center hover:bg-theme-dark dark:hover:bg-gray-600 rounded-lg py-2 px-3"
                    onClick={() => setToogleSideBar(false)}
                  >
                    <MdOutlineWork />
                    Work Experience
                  </Link>
                )}
              </div>
            )}

            {/* hamburger */}
            <div
              className=" flex justify-center items-center"
              onClick={()=>setToogleSideBar(true)}
            >
              <BiMenu className="text-theme   scale-150 cursor-pointer" />
            </div>
          </div>
        </div>

        {/* SIDE Bar */}
        {toogleSideBar && (
          <section
            className="fixed top-0 right-[-280px] w-screen h-screen "
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
  user: UserType|undefined;
  handleTheme: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}) {
  const portfolio = useAppSelector((state) => state.portfolioSlice);
  const pathname = usePathname()?.slice(1) ?? "";
  const reduxTheme = useAppSelector((state) => state.theme);
  const [isOpen, setIsOpen] = useState(false);
  const [openChangeRouteName, setOpenChangeRouteName] = useState(false);

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
      <div className=" bg-black w-[280px] h-lvh md:h-screen float-right rounded-lg  border-[1px] border-grays text-whites ">
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
                className="flex gap-3 items-center hover:bg-theme-dark dark:hover:bg-gray-600 rounded-lg py-2 px-3"
                onClick={() => setToogleSideBar(false)}
              >
                <ImProfile /> Profile
              </Link>
              {portfolio.skills && portfolio.skills.length>0 &&(
                  <Link className="flex gap-3 items-center hover:bg-theme-dark dark:hover:bg-gray-600 rounded-lg py-2 px-3" href={`/${portfolio.routeName}/#skillSection`}
                  onClick={() => setToogleSideBar(false)}>
                  <FaGears />

                  Skills  
                  </Link>
                ) }

               {portfolio.projects && portfolio.projects?.length > 0 && (
                  <Link
                    href={`/${portfolio.routeName}#projectSection`}
                    className="flex gap-3 items-center hover:bg-theme-dark dark:hover:bg-gray-600 rounded-lg py-2 px-3"
                    onClick={() => setToogleSideBar(false)}
                  >
                    <GrProjects />
                    Projects
                  </Link>
                )}
               {portfolio.experience && portfolio.experience.length > 0 && (
                  <Link
                    href={`/${portfolio.routeName}#experienceSection`}
                    className="flex gap-3 items-center hover:bg-theme-dark dark:hover:bg-gray-600 rounded-lg py-2 px-3"
                    onClick={() => setToogleSideBar(false)}
                  >
                    <MdOutlineWork />
                    Work Experience
                  </Link>
                )}
            </div>
          )}

          {/* binding to the bottom */}
          <div className=" border-grays mx-2 pt-3 ">
            {user?.username && (
              <div className="text-sm flex justify-between items-center mx-3 mb-3">
                Your Portfolio :
                <Link
                  href={user.username}
                  className="hover:text-blue-500 text-sm  underline"
                  onClick={() => setToogleSideBar(false)}
                >
                  {user.username}
                </Link>
                <BiEdit
                  className="scale-110 hover:text-grays hover:scale-125 cursor-pointer"
                  onClick={() => setOpenChangeRouteName(true)}
                />
              </div>
            )}
             {/* user deatail */}

            <div className=" text-sm border-y-[1px]  border-grays   ">
              {user?.name ? (
                <div className="flex justify-between items-center p-3 ">
                  <div className="flex gap-3">
                    <Profile user={user} />
                    {user.name}
                  </div>
                  <FiLogOut
                    className="hover:scale-105 transition-all duration-200 ease-in-out hover:text-red-600 hover:font-bold cursor-pointer "
                    aria-label="Logout"
                    onClick={() => setIsOpen(true)}
                  />
                </div>
              ) : (
                <Link
                  href="/auth"
                  className="flex gap-1 hover:gap-3 hover:text-blue-muted transition-all duration-200 p-3 text-lg items-center w-full justify-center"
                  onClick={() => setToogleSideBar(false)}
                >
                  LogIn <MdArrowCircleRight />
                </Link>
              )}{" "}
            </div>
            {/* settings */}

            <span className="flex mb-16 m-3 px-3 py-3 justify-between  border border-grays rounded-2xl ">
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

           
          </div>
        </div>
      </div>
      {openChangeRouteName && (
        <ChangeRouteName setOpenChangeRouteName={setOpenChangeRouteName} />
      )}
      {isOpen && (
        <SurePrompt
          setIsOpen={setIsOpen}
          msg="Are you sure, you want logout?"
          action={logout}
        />
      )}
    </>
  );
}

type ChangeRouteNameProps = {
  setOpenChangeRouteName: Dispatch<SetStateAction<boolean>>;
};

interface Message {
  message: string;
  success: boolean;
}


export function ChangeRouteName({ setOpenChangeRouteName }: ChangeRouteNameProps) {
  const { username } = useAppSelector((state) => state.userSlice);
  const dispatch = useAppDispatch();
  
  const [message, setMessage] = useState<Message>({ message: '', success: false });
  const [routeName, setRouteName] = useState(username);
  const [isAvailable, setIsAvailable] = useState(false);

  const handleClose = () => setOpenChangeRouteName(false);

  const handleBackdropClick = (e: React.MouseEvent<HTMLElement>) => {
    if (e.target instanceof HTMLElement && e.target.id === 'changeRoute') {
      handleClose();
    }
  };

  const handleRouteNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRouteName = e.target.value;
    setRouteName(newRouteName);
    setMessage({ message: '', success: false });
    setIsAvailable(false);
  };

  const checkAvailability = async (formData: FormData) => {
  
    console.log(formData.get("routeName"));
    
    try {
      const response = await axios.post('/api/check-availability', formData);
      
      if (response.data.success) {
        setMessage({ message: 'Route name is available ✔', success: true });
        setIsAvailable(true);
        return true;
      }
    } catch (error: any) {
      if (error.response?.status === 409) {
        setMessage({ message: 'Routename is not available', success: false });
      } else {
        dispatch(
          setToastMsgRedux({
            msg: error.response?.data?.msg || 'An error occurred',
            type: 'error',
            expire: false
          })
        );
      }
      setIsAvailable(false);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!routeName?.trim()) return;

    if (!isAvailable) {
      const formData = new FormData();
      formData.append('routeName', routeName);
      await checkAvailability(formData);
      return;
    }
 
 
    const { payload } = await dispatch(updateRouteNameAsync({ changedRouteName: routeName }));
    
    if ((payload as { redirect: boolean }).redirect) {
      window.location.href = `/${routeName.trim()}`;
    }

    handleClose();
  };

  return (
    <section
      className="fixed flex justify-center items-center top-0 right-0 w-screen h-screen bg-black bg-opacity-65"
      id="changeRoute"
      onClick={handleBackdropClick}
    >
      <form
        onSubmit={handleSubmit}
        className="border border-grays rounded-lg w-[300px] flex flex-col p-6 text-whites shadow-2xl bg-black"
      >
        <div className="flex justify-between items-center text-xl mb-6">
          <h1>Change Route Name</h1>
          <GrClose
            className="hover:text-reds cursor-pointer"
            onClick={handleClose}
          />
        </div>
        
        <div className="flex justify-between">
          <input
            id="routeName"
            type="text"
            className="border-grays bg-grays"
            value={routeName}
            onChange={handleRouteNameChange}
          />
          <button
            type="submit"
            className="py-2 px-3 bg-greens rounded-lg"
            disabled={username === routeName}
          >
            {isAvailable ? 'Submit' : 'Check'}
          </button>
        </div>
        
        {message.message && (
          <span 
            className={cn(
              "text-sm mt-3",
              message.success ? "text-greens" : "text-reds"
            )}
          >
            {message.message}
          </span>
        )}
      </form>
    </section>
  );
}
