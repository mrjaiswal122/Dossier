'use client';
import React, { useRef } from 'react'
import { RiDeleteBin6Line  } from "react-icons/ri";
import { Control, FieldErrors, useFieldArray, UseFormClearErrors, UseFormRegister, UseFormSetError, UseFormSetValue, UseFormWatch, } from 'react-hook-form'
import { FormData } from '@/app/create-portfolio/page'
type props={
control:Control<FormData>,
register:UseFormRegister<FormData>,
errors:FieldErrors<FormData>,
prevStep:()=>void,
nextStep:()=>void,
watch:UseFormWatch<FormData>,
setValue:UseFormSetValue<FormData>,
setError:UseFormSetError<FormData>,
clearErrors:UseFormClearErrors<FormData>

}
export default function Skills({control,register,errors,prevStep,nextStep,watch,setValue,setError,clearErrors}
    :props) {
        const {fields:skillFields,remove:removeSkill,append:appendSkill}=useFieldArray({
            control,
           name:'skills'
        })

        const skillInputRefs = useRef<HTMLInputElement[]>([]);

        const addSkill = (index: number) => {
          const input = skillInputRefs.current[index];
          if (!input) return;

          const skill = input.value.trim();
    
          if (skill) {
            const currentSkills = watch(`skills.${index}.skills`);
            if (currentSkills.includes(skill)) {
              setError(`skills.${index}.skills`, {
                type: "custom",
                message: "Skill already exists",
              });
              return;
            }
            setValue(`skills.${index}.skills`, [...currentSkills, skill]);
            input.value = "";
            clearErrors(`skills.${index}.skills`);
            return;
          }

          setError(`skills.${index}.skills`, {
            type: "custom",
            message: "Skill can't be empty",
          });
        };

        const handleSkill = (
            event: React.KeyboardEvent<HTMLInputElement>,
            index: number
          ) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addSkill(index);
            }
          };

          const handleSkillClick = (
            e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
            index: number
          ) => {
            e.preventDefault();
            addSkill(index);
          };

          const deleteSkill = (
            e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
            index: number,
            skilled: string
          ) => {
            const skills = watch(`skills.${index}.skills`);
            setValue(
              `skills.${index}.skills`,
              skills.filter((skill) => skill !== skilled)
            );
          };

  return (
    <div className="portfolio">
   
    {/* You would typically use array fields here */}
    {skillFields.map((field, index) => (
      <div key={field.id} className="flex flex-col gap-2 border-[0.1px] border-gray-700 p-2 rounded-md">
        <header className='flex justify-between'>

        <h3 className='text-theme text-xl'>Skill Set {index+1}</h3>
        {/* Delete Button */}
        {index>0&&
        <button
          type="button"
          onClick={() => removeSkill(index)}
          className="deleteExp text-whites bg-red-900 scale-75  mt-2 rounded-md p-2 hover:bg-red-700"
        >
          <RiDeleteBin6Line />

        </button>}
        </header>
        <label htmlFor="category">Category </label>
        <input
        id='category'
          {...register(`skills.${index}.category`)}
          placeholder="Skill Category-eg.Web Devlopment" 
        />
        <div>
          <label htmlFor="skills">Skills (press Enter to add)</label>
          <div className="flex gap-3 mb-2 flex-wrap">
            {watch(`skills.${index}.skills`).map(
              (skill, skillIndex) => (
                <div
                  key={skillIndex}
                  className=" px-2 py-1 text-black dark:text-gray-400 flex justify-center items-center gap-3 rounded-md bg-theme dark:bg-black-bg2"
                >
                  {skill}
                  <span
                    className="text-xl cursor-pointer"
                    onClick={(e) => deleteSkill(e, index, skill)}
                  >
                    x
                  </span>
                </div>
              )
            )}
          </div>
          <div className="w-full flex justify-between items-center text-white dark:bg-black-bg dark:outline-none rounded-md bg-gray-700 text-sm border-[0.1px] border-gray-700 focus:border-white">
            <input
              id='skills'
              placeholder="Skill Name-eg.React,NextJs"
              onKeyDown={(e) => handleSkill(e, index)}
              ref={(el) => {
                if (el) skillInputRefs.current[index] = el;
              }}
              className="w-full text-white dark:bg-black-bg dark:outline-none outline-none pl-3 py-2 rounded-md bg-gray-700 text-sm border-[0.1px] border-gray-700 focus:border-none border-none"
            />
            <div
              className="py-1 px-3 mr-2 bg-black text-xs cursor-pointer hover:text-gray-400 flex items-center justify-center rounded-md w-fit h-fit shadow-sm shadow-gray-500 active:scale-90 transition-all duration-200 ease-in-out"
              onClick={(e) => handleSkillClick(e, index)}
            >
              Add
            </div>
          </div>
          {errors.skills?.[index]?.skills && (
            <span>{errors.skills?.[index]?.skills.message}</span>
          )}
        </div>
        <label htmlFor="level">Proficiency Level</label>
        <select
        id='level'
          {...register(`skills.${index}.proficiency`)}
        >
          <option value="">Select proficiency</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

      </div>
    ))}
      <button
        type="button"
        className="border-[0.1px] border-gray-700 dark:hover:bg-black-bg2 hover:bg-slate-600 px-3 py-1 text-base dark:bg-black rounded-md "
        onClick={() =>
          appendSkill({
            category: "",
            skills: [],
            proficiency: "Beginner",
          })
        }
      >
        + {"    "}Add Skill Set
      </button>
    <div className="buttons">
      <button type="button" onClick={prevStep} className="nav-prev">
        Previous
      </button>
      <button type="button" onClick={nextStep} className="nav-next">
        Next
      </button>
    </div>
  </div>
  )
}
