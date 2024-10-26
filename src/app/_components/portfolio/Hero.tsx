'use client';
import { useAppSelector } from "@/app/_store/hooks";
import Image from "next/image";
import { useState } from "react";
import { FaLinkedin, FaSquareGithub, FaSquareXTwitter } from "react-icons/fa6";
import { MdModeEditOutline, MdOutlineMailOutline } from "react-icons/md";
import UploadImage from "./UploadImage";
import Link from "next/link";
export default function Hero() {
    const portfolio = useAppSelector((state) => state.portfolioSlice);
    const [uploadingImage,setUploadingImage]=useState(false);
    const handleUploadImageForm=()=>{
      setUploadingImage(!uploadingImage);
    }
  return (
  
<section id="hero" className="relative ">
    {/* for the pc view */}
    <section className=" csw mt-4 flex flex-col-reverse md:flex-row dark:text-whites">
  
        <aside className="md:w-[50%] h-96  lg:h-[32rem] md:pt-[15%] pl-6" >


            {/* name */}
            <h1 className="text-3xl mb-3 ">
             {portfolio.personalInfo.fullName.trim().toLocaleUpperCase()}
            </h1>

            {/* job title */}
            <h2 className="mb-3">
                {portfolio.personalInfo.title.toLocaleUpperCase()}
            </h2>

             {/* bio */}
            <p className="text-sm text-grays mb-3">{portfolio.summary?.aboutMe?.toWellFormed()}</p>

            {/* email */}
            <span className="flex gap-3 justify-start items-center"><MdOutlineMailOutline /> {portfolio.personalInfo.email}</span>

            {/* social links */}
            <div className="flex gap-3 mt-3  "> 
             {portfolio.personalInfo.socialLinks?.github && <Link className="scale-125 dark:hover:text-theme-light hover:text-theme-dark hover:scale-105 transition-all duration-300 ease-in-out" href={portfolio.personalInfo.socialLinks?.github}><FaSquareGithub /></Link>}
             {portfolio.personalInfo.socialLinks?.twitter && <Link className="scale-125 dark:hover:text-theme-light hover:text-theme-dark hover:scale-105 transition-all duration-300 ease-in-out" href={portfolio.personalInfo.socialLinks?.twitter}><FaSquareXTwitter /></Link>}
              {portfolio.personalInfo.socialLinks?.linkedIn &&<Link className="scale-125 dark:hover:text-theme-light hover:text-theme-dark hover:scale-105 transition-all duration-300 ease-in-out" href={portfolio.personalInfo.socialLinks?.linkedIn}><FaLinkedin /></Link> }
            </div>


            </aside>
        <aside className="relative md:w-[50%]  h-96  lg:h-[32rem] overflow-hidden flex justify-center items-center">
          <div className=" w-[300px] h-[300px] md:w-[350px] md:h-[350px] lg:w-[450px] lg:h-[450px] rounded-full overflow-hidden ">

           <Image
           alt="User Image"
           src={`${portfolio.personalInfo.profilePicture?portfolio.personalInfo.profilePicture:'/profile1.webp'}`}
           width={600}
           height={600}
           className="object-fill"
           priority={true}
          
           >
            
           </Image>
           {portfolio.isOwner &&

             <span className={`${portfolio.isOwner?'':'hidden'}absolute top-[12%] right-[22%] border border-black rounded-full scale-150 bg-gray-600 shadow-2xl`}
             onClick={handleUploadImageForm} >
            <MdModeEditOutline className="m-2 text-black bg-gray-600" />
              </span>
          }
          </div>
            </aside>
    </section>



 {/* for the mobile view  */}
    <section className="">
   
    </section>
    {uploadingImage && 
     <UploadImage setUploadingImage={setUploadingImage}/>
    }
</section>
  )
}

