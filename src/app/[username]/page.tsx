"use client";
import Hero from "../_components/portfolio/Hero";
import { useEffect, useState } from "react";
import axios from "axios";
import {  useAppDispatch, useAppSelector } from "@/app/_store/hooks";
import { updatePortfolio,updateIsOwner } from "@/app/_features/portfolio/portfolioSlice";
import { usePathname } from "next/navigation";
import LoadingScreen from "../_components/Loader";


export default function Portfolio() {
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useAppDispatch();
  const portfolio = useAppSelector((state) => state.portfolioSlice);

  const pathname = usePathname().trim().substring(1);

  useEffect(() => {
    const checkingOwner=async ()=>{
        const response= await axios.get(`/api/isOwner?pathname=${pathname}`);
        // const signedUrl=await getSignedURL()
        // console.log(signedUrl);
        
        if(response.data.isOwner==true){
          dispatch(updateIsOwner(true))
          
        } else{
          dispatch(updateIsOwner(false))
        }
    }
    const fetch = async () => {
      const response = await axios.get(
        `/api/fetch-portfolio?pathname=${pathname}`
      );
      //   console.log(response.data);
      dispatch(updatePortfolio(response.data));
      await setIsLoading(false);
    };
    fetch();
    checkingOwner();
  }, [dispatch,pathname]);
 
  

  if (isLoading) {
    return <LoadingScreen />;
  }
  return (
    <>

      <Hero />
    </>
  );
}
