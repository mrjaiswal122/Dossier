'use client'
import React, { Dispatch, SetStateAction, useState,useRef } from 'react'
import { CgClose } from 'react-icons/cg';

type Props = {
    msg:string,
    setIsOpen:Dispatch<SetStateAction<boolean>>,
    action:()=>void
}

function SurePrompt({msg,action,setIsOpen}: Props) {


    const handleClose= (e: React.MouseEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).id === "popUp") setIsOpen(false);
  };
  return (<>
 <section  className='fixed w-screen h-screen top-0 left-0 bg-black bg-opacity-95 text-white z-20' id='popUp' onClick={handleClose}>


 <div className='sticky z-[21] top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] border border-grays w-80 px-6 py-3 rounded-lg text-whites bg-black'>
       {/* <div>Are you sure?</div> */}
       <div className='flex justify-between items-center text-sm '>
        {msg}
       <CgClose className='hover:text-reds cursor-pointer' onClick={()=>setIsOpen(false)}/>
        </div>
       <div className='flex justify-between mt-6 text-sm'>
        <button className='py-2 px-6 rounded-lg bg-reds hover:bg-red-700' onClick={action}>
         Yes
        </button>
        <button className='py-2 px-7 rounded-lg bg-grays hover:bg-gray-600' onClick={()=>setIsOpen(false)}>
           No
        </button>
       </div>
    </div>
     </section>
  </>
  )
}

export default SurePrompt