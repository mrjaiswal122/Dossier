"use client"

import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { TiDeleteOutline } from 'react-icons/ti'
import { GoPencil } from 'react-icons/go'
import { FiTrash } from 'react-icons/fi'
import { Delete, deleteParticularObjectAsync, Portfolio, updateExperienceAsync } from '@/features/portfolio/portfolioSlice'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6'
import SurePrompt from '../SurePrompt'


// Zod schema for experience
const experienceSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required"),
  companyName: z.string().min(1, "Company name is required"),
  companyLogo: z.string().url().optional().or(z.literal('')),
  location: z.string().optional().or(z.literal('')),
  startDate: z.string().min(1, "Start date is required"), 
  endDate: z.string().optional().or(z.literal('')),
  responsibilities: z.string().optional().or(z.literal('')),
})

export type Experience = z.infer<typeof experienceSchema>

interface Props {
 portfolio:Portfolio
}

export default function WorkExperience({portfolio}:Props) {
  const [showForm,setShowForm]=useState(false)
  const [updatingExperienceIndex,setUpdatingExperienceIndex]=useState<number|null>(null);
  
  // const portfolio = useAppSelector((state) => state.portfolioSlice);
  

  

 return (
    <section className='csw md:pt-[150px] text-whites pb-24' id='experienceSection'>
      {/* checking if portfolio has any Experience  */}
      {portfolio.experience && portfolio.experience?.length>0?(<div>

      <h1 className=' text-xl md:text-2xl lg:text-4xl mb-6
       dark:text-theme text-black flex justify-between items-center '>Experience
         {portfolio.isOwner?<span className='text-xs  text-whites p-3 bg-gray-600 hover:bg-green-600  transition-all duration-200 ease-in-out rounded-xl hover:shadow-lg cursor-pointer' onClick={()=>setShowForm(true)}>Add Experience</span>:null}
      </h1>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>

      {portfolio.experience.map((data,index)=>(
        <ExperienceCard key={index} portfolio={portfolio} experience={data} index={index} isOwner={portfolio.isOwner} setShowForm={setShowForm} setUpdatingExperienceIndex={setUpdatingExperienceIndex}/>
        
      ))
      
    }
    </div>
    </div>):(
        portfolio.isOwner ? (
          <section className='w-full border border-white bg-theme-dark dark:bg-theme-light text-black flex justify-center items-center rounded-lg  hover:shadow-xl hover:scale-105  cursor-pointer transition-all duration-300 ease-in-out'  onClick={()=>setShowForm(true)}>
            <h2 className='text-xl p-5'><span className='text-2xl'>+</span> Add your first experience</h2>
          </section>
        ) : null
      )
  }
    {showForm?
    
    <AddExperienceForm setShowForm={setShowForm} updatingExperienceIndex={updatingExperienceIndex} setUpdatingExperienceIndex={setUpdatingExperienceIndex}/>:null}
    </section>
  )
}

interface AddExperienceFormProps {
  updatingExperienceIndex: number | null;
  setUpdatingExperienceIndex:
  Dispatch<SetStateAction<number | null>>;
  setShowForm: Dispatch<SetStateAction<boolean>>;
}

function AddExperienceForm({setShowForm,updatingExperienceIndex,setUpdatingExperienceIndex }: AddExperienceFormProps) {
    const dispatch=useAppDispatch();
  const portfolio=useAppSelector((state)=>state.portfolioSlice);
  const startDateRef=useRef<HTMLInputElement | null>(null);
  const endDateRef=useRef<HTMLInputElement | null>(null);
   const getDefaultValues = () => {
    if (updatingExperienceIndex !== null && portfolio.experience) {
      return portfolio.experience[updatingExperienceIndex] ||{
    jobTitle: '',
    companyName: '',
    companyLogo: '',
    location: '',
    startDate: '',
    endDate: '',
    responsibilities: ''
  };
    }
    return {
    jobTitle: '',
    companyName: '',
    companyLogo: '',
    location: '',
    startDate: '',
    endDate: '',
    responsibilities: ''
  };
  };
  const {register,handleSubmit,setValue, formState: { errors },} = useForm<Experience>({
    resolver: zodResolver(experienceSchema),
    mode: 'onChange',
    defaultValues:getDefaultValues(),
  });

  const handleFormClick = (e: React.MouseEvent<HTMLElement>) => {
    const section = e.target as HTMLElement;
    if (section.id === 'addExperince'){

      setShowForm(false);
      setUpdatingExperienceIndex(null)
    } 
  };
  const handleDatePickerChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: 'startDate' | 'endDate'
  ) => {
    const value = e.target.value;
    setValue(fieldName, value, { shouldValidate: true });
  };
    const onSubmit =async (data: Experience) => {
            const index = updatingExperienceIndex ?? (portfolio.experience?.length || 0);
            console.log("Form Data:", data);
            await dispatch(updateExperienceAsync({data,routeName:portfolio.routeName,index}))

          setShowForm(false); 
          setUpdatingExperienceIndex(null)}; 
  return (
     <section
      className='fixed w-full h-full top-0 left-0 dark:bg-black dark:bg-opacity-90 bg-white text-black '
      id='addExperince'
      onClick={handleFormClick}
    >
      <section className='fixed top-[80px] left-[50%] csw max-h-[80vh] overflow-y-auto border translate-x-[-50%]   dark:bg-black rounded-lg flex flex-col justify-between dark:text-whites shadow-lg shadow-gray-500 border-gray-500'>
          {/* Head of the form */}
          <div className=' sticky top-0  w-full flex justify-between items-center px-4 py-2 text-lg md:text-xl dark:text-theme bg-white dark:bg-black border-b border-gray-500 '>
          {updatingExperienceIndex!=null?'Edit Experience':'Add Experience'}
          <span onClick={() => {setShowForm(false);setUpdatingExperienceIndex(null)}}>
            <TiDeleteOutline className='scale-150 dark:text-white cursor-pointer hover:text-reds' />
          </span>
        </div>
        {/* Form */}
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      <div>
        <label htmlFor="jobTitle" className="block text-sm ">Job Title
            <input 
              {...register('jobTitle')} 
              id="jobTitle"
              type="text" 
              className="w-full p-2 border rounded" 
              />
        
        </label>
      
        {errors.jobTitle && <p className="mt-1 text-sm text-red-600">{errors.jobTitle.message}</p>}
      </div>

      <div>
        <label htmlFor="companyName" className="block text-sm ">Company Name</label>
      
            <input 
              {...register('companyName')} 
              id="companyName"
              type="text" 
              className="w-full p-2 border rounded" 
            />
      
        {errors.companyName && <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>}
      </div>
      <div>
        <label htmlFor="location" className="block text-sm ">Location (optional)</label>
        
            <input 
              {...register('location')} 
              id="location"
              type="text" 
              className="w-full p-2 border rounded" 
            />
       
      </div>

      <div>
        <label htmlFor="startDate" className="inline text-sm ">Start Date
          </label>
            <input 
              {...register('startDate')} 
              ref={startDateRef}
              id="startDate"
              type="date" 
              onChange={(e)=>handleDatePickerChange(e,'startDate')}
              onClick={()=>startDateRef.current?.showPicker()}
              className="w-full p-2 border rounded" 
              />
        {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>}
      </div>

      <div>
        <label htmlFor="endDate" className="inline text-sm ">End Date (optional)
          </label>
            <input 
              {...register('endDate')} 
              id="endDate"
              ref={endDateRef}
              type="date"
              onChange={(e)=>handleDatePickerChange(e,'endDate')}
              onClick={()=>endDateRef.current?.showPicker()}
              className="w-full p-2 border rounded" 
              />     
      </div>

      <div>
        <label htmlFor="responsibilities" className="block text-sm ">Responsibilities (optional)</label>
        
            <textarea 
              {...register('responsibilities')} 
              id="responsibilities"
              rows={3} 
              className="w-full p-2 border rounded" 
            />
      
      </div>
     {/* buttons */}
      <div className="flex justify-end space-x-2">
        <button 
          type="button" 
          onClick={()=>setShowForm(false)} 
          className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Add Experience
        </button>
      </div>
    </form>
     </section>
    </section>
  )
}

interface ExperienceCardProps {
      experience:Experience,
      index:number,
      portfolio:Portfolio,
      isOwner:boolean,
      setShowForm:Dispatch<React.SetStateAction<boolean>>,
      setUpdatingExperienceIndex: Dispatch<React.SetStateAction<number | null>>
    
}


function ExperienceCard({ experience, index, isOwner, setShowForm, setUpdatingExperienceIndex ,portfolio}: ExperienceCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const dispatch = useAppDispatch();
    const [descHeight,setDescHeight]=useState(0);
    const [isOpen,setIsOpen]=useState(false);
    // const portfolio = useAppSelector((state) => state.portfolioSlice);
    const descriptionRef = useRef<HTMLDivElement>(null);
    
    const formatDate = (dateStr: string | undefined) => {
        if (!dateStr) return 'Present';
        return new Date(dateStr).toLocaleDateString('default', { month: 'short', year: 'numeric' });
    };

    const handleDelete = () => {
        dispatch(deleteParticularObjectAsync({ from: Delete.WorkExperience, index, routeName: portfolio.routeName }));
    };
    useEffect(()=>{
    if(descriptionRef.current){
      setDescHeight(descriptionRef.current.scrollHeight)
    }
  },[])
    const toggleDescription = () => {
        setIsExpanded((prev) => !prev);
    };

    return (
        <div className="bg-grays bg-opacity-15 dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 relative  group border-l border-theme" >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:opacity-60 transition-opacity duration-300">{experience.jobTitle}</h3>
                    <p className="text-gray-600 dark:text-gray-300 group-hover:opacity-60 transition-opacity duration-300">{experience.companyName}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400 group-hover:opacity-60 transition-opacity duration-300">
                        {formatDate(experience.startDate)} - {formatDate(experience.endDate)}
                    </p>
                    {experience.location && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 group-hover:opacity-60 transition-opacity duration-300">{experience.location}</p>
                    )}
                </div>
            </div>
            {experience.responsibilities && (
                <div className={`relative ${isExpanded ? '' : 'h-12 overflow-hidden'}`}>
                    <p ref={descriptionRef} className="text-black mb-2 text-sm leading-relaxed dark:text-grays">{experience.responsibilities}</p>
                    {descHeight > 46 && !isExpanded && (
                        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[#ffffff] dark:from-[#1f2937] to-transparent"></div>
                    )}
                </div>
            )}
            {descHeight > 46 && (
                <button
                    onClick={toggleDescription}
                    className="text-blue-muted hover:text-blue-800 mt-1 focus:outline-none flex items-center text-xs font-medium"
                    aria-expanded={isExpanded}
                >
                    {isExpanded ? 'Show Less' : 'Show More'}
                    {isExpanded ? <FaChevronUp className="ml-1 h-3 w-3" /> : <FaChevronDown className="ml-1 h-3 w-3" />}
                </button>
            )}
            {isOwner && (
                <div className="absolute z-0 bottom-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        aria-label="Edit"
                        onClick={() => {
                            setUpdatingExperienceIndex(index);
                            setShowForm(true);
                        }}
                    >
                        <GoPencil size={16} />
                    </button>
                    <button
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                        aria-label="Delete"
                        onClick={()=>{setIsOpen(true)}}
                    >
                        <FiTrash size={16} />
                    </button>
                </div>
            )}
            {isOpen&& <SurePrompt msg='Are you sure, you want to delete?' action={handleDelete} setIsOpen={setIsOpen}/>}
        </div>
    );
}