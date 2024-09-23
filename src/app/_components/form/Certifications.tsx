import React from 'react'
import { MdOutlineDeleteForever } from 'react-icons/md'
import { Control, FieldErrors, useFieldArray, UseFormRegister, } from 'react-hook-form'
import { FormData } from '@/app/create-portfolio/page'
type props={
control:Control<FormData>,
register:UseFormRegister<FormData>,
errors:FieldErrors<FormData>,
prevStep:()=>void,
nextStep:()=>void,

}
export default function Certifications({control,register,errors,prevStep,nextStep}
    :props) {
        const {fields:certificationsFields,remove:removeCertifications,append:appendCertifications

        }=useFieldArray({
            control,
           name:'certifications'
        }) 
  return (
    <div className="portfolio">
    <h2>Certifications</h2>
    {certificationsFields.map((field, index) => (
      <div key={field.id} className="flex flex-col gap-2">
        <input
          {...register(`certifications.${index}.title`)}
          placeholder="Certifications Title"
        />
        {errors.certifications?.[index]?.title && (
          <span>{errors.certifications?.[index]?.title?.message}</span>
        )}
        <input
          {...register(`certifications.${index}.organization`)}
          placeholder="Organization Name"
        />
        {errors.certifications?.[index]?.organization && (
          <span>{errors.certifications[index]?.organization?.message}</span>
        )}
        
      
        <input
        type="date"
          {...register(`certifications.${index}.dateEarned`, {
            valueAsDate: true,
          })}
        />
         <input 
         type="date"
         {...register(`certifications.${index}.certificateUrl`)} placeholder='Certification Url' />
        <button
          onClick={() => removeCertifications(index)}
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
          appendCertifications({
            title: "",
            organization: "",
            dateEarned: new Date(),
            certificateUrl: "",
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
