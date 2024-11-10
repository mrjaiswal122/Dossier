'use client';
import { useAppDispatch, useAppSelector } from "@/app/_store/hooks";
import Image from "next/image";
import { useState } from "react";
import { FaLinkedin, FaSquareGithub, FaSquareXTwitter } from "react-icons/fa6";
import { MdModeEditOutline, MdOutlineMailOutline, MdOutlinePhone } from "react-icons/md";
import UploadImage from "./UploadImage";
import Link from "next/link";
import { IoLocationSharp } from "react-icons/io5";
import { BsCopy } from "react-icons/bs";
import { clearToastMsgRedux, setToastMsgRedux } from "@/app/_features/toastMsg/toastMsgSlice";
import UpdateProfile from "./UpdateProfile";
export default function Hero() {
    const portfolio = useAppSelector((state) => state.portfolioSlice);
    const toastMsg = useAppSelector((state) => state.toastMsgSlice); // Access toast message state
      const handleToastMsg = () => {
      dispatch(clearToastMsgRedux());
    };

    const dispatch = useAppDispatch();
    const [updatingProfile,setUpdatingProfile]=useState(false)
    const [uploadingImage,setUploadingImage]=useState(false);
    const [isEmailCopied,setIsEmailCopied]=useState(false);
    const [isPhoneCopied, setIsPhoneCopied]=useState(false);
    const handleUploadImageForm=()=>{
      setUploadingImage(!uploadingImage);
    }

    const handleUpdateProfile=()=>{
      setUpdatingProfile(true)
    }

    const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(portfolio.personalInfo.email);
      setIsEmailCopied(true)
      
      
      dispatch(setToastMsgRedux({msg:'Email Copied To Clipboard',type:'msg'}))
     
      
    } catch (error) {
      console.error("Failed to copy text: ", error);
    }
  };
  const copyPhone = async () => {
    try {
      await navigator.clipboard.writeText(portfolio.personalInfo?.phone!);
      setIsPhoneCopied(true)
      dispatch(setToastMsgRedux({msg:'Phone Number Copied To Clipboard',type:'msg'}))
    } catch (error) {
      console.error("Failed to copy text: ", error);
    }
  };
  return (
  
<section id="hero" className="relative ">
     
    {/* for the pc view */}
    <section className=" csw  flex flex-col-reverse md:flex-row dark:text-whites">
  
        <aside className="md:w-[50%] h-96  lg:h-[32rem] md:pt-[15%] pl-6 md:pl-0" >


            {/* name */}
            <h1 className="text-3xl mb-3 ">
             {portfolio.personalInfo.fullName.trim().toLocaleUpperCase()}
            </h1>

            {/* job title */}
            <h2 className="mb-3">
                {portfolio.personalInfo.title.toLocaleUpperCase()}
            </h2>

             {/* bio */}
            <p className="text-sm text-grays mb-3">{portfolio.summary?.aboutMe}</p>

            {/* email */}
            <span className="flex gap-3 justify-start items-center" ><MdOutlineMailOutline /> {portfolio.personalInfo.email} <BsCopy onClick={copyEmail} className={`${isEmailCopied?'text-greens':''}`} />
            </span>
            {/* phone */}
            {portfolio.personalInfo.phone &&<span className="flex gap-3 justify-start items-center" ><MdOutlinePhone /> {portfolio.personalInfo.phone}<BsCopy onClick={copyPhone} className={`${isPhoneCopied?'text-greens':''}`} />
            </span>}
            {/* location */}
            <span className="flex gap-3 justify-start items-center"><IoLocationSharp /> {portfolio.personalInfo.location}</span>
            {/* social links */}
            <div className="flex gap-3 mt-3  "> 
             {portfolio.personalInfo.socialLinks?.github && <Link className="scale-125 dark:hover:text-theme-light hover:text-theme-dark hover:scale-105 transition-all duration-300 ease-in-out" href={portfolio.personalInfo.socialLinks?.github}><FaSquareGithub /></Link>}
             {portfolio.personalInfo.socialLinks?.twitter && <Link className="scale-125 dark:hover:text-theme-light hover:text-theme-dark hover:scale-105 transition-all duration-300 ease-in-out" href={portfolio.personalInfo.socialLinks?.twitter}><FaSquareXTwitter /></Link>}
              {portfolio.personalInfo.socialLinks?.linkedIn &&<Link className="scale-125 dark:hover:text-theme-light hover:text-theme-dark hover:scale-105 transition-all duration-300 ease-in-out" href={portfolio.personalInfo.socialLinks?.linkedIn}><FaLinkedin /></Link> }
            </div>
             {/* edit button */}
             {portfolio.isOwner && 
             <button className=" mt-6 py-2 sm:w-[50%] w-full mr-2  rounded-lg border border-grays inline-block hover:text-white  hover:bg-gray-600 transition-all duration-300 ease-in-out" onClick={()=>handleUpdateProfile()}>Edit Profile</button>}

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

             <span className={`${portfolio.isOwner?'':'hidden'}absolute top-[12%] right-[22%] border border-grays rounded-full scale-150 hover:bg-gray-600 shadow-2xl group cursor-pointer`}
             onClick={handleUploadImageForm} >
            <MdModeEditOutline className="m-2 text-black dark:text-whites group-hover:bg-gray-600" />
              </span>
          }
          </div>
            </aside>
    </section>



 
    {uploadingImage && 
     <UploadImage setUploadingImage={setUploadingImage}/>
    }
    {updatingProfile && (
      <UpdateProfile  setUpdatingProfile={setUpdatingProfile}/>
    )}
</section>
  )
}

