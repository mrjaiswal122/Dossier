'use client '
import { useAppDispatch, useAppSelector } from '@/app/_store/hooks'
import React, { Dispatch,  useState } from 'react'
import SurePrompt from '../SurePrompt'
import { FiTrash } from 'react-icons/fi'
import { GoPencil } from 'react-icons/go'
import { Delete, deleteParticularObjectAsync } from '@/app/_features/portfolio/portfolioSlice'
import { IPortfolio } from '@/app/_models/portfolio'
import formatHeading from '@/app/_util/formatHeading'

type Props = {}

export default function Skills({}: Props) {
    const [showForm,setShowForm]=useState(false)
    const [updatingSkillIndex,setUpdatingSkillIndex]=useState<number|null>(null);
   const portfolio=useAppSelector((state)=>state.portfolioSlice)
   
   return (
    <section className='csw md:pt-[150px] text-whites pb-24' id='skillSection'>
      {/* checking if portfolio has any Skills  */}
      {portfolio.skills && portfolio.skills?.length>0?(<div>

      <h1 className=' text-xl md:text-2xl lg:text-4xl mb-6
       dark:text-theme text-black flex justify-between items-center '>Skills
         {portfolio.isOwner?<span className='text-xs  text-whites p-3 bg-gray-600 hover:bg-green-600  transition-all duration-200 ease-in-out rounded-xl hover:shadow-lg cursor-pointer' onClick={()=>setShowForm(true)}>Add Category</span>:null}
      </h1>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>

      {portfolio.skills.map((data,index)=>(
        <SkillCard key={index}  skillCategory={data} index={index} isOwner={portfolio.isOwner} setShowForm={setShowForm} setUpdatingSkillIndex={setUpdatingSkillIndex}/>
        
      ))
      
    }
    </div>
    </div>):(
        portfolio.isOwner ? (
          <section className='w-full border border-white bg-theme-dark dark:bg-theme-light text-black flex justify-center items-center rounded-lg  hover:shadow-xl hover:scale-105  cursor-pointer transition-all duration-300 ease-in-out'  onClick={()=>setShowForm(true)}>
            <h2 className='text-xl p-5'><span className='text-2xl'>+</span> Add Your Skills </h2>
          </section>
        ) : null
      )
  }
    {/* {showForm?
    
    <AddExperienceForm setShowForm={setShowForm} updatingSkillIndex={updatingSkillIndex} setUpdatingSkillIndex={setUpdatingSkillIndex}/>:null} */}
    </section>
  )
}
interface SkillCardProps {
      skillCategory:NonNullable<IPortfolio['skills']>[number],
      index:number,
      isOwner:boolean,
      setShowForm:Dispatch<React.SetStateAction<boolean>>,
      setUpdatingSkillIndex: Dispatch<React.SetStateAction<number | null>>
    
}

function SkillCard({ skillCategory, index, isOwner, setShowForm, setUpdatingSkillIndex }: SkillCardProps) {
    const dispatch = useAppDispatch();
    const [isOpen,setIsOpen]=useState(false);
    const portfolio = useAppSelector((state) => state.portfolioSlice);
    
   
    //fix this 
    const handleDelete = () => {
        dispatch(deleteParticularObjectAsync({ from: Delete.Skills, index, routeName: portfolio.routeName }));
    };
   



    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 relative z-0 group border-l border-theme" >
          
            <div className='text-2xl py-3 '>

                {skillCategory.category&&formatHeading(skillCategory.category)}
            </div>
            <div className='flex gap-3'>

             {skillCategory.skills?.map((data ,index)=>(
                 <div className='text-sx py-2 px-3 rounded-lg bg-gray-600' key={index}>
                   {data}
                </div>
             ))}
             </div>
             <div className='my-3'>{skillCategory.proficiency}</div>
            {isOwner && (
                <div className="absolute z-0 bottom-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        aria-label="Edit"
                        onClick={() => {
                            setUpdatingSkillIndex(index);
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

