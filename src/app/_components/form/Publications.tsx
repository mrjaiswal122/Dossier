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
export default function Publications({control,register,errors,prevStep,nextStep}
    :props) {
        const {fields:publicationsFields,remove:removePublication,append:appendPublication

        }=useFieldArray({
            control,
           name:'publications'
        }) 
  return (
    <div className="portfolio">
    <h2>Publications</h2>
    {publicationsFields.map((field, index) => (
      <div key={field.id} className="flex flex-col gap-2">
        <input
          {...register(`publications.${index}.title`)}
          placeholder="Publication Tiitle"
        />
        {errors.publications?.[index]?.title && (
          <span>{errors.publications?.[index]?.title?.message}</span>
        )}
        <input
          {...register(`publications.${index}.description`)}
          placeholder="Description"
        />
        {errors.publications?.[index]?.description && (
          <span>{errors.publications[index]?.description?.message}</span>
        )}
        
      
        <input
          {...register(`publications.${index}.datePublished`, {
            valueAsDate: true,
          })}
        />
         <input  {...register(`publications.${index}.url`)} placeholder='Publication Url' 
         />
         {errors.publications?.[index]?.url && (
          <span>{errors.publications[index]?.url?.message}</span>
        )}
        <button
          type="button"
          onClick={() => removePublication(index)}
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
          appendPublication({
            title: "",
          datePublished: new Date(),
          description: "",
          url: "",
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
