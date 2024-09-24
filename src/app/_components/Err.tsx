'use client';

import { IoMdCloseCircle } from "react-icons/io";


export default function Err({msg,handleClick}:{msg:string;handleClick:()=>void}) {
  setTimeout(()=>{
    handleClick();
  },4000)
  
  return (
  <>
  
  <div className="absolute top-0 csw">
      <div className=" relative h-10 flex items-center border border-solid border-[#711f28] rounded-sm justify-between  bg-[#2d0a0e] px-3 text-red-600">
        {msg} 
       <div className="absolute bottom-0 left-0 h-[2px] bg-red-600 w-full animate-timedMsg"></div>
        <span className="text-lg " onClick={handleClick}>
        <IoMdCloseCircle />
        </span> 
      </div>
    </div>
  </>
  )
}

