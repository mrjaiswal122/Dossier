"use client";
import { ReactNode } from "react";
import { useAppDispatch, useAppSelector } from "../_store/hooks";
import Navbar from "./navbar";
import { SessionProvider } from "next-auth/react";
import Err from "./Err";
import { clearToastMsgRedux } from "../_features/toastMsg/toastMsgSlice";

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
        <div className="dark:bg-black bg-theme-light ">
          <nav className="fixed w-full  z-20 ">
            <Navbar />
          </nav>
          <div className="w-full h-16"></div>
           {/* To dispaly error and messages to user in a  centralised mannner */}
          <div className="csw">
            {toastMsg?.msg && (
              <Err
              msg={toastMsg.msg}
              handleClick={handleToastMsg}
              type={toastMsg.type}
              />
            )}
            </div>

          {children}
        </div>
      </SessionProvider>

      <footer className="w-full h-14 dark:bg-black bg-theme-light  dark:text-white  flex items-center justify-center text-xs border-t border-theme">
        @Copywrite Ankush jaiswal #2024{" "}
      </footer>
    </section>
  );
}
