import React, { Dispatch, SetStateAction, useState } from 'react'
import { TiDeleteOutline } from 'react-icons/ti'
import Image from "next/image";
import { useAppDispatch, useAppSelector } from '@/app/_store/hooks';
import { MdDelete } from 'react-icons/md';
import { uploadImageAsync,deleteImageAsync } from '@/app/_features/portfolio/portfolioSlice';
import { IoCloudUploadOutline } from 'react-icons/io5';


type props={
    setUploadingImage:Dispatch<SetStateAction<boolean>>
}


function UploadImage({setUploadingImage}:props) {
    const portfolio=useAppSelector(state=>state.portfolioSlice)
    const dispatch = useAppDispatch();
    const [image,setImage]=useState<File>();
    const [imageUrl,setImageUrl]=useState(portfolio.personalInfo.profilePicture)
    const handleClick=(e:React.MouseEvent<HTMLElement, MouseEvent>)=>{
        const section=e.target as HTMLBodyElement
        if(section.id=='uploadImage')setUploadingImage(false);
        else return;
     
    }
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; 
        if (file) {
            setImage(file);
            setImageUrl(URL.createObjectURL(file))
        };
    };
    const handleUpload=async()=>{
        if(image){
            const uniqueKey = portfolio.routeName+'_'+(Date.now()+'_'+(image.name));
            await dispatch(uploadImageAsync({portfolioId:portfolio._id.toString(),image,key:uniqueKey,oldUrl:portfolio.personalInfo.profilePicture}));
            await setUploadingImage(false);
        };
       
     };
    const handleDelete=async()=>{
        if(portfolio.personalInfo.profilePicture)
        await dispatch(deleteImageAsync(portfolio.personalInfo.profilePicture));
        await setUploadingImage(false);
         
    };
  return (
    <section className='fixed w-full h-full top-0 left-0  dark:bg-black dark:bg-opacity-90 bg-theme-light bg-opacity-65' onClick={handleClick} id='uploadImage'>

        <section className='fixed top-[50%] left-[50%] w-[80vw] md:w-[60vw] lg: border  translate-x-[-50%] translate-y-[-50%] bg-theme-dark dark:bg-black rounded-lg flex flex-col justify-between '>
            <div className='flex justify-between items-center ml-3 text-lg md:text-2xl  dark:text-theme'>
             Profile Picture
             <span  onClick={()=>setUploadingImage(false)}>

            <TiDeleteOutline className=' scale-150 dark:text-white m-5 cursor-pointer'/>
             </span>
            </div>
            <div className='flex justify-center items-center mx-3 my-6  '>
                  <div className=" w-[125px] h-[125px] md:w-[175px] md:h-[175px] lg:w-[225px] lg:h-[225px] rounded-full overflow-hidden">

                <Image
           alt="User Image"
           src={`${imageUrl?imageUrl:'/profile1.webp'}`}
           width={300}
           height={300}
           priority={true}
       
           className="object-fill"
           >
                
            </Image>
               </div>
            </div>
            <div className='mb-5 mx-3 text-sm' >
    
            {/* delete button */}
                <button className='bg-reds flex justify-center items-center gap-2 p-2 rounded-lg float-left ' onClick={handleDelete}>
                    <MdDelete className='scale-125' /> Delete
                </button>
            {/* add new button */}
                <div className='float-right flex gap-3 items-center'>
                     <span className='dark:text-white text-xs'> 
                        {
                            image&& (image.name)
                        }
                        </span>
                        {image?
                        <button onClick={handleUpload} className='bg-greens flex justify-center items-center gap-2 p-2 rounded-lg  cursor-pointer'>
                            <IoCloudUploadOutline/> Upload
                        </button>:

                            <label className='bg-greens flex justify-center items-center gap-2 p-2 rounded-lg  cursor-pointer'>
                        <span className='scale-125 flex items-center justify-center'>
                           +
                        </span>
                       Add new
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden" // Hides the actual file input
                            />
                    </label>
                        }
                </div>
            </div>
        </section> 
         
    </section> 
  )
}

export default UploadImage