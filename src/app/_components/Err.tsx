'use client';

import { IoMdCloseCircle } from "react-icons/io";
import { useEffect, useRef } from "react";

export default function Err({msg,handleClick,type='error'}:{msg:string;handleClick:()=>void,type?:'error'|'msg'}) {
 const timerRef = useRef<number | undefined>(undefined);

 //for re-rendering the animation
 const animationKey=useRef(0);
 
  useEffect(()=>{
    animationKey.current +=1;
   timerRef.current=window.setTimeout(()=>{
    handleClick();
  },4000)
  return () => clearTimeout(timerRef.current);
    
  },[msg,handleClick])

  const handleClose=()=>{
    clearTimeout(timerRef.current);
    handleClick();
    console.log('deleted msg from handleClose');
  }
  return (
  <>
  
  <div className=" fixed left-1/2 transform -translate-x-1/2 top-16 mx-auto w-[95%]  sm:max-w-[540px] md:max-w-[740px] lg:max-w-[960px] xl:max-w-[1160px] z-50 mr-3" role="alert">
  {
      <div key={animationKey.current} className={`relative h-10 flex items-center border border-solid rounded-sm justify-between px-3 text-nowrap ${type=='msg'?'border-green-600 bg-green-900 text-green-200':'border-[#711f28] bg-[#2d0a0e] text-red-600'} `}>
        {msg} 
       <div className={`absolute bottom-0 left-0 h-[2px]  w-full animate-timedMsg ${type=='msg'?'bg-green-600':'bg-red-600'} `}></div>
        <span className="text-lg " onClick={handleClose}>
        <IoMdCloseCircle />
        </span> 
      </div>
  }
    </div>
  </>
  )
}

