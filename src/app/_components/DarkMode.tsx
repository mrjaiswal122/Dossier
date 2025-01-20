"use client";
import { ReactNode } from "react";
import { useAppDispatch, useAppSelector } from "../_store/hooks";
import Navbar from "./navbar";
import { SessionProvider } from "next-auth/react";
import Err from "./Err";
import { clearToastMsgRedux } from "../_features/toastMsg/toastMsgSlice";
import { FaGithub, FaTwitter } from "react-icons/fa6";

export default function DarkMode({ children }: { children: ReactNode }) {
  const darkMode = useAppSelector((state) => state.darkModeRedux);

  const dispatch = useAppDispatch();
  const toastMsg = useAppSelector((state) => state.toastMsgSlice);

  const handleToastMsg = () => {
    dispatch(clearToastMsgRedux());
  };
  return (
    <section className={darkMode == true ? "dark" : ""}>
      <SessionProvider>
        <div className="dark:bg-black bg-whites">
          <nav className="fixed w-full  z-20 ">
            <Navbar />
          </nav>
          {/* <div className="w-full h-16"></div> */}
          
           {/* To dispaly error and messages to user in a  centralised mannner */}
            {toastMsg?.msg && (
              <Err
              msg={toastMsg.msg}
              handleClick={handleToastMsg}
              type={toastMsg.type}
              expire={toastMsg.expire}
              />
            )}
          

          {children}
        </div>
      </SessionProvider>

      {/* <footer className="w-full h-14 dark:bg-black bg-theme-light  dark:text-white  flex items-center justify-center text-xs border-t border-theme">
        @Copywrite Ankush jaiswal #2024{" "}
      </footer> */}
      <footer className="bg-black py-12">
        <div className="container mx-auto px-6">
          <div className="flex  justify-between items-center">
            <div className="  ">
              <span className="text-2xl font-bold text-whites">Dossier</span>
            </div>
            <div className="flex space-x-6">
              <a href="https://github.com/mrjaiswal122" target="_blank" className="text-grays hover:text-theme transition-colors">
                <FaGithub className="w-6 h-6" />
              </a>
              <a href="https://twitter.com/obviouslyanku" target="_blank" className="text-grays hover:text-theme transition-colors">
                <FaTwitter className="w-6 h-6" />
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-black-bg text-center text-grays">
            <p>© {new Date().getFullYear()} Dossier. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </section>
  );
}
