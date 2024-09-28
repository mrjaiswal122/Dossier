'use client';
import { useAppSelector } from "@/app/_store/hooks";
import Image from "next/image";
import { FaLinkedin, FaSquareGithub, FaSquareXTwitter } from "react-icons/fa6";
import { MdOutlineMailOutline } from "react-icons/md";
export default function Hero() {
    const portfolio = useAppSelector((state) => state.portfolioSlice);
  return (
  
<section id="hero" >
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
             {portfolio.personalInfo.socialLinks?.github && <a className="scale-125 dark:hover:text-theme-light hover:text-theme-dark hover:scale-105 transition-all duration-300 ease-in-out" href={portfolio.personalInfo.socialLinks?.github}><FaSquareGithub /></a>}
             {portfolio.personalInfo.socialLinks?.twitter && <a className="scale-125 dark:hover:text-theme-light hover:text-theme-dark hover:scale-105 transition-all duration-300 ease-in-out" href={portfolio.personalInfo.socialLinks?.twitter}><FaSquareXTwitter /></a>}
              {portfolio.personalInfo.socialLinks?.linkedIn &&<a className="scale-125 dark:hover:text-theme-light hover:text-theme-dark hover:scale-105 transition-all duration-300 ease-in-out" href={portfolio.personalInfo.socialLinks?.linkedIn}><FaLinkedin /></a> }
            </div>


            </aside>
        <aside className="md:w-[50%]  h-96  lg:h-[32rem] overflow-hidden flex justify-center items-center">
          <div className="w-[300px] h-[300px] md:w-[350px] md:h-[350px] lg:w-[450px] lg:h-[450px] rounded-full overflow-hidden">

           <Image
           alt="User Image"
           src={`/sq.jpg`}
           width={600}
           height={600}
           className="object-fill"
           >
            
           </Image>
          </div>
            </aside>
    </section>



 {/* for the mobile view  */}
    <section className="">
   
    </section>
</section>
  )
}

