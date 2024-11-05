"use client";
import Hero from "../_components/portfolio/Hero";
import { useEffect } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/app/_store/hooks";
import { updatePortfolio, updateIsOwner, PortfolioStatus, updateStatus } from "@/app/_features/portfolio/portfolioSlice";
import { usePathname } from "next/navigation";
import LoadingScreen from "../_components/Loader";
import Projects from "../_components/portfolio/Projects";
import WorkExperience from "../_components/portfolio/Experience";
import Err from "../_components/Err";
import { clearToastMsgRedux } from "../_features/toastMsg/toastMsgSlice";

export default function Portfolio() {
  const dispatch = useAppDispatch();
  const portfolio = useAppSelector((state) => state.portfolioSlice);
  const toastMsg = useAppSelector((state) => state.toastMsgSlice);
  const pathname = usePathname().trim().substring(1);

  useEffect(() => {
    dispatch(updateStatus(PortfolioStatus.Pending));

    const fetchPortfolioData = async () => {
      try {
        // Fetch both owner and portfolio data in parallel
        const [ownerResponse, portfolioResponse] = await Promise.all([
          axios.get<{ isOwner: boolean }>(`/api/isOwner?pathname=${pathname}`),
          axios.get(`/api/fetch-portfolio?pathname=${pathname}`),
        ]);

        // Check if user is the owner
        dispatch(updateIsOwner(ownerResponse.data.isOwner));

        // Update portfolio data
        dispatch(updatePortfolio(portfolioResponse.data));

        dispatch(updateStatus(PortfolioStatus.Ideal));
      } catch (error) {
        console.error("Error fetching portfolio or owner data:", error);
        dispatch(updateStatus(PortfolioStatus.Failed));
      }
    };

    fetchPortfolioData();

    // Optional cleanup to clear toast messages on component unmount
    return () => {
      dispatch(clearToastMsgRedux());
    };
  }, [dispatch, pathname]);

  // Conditional rendering based on portfolio status
  if (portfolio.status === PortfolioStatus.Pending) {
    return <LoadingScreen />;
  }

  if (portfolio.status === PortfolioStatus.Failed) {
    return (
      <div className="h-screen w-screen flex justify-center items-center bg-theme-light dark:bg-black text-red-600 text-2xl font-bold">
        Error loading portfolio. Please try again later.
      </div>
    );
  }

  const handleToastMsg = () => {
    dispatch(clearToastMsgRedux());
  };

  return (
    <div className="csw">
      {toastMsg?.msg && (
        <Err msg={toastMsg.msg} handleClick={handleToastMsg} type={toastMsg.type} />
      )}
      <Hero />
      <Projects />
      <WorkExperience />
    </div>
  );
}
