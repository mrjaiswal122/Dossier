'use client';

import { IoMdCloseCircle } from "react-icons/io";


export default function Err({msg,handleClick,type='error'}:{msg:string;handleClick:()=>void,type?:'error'|'msg'}) {
  console.log(' I am in Err');
  
  const timer=setTimeout(()=>{
    handleClick();
    console.log('deleted msg from ERR');
    
  },4000)
  const handleClose=()=>{
    clearTimeout(timer);
    handleClick();
    console.log('deleted msg from handleClose');
  }
  return (
  <>
  
  <div className="fixed top-16 mx-auto w-[95%]  sm:max-w-[540px] md:max-w-[740px] lg:max-w-[960px] xl:max-w-[1160px] z-50 mr-3" role="alert">
      <div className={`relative h-10 flex items-center border border-solid rounded-sm justify-between px-3 text-nowrap ${type=='msg'?'border-green-600 bg-green-900 text-green-200':'border-[#711f28] bg-[#2d0a0e] text-red-600'} `}>
        {msg} 
       <div className={`absolute bottom-0 left-0 h-[2px]  w-full animate-timedMsg ${type=='msg'?'bg-green-600':'bg-red-600'} `}></div>
        <span className="text-lg " onClick={handleClose}>
        <IoMdCloseCircle />
        </span> 
      </div>
    </div>
  </>
  )
}

