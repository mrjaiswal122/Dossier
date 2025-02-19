"use client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect, useState } from "react";
import {
  Portfolio,
  updatePortfolio,
} from "@/features/portfolio/portfolioSlice";
import Hero from "./Hero";
import Skills from "./Skills";
import Projects from "./Projects";
import WorkExperience from "./Experience";
import axios from "axios";

export default function ClientWrapper({initialData}:{initialData:Portfolio} ) {
  const dispatch = useAppDispatch();
  const ReduxPortfolio = useAppSelector((state) => state.portfolioSlice);
  const [portfolio, setPortfolio] = useState(initialData);
  const pathname=initialData.routeName;
  const [isOwner,setIsOwner]=useState(false)
  useEffect(() => {
    const fetch=async()=>{
     try {
         const response =await axios.get("api/isOwner",{
             params: { pathname }, // Search parameters
         })
        if(response.data.isOwner){
         dispatch(updatePortfolio({...initialData,isOwner:true}));
         setIsOwner(true)
        }
        else
         dispatch(updatePortfolio(initialData));
     } catch (error) {
         dispatch(updatePortfolio(initialData));
     }
       
    }
   fetch();
  }, []);

  useEffect(() => {
    if (ReduxPortfolio.personalInfo.fullName != "") {
      setPortfolio(ReduxPortfolio);
    }
  }, [ReduxPortfolio]);
  return <>
   <Hero
        portfolio={portfolio}
        />
  
      {/* Render Skills/Projects/Experience only if portfolio exists */}
      {portfolio && (
        <>
          {(isOwner || (portfolio.skills && portfolio.skills.length > 0)) && (
            <Skills portfolio={portfolio} />
          )}
          {(isOwner ||
            (portfolio.projects && portfolio.projects.length > 0)) && (
            <Projects portfolio={portfolio}/>
          )}
          {(isOwner ||
            (portfolio.experience && portfolio.experience.length > 0)) && (
            <WorkExperience portfolio={portfolio} />
          )}
        </>
      )}
  </>;
}
