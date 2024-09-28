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
  const [isOwner,setIsOwner]=useState(false);
  const dispatch = useAppDispatch();
  const portfolio = useAppSelector((state) => state.portfolioSlice);

  const pathname = usePathname().trim().substring(1);
  const checkingOwner=async ()=>{
      const response= await axios.get(`/api/isOwner?pathname=${pathname}`);

      if(response.data.isOwner==true){
        dispatch(updateIsOwner(true))
        console.log('it the owner');
        
      } else{
        dispatch(updateIsOwner(false))
      }
  }
  useEffect(() => {
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
  }, []);
 
  

  if (isLoading) {
    return <LoadingScreen />;
  }
  return (
    <>

      <Hero />
    </>
  );
}
