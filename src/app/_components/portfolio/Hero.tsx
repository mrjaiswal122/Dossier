'use client';
import { useEffect } from "react";
import axios from "axios";
import { useAppSelector,useAppDispatch } from "@/app/_store/hooks";
import { updatePortfolio } from "@/app/_features/portfolio/portfolioSlice";
import { usePathname } from "next/navigation";

export default function Hero() {
    const dispatch = useAppDispatch();
    const portfolio=useAppSelector((state)=>state.portfolioSlice)
    console.log(portfolio);
    
    const pathname=usePathname();
    useEffect(()=>{
       const fetch=async()=>{
          const response= await axios.get(`/api/fetch-portfolio?pathname=${pathname}`);
        //   console.log(response.data);
       dispatch(updatePortfolio(response.data))
       }
       fetch();
    },[])
  return (
    <section id="hero">
    
    {/* for the pc view */}
 <section className="flex csw  ">

  <div className="w-[50%] border h-96 " >
    
  </div>
  <div className="w-[50%] border h-96"></div>
 </section>



 {/* for the mobile view  */}
 <section>
   
 </section>
    </section>
  )
}

