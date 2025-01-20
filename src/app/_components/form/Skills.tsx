'use client';
import React from 'react'
import { MdOutlineDeleteForever } from 'react-icons/md'
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
        const handleSkill = (
            event: React.KeyboardEvent<HTMLInputElement>,
            index: number
          ) => {
            if (event.key === "Enter") {
              event.preventDefault();
              let input = event.currentTarget.value;
              const skill = input.trim();
        
              if (skill) {
                const currentSkills = watch(`skills.${index}.skills`);
                setValue(`skills.${index}.skills`, [...currentSkills, skill]);
                event.currentTarget.value = "";
                clearErrors(`skills.${index}.skills`);
                return;
              }
              // event.currentTarget.value=''
              setError(`skills.${index}.skills`, {
                type: "custom",
                message: "Skill can't be empty",
              });
            }
          };
          const deleteSkill = (
            e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
            index: number,
            skilled: string
          ) => {
            const skills = watch(`skills.${index}.skills`);
            setValue(
              `skills.${index}.skills`,
              skills.filter((skill, i) => skills[i] !== skilled)
            );
          };
  return (
    <div className="portfolio">
   
    {/* You would typically use array fields here */}
    {skillFields.map((field, index) => (
      <div key={field.id} className="flex flex-col gap-2 border-[0.1px] border-gray-700 p-2 rounded-md">
        <header className='flex justify-between'>

        <h2 className='text-theme'>Skill Set {index+1}</h2>
        {index>0&&
        <button
          type="button"
          onClick={() => removeSkill(index)}
          className="deleteExp text-reds scale-150 mt-2"
        >
          <MdOutlineDeleteForever />
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
          <input
            id='skills'
            placeholder="Skill Name-eg.React,NextJs"
            onKeyDown={(e) => handleSkill(e, index)}
            className="w-full" name='skills' type='text'
          />
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
        className="border-[0.1px] border-gray-700 px-3 py-1 text-base dark:bg-black rounded-md "
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

