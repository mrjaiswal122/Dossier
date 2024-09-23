import React from 'react'
import { MdOutlineDeleteForever } from 'react-icons/md'
import { Control, FieldError, FieldErrors, useFieldArray, UseFormRegister, } from 'react-hook-form'
import { FormData } from '@/app/create-portfolio/page'
type props={
control:Control<FormData>,
register:UseFormRegister<FormData>,
errors:FieldErrors<FormData>,
prevStep:()=>void,
nextStep:()=>void,

}
export default function Education({control,register,errors,prevStep,nextStep}
:props) {
    const {fields:educationFields,remove:removeEducation,append:appendEducation}=useFieldArray({
        control,
       name:'education'
    })
  return (
    <div>
         <div className="portfolio">
            <h2>Education</h2>
            {educationFields.map((field, index) => (
              <div key={field.id} className="flex flex-col gap-2">
                <input
                  {...register(`education.${index}.degree`)}
                  placeholder="Degree Name"
                />
                {errors.education?.[index]?.degree && (
                  <span>{errors.education[index]?.degree?.message}</span>
                )}
                <input
                 
                
                  {...register(`education.${index}.institutionName`)}
                  placeholder="Institution Name"
                />
                {errors.education?.[index]?.institutionName && (
                  <span>{errors.education[index]?.institutionName?.message}</span>
                )}
                <input
                  {...register(`education.${index}.institutionLogo`)}
                  placeholder="Institution Logo URL"
                />
                <input
                  {...register(`education.${index}.location`)}
                  placeholder="Location"
                />
                <input
                 type='date'
                  {...register(`education.${index}.startDate`, {
                    valueAsDate: true,
                  })}
                />
                {errors.education?.[index]?.startDate && (
                  <span>{errors.education[index]?.startDate?.message}</span>
                )}
                <input
                type="date"
                  {...register(`education.${index}.endDate`, {
                    valueAsDate: true,
                  })}
                />
                <input
                  {...register(`education.${index}.achievements`)}
                  placeholder="Marks Obtained"
                />
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
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
                  appendEducation({
                    degree: "",
                    institutionName: "",
                    institutionLogo: "",
                    location: "",
                    startDate: new Date(),
                    endDate: new Date(),
                    achievements: "",
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
          </div>
  )
}
