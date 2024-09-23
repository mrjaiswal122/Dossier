import React from 'react'
import { MdOutlineDeleteForever } from 'react-icons/md'
import { Control, FieldErrors, useFieldArray, UseFormRegister, UseFormWatch, } from 'react-hook-form'
import { FormData } from '@/app/create-portfolio/page'
type props={
control:Control<FormData>,
register:UseFormRegister<FormData>,
errors:FieldErrors<FormData>,
prevStep:()=>void,
nextStep:()=>void,
watch:UseFormWatch<FormData>,
}
export default function Experience({control,register,errors,prevStep,nextStep,watch}
    :props) {
        const {fields:experienceFields,remove:removeExperience,append:appendExperience}=useFieldArray({
            control,
           name:'experience'
        })
  return (
    <div className="portfolio">
    <h2>Experience</h2>
    {experienceFields.map((field, index) => (
      <div key={field.id} className="flex flex-col gap-2">
        <input
          {...register(`experience.${index}.jobTitle`)}
          placeholder="Job Title"
        />
        {errors.experience?.[index]?.jobTitle && (
          <span>{errors.experience[index]?.jobTitle?.message}</span>
        )}
        <input
          {...register(`experience.${index}.companyName`)}
          placeholder="Company Name"
        />
        {errors.experience?.[index]?.companyName && (
          <span>{errors.experience[index]?.companyName?.message}</span>
        )}
        <input
          {...register(`experience.${index}.companyLogo` )}
          placeholder="Company Logo URL"
        />
        <input
          {...register(`experience.${index}.location` )}
          placeholder="Location"
        />
        <input
          type="date"
          {...register(`experience.${index}.startDate`, {
            valueAsDate: true,
          })}
        />
        {errors.experience?.[index]?.startDate && (
          <span>{errors.experience[index]?.startDate?.message}</span>
        )}
       
        <input
        type="date"
        
          {...register(`experience.${index}.endDate`, {
            valueAsDate: true,
          })}
      
        />
        <textarea
          {...register(`experience.${index}.responsibilities`)}
          placeholder="Responsibilities"
        />
        <button
          type="button"
          onClick={() => removeExperience(index)}
          className="deleteExp text-red-600"
        >
          <MdOutlineDeleteForever />
        </button>
      </div>
    ))}
    <div className="buttons">
      <button
        type="button"
        className="border px-3 py-1 text-lg "
        onClick={() =>
          appendExperience({
            jobTitle: "",
            companyName: "",
            companyLogo: "",
            location: "",
            startDate:new Date(),
            endDate: new Date(),
            
            responsibilities: "",
          })
        }
      >
        +
      </button>
      <button type="button" onClick={prevStep} className="nav">
        Previous
      </button>
      <button type="button" onClick={nextStep} className="nav">
        Next
      </button>
    </div>
  </div>
  )
}

