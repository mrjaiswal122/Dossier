"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {  z } from "zod";
import { SubmitHandler, useForm, FormProvider } from "react-hook-form";

import Education from "../_components/form/Education";
import Experience from "../_components/form/Experience";
import Projects from "../_components/form/Projects";
import Certifications from "../_components/form/Certifications";
import Publications from "../_components/form/Publications";
import Skills from "../_components/form/Skills";
import FormNavigation from "../_components/form/FormNavigation";
import axios from "axios";
import { useSession } from "next-auth/react"

const personalInfoSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  profilePicture: z.string().url("Must be a valid URL").or(z.literal('')).default(''),
  title: z.string().min(1, "Professional title is required"),
  location: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
    .optional()
    .or(z.literal("")),
  socialLinks: z.object({
    linkedIn: z.string().url("Must be a valid URL").or(z.literal('')).default(''),
    github: z.string().url("Must be a valid URL").or(z.literal('')).default(''),
    twitter: z.string().url("Must be a valid URL").or(z.literal('')).default(''),
  }),
});

const summarySchema = z.object({
  aboutMe: z.string(),
  careerObjective: z.string().optional(),
});

const skillSchema = z.object({
  category: z.string(),
  skills: z.array(z.string()),
  proficiency: z.enum(["Beginner", "Intermediate", "Advanced"]),
});

const experienceSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required").optional(), // Job title is optional but validated if filled
  companyName: z.string().min(1, "Company name is required").optional(), // Company name is optional but validated if filled
  companyLogo: z.string().optional(),
  location: z.string().optional(),
  startDate: z.date().optional().nullable(), // Optional initially, required if the experience is filled
  endDate: z.union([z.date(), z.literal("Currently Working")]).optional().default("Currently Working").nullable(), // Defaults to "Currently Working" if no end date
  responsibilities: z.string().optional(),
}).refine(
  (data) => {
    // If jobTitle or companyName is provided, startDate must be provided
    if (data.jobTitle || data.companyName) {
      return !!data.startDate; // startDate is required if jobTitle or companyName is filled
    }
    return true; // If nothing is filled, it's valid
  },
  {
    message: "Start date is required if job title or company name is provided",
    path: ["startDate"], // Points to the startDate field for the error
  }
);


const educationSchema = z.object({
  degree: z.string().min(1, "Degree is required"),
  institutionName: z.string().min(1, "Institution name is required"),
  institutionLogo: z.string().url("Must be a valid URL").or(z.literal('')).default(''),
  location: z.string().optional(),
  startDate: z.date().nullable(),
  endDate: z.date().optional().nullable(),
  achievements: z.string().optional(),
});

const projectSchema = z.object({
  title: z.string().min(1, "Project title is required"),
  description: z.string().min(1, "Project description is required"),
  technologies: z.array(z.string()),
projectUrl:z.string().url("Must be a valid URL").or(z.literal('')).default(''),
  githubUrl: z.string().url("Must be a valid URL").or(z.literal('')).default(''),
  image:z.string().url("Must be a valid URL").or(z.literal('')).default(''),
});

const certificationSchema = z.object({
  title: z.string().min(1, "Certification title is required"),
  organization: z.string().min(1, "Organization is required"),
  dateEarned: z.date(),
  certificateUrl: z.string().url("Must be a valid URL").or(z.literal('')).default(''),
});

const publicationSchema = z.object({
  title: z.string().min(1, "Publication title is required"),
  description: z.string().optional(),
  datePublished: z.date(),
  url:z.string().url("Must be a valid URL").or(z.literal('')).default(''),
});

// const awardSchema = z.object({
//   title: z.string().min(1, "Award title is required"),
//   organization: z.string().min(1, "Organization is required"),
//   dateReceived: z.date(),
//   description: z.string().optional(),
// });

// const testimonialSchema = z.object({
//   name: z.string().min(1, "Name is required"),
//   jobTitle: z.string().optional(),
//   company: z.string().optional(),
//   contactInfo: z.string().optional(),
//   testimonialText: z.string().min(1, "Testimonial text is required"),
// });

// const contactSchema = z.object({
//   email: z.string().email("Invalid email address"),
//   message: z.string().optional(),
// });

const resumeSchema = z.object({
  fileUrl: z.string().url("Must be a valid URL").or(z.literal('')).default(''),
});

// Combine all schemas
const portfolioSchema = z.object({
  personalInfo: personalInfoSchema, // Required
  summary: summarySchema, // Required
  skills: z.array(skillSchema), // Required
  languages: z.array(z.string()).optional().default([]), 
  interests: z.array(z.string()).optional().default([]), 
  resume: resumeSchema, // Required
  routeName: z.string().min(3,'Route Name should be more than 3 characters').max(30,'Route Name should be less than 30 characters'), // Required
});

export type FormData = z.infer<typeof portfolioSchema>;

export default function Page() {
  // Initialize useForm
  const [isDisabled, setIsDisabled] = useState(true);
  const [formData, setFormData] = useState<FormData>();
  const [step, setStep] = useState(1);
  const {data:session}=useSession()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
    setError,
    clearErrors,
  } = useForm<FormData>({
    resolver: zodResolver(portfolioSchema),
    mode: "onChange",
    defaultValues: {
      personalInfo: {
        fullName: "",
        title: "",
        email: "",
      },
      summary:{
        
        careerObjective:"none"
      },
      skills: [
        {
          category: "",
          skills: [],
          proficiency: "Beginner", // Default value from enum
        },
      ],
      languages: ["English"], // Default language
      interests: ["chess"], // Default interest
      resume: {
        fileUrl: "", // Default empty string for resume file URL
      },
    },
  });
  
  const currentFormData = watch();

  useEffect(() => {
    console.log('watching :',currentFormData); // You can store this data somewhere to persist
    console.log(errors)
  }, [currentFormData,errors]);

const handleAvailability=async()=>{
   const routename = (watch('routeName') || "").trim();
  console.log(routename,"   ",routename.length);
  
  // Validate the length of the route name
  if (routename.length < 3 || routename.length>30) {  
    return;
  }

 try {
    // Send a POST request to the server with the route name
    const response = await axios.post('/api/check-availability', {
      routeName: routename
    });
    console.log(response.data.available)
    // Handle the response, assuming the API sends a success or error message
    if (response.data.available) {
      await setIsDisabled(false);
      console.log('Route is available');
      setError('routeName', {
        type: "custom",
        message: "Route name is available"
      });
    } else if(response.data.available==false) {
      // Example: Route is not available
      setError('routeName', {
        type: "custom",
        message: "Route name is already taken"
      });
    }else{
      setError('routeName', {
        type: "custom",
        message: "Something happend wrong !!"
      });
    }
  } catch (error) {
    // Handle any network or server errors
    setError('routeName', {
      type: "custom",
      message: "An error occurred while checking availability"
    });
    console.error(error);
  }  
};
const handleChange=()=>{

  setIsDisabled(true);

}
  // Submit handler
  const submit: SubmitHandler<FormData> =  (values: FormData) => {
       if (session){
        console.log(session.user)
       }
    console.log('submitting :',values)
  };

  const nextStep = () =>{ setStep(step + 1)};
  const prevStep = () => setStep(step - 1);

  return (
    <>
      <h1 className="text-xl md:text-3xl csw font-bold mb-1 pt-2 text-center dark:text-whites">
        Create Your Portfolio
      </h1>
       <FormNavigation setStep={setStep} step={step}/>
    <div className="csw mx-auto p-4  dark:bg-gray-800 bg-theme-light text-gray-900 dark:text-gray-100 min-h-screen">
      <form className="max-w-3xl mx-auto" onSubmit={handleSubmit(submit)}>
        {step === 1 && (
          <div className="portfolio">
         
            <input
              {...register("personalInfo.fullName")}
              placeholder="Full Name"
              
            />
            {errors.personalInfo?.fullName && (
              <span>{errors.personalInfo.fullName.message}</span>
            )}
            <input
              {...register("personalInfo.profilePicture")}
              placeholder="Profile Picture URL"
              
            />
            <input
              {...register("personalInfo.title")}
              placeholder="Professional Title"
             
            />
            {errors.personalInfo?.title && (
              <span>{errors.personalInfo.title.message}</span>
            )}
            <input
              {...register("personalInfo.location")}
              placeholder="Location"
            
            />
            <input {...register("personalInfo.email")} placeholder="Email" id="email" />
            {errors.personalInfo?.email && (
              <span>{errors.personalInfo.email.message}</span>
            )}
            <input {...register("personalInfo.phone")} placeholder="Phone" />
            <input
              {...register("personalInfo.socialLinks.linkedIn")}
              placeholder="LinkedIn URL"
             
            />
            <input
              {...register("personalInfo.socialLinks.github",{required:false})}
              placeholder="GitHub URL"
             
            />
            <input
              {...register("personalInfo.socialLinks.twitter")}
              placeholder="Twitter URL"
             
            />
         
            <button type="button" onClick={nextStep} className="bg-theme p-3 rounded-lg">
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="portfolio">
        
            <textarea {...register("summary.aboutMe")} placeholder="About Me"  />
             {errors.summary?.aboutMe &&
             <span>{errors.summary.aboutMe.message}</span>
             }
            <div className="buttons">
              <button type="button" onClick={prevStep} className="nav">
                Previous
              </button>
              <button type="button" onClick={nextStep} className="nav">
                Next
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <Skills control={control}
            register={register}
            errors={errors}
            prevStep={prevStep}
            nextStep={nextStep}
            watch={watch}
            setValue={setValue}
            setError={setError}
            clearErrors={clearErrors}
          />
        )}

        {/* {step === 4 && (
          <Experience control={control}
            register={register}
            errors={errors}
            prevStep={prevStep}
            nextStep={nextStep}
            watch={watch}
          />
        )}

        {step === 5 && (
          <Education control={control}
            register={register}
            errors={errors}
            prevStep={prevStep}
            nextStep={nextStep}
          />
        )}
        {step === 6 && (
          <Projects control={control}
            register={register}
            errors={errors}
            prevStep={prevStep}
            nextStep={nextStep}
            watch={watch}
            setValue={setValue}
            setError={setError}
            clearErrors={clearErrors}
          />
        )}
        {step === 7 && (
          <Certifications control={control}
            register={register}
            errors={errors}
            prevStep={prevStep}
            nextStep={nextStep}
          />
        )}
        {step === 8 && (
          <Publications control={control}
            register={register}
            errors={errors}
            prevStep={prevStep}
            nextStep={nextStep}
          />
        )} */}
        {/* resume */}
        {step === 4 && (
          <div className="portfolio">
         
            <input
              {...register("resume.fileUrl")}
              placeholder="Resume URL (public google drive link)"
            />
            {errors.resume?.fileUrl && (
              <span>{errors.resume.fileUrl.message}</span>
            )}
           <div className="buttons">
              <button type="button" onClick={prevStep} className="nav">
                Previous
              </button>
              <button type="button" onClick={nextStep} className="nav">
                Next
              </button>
            </div>
          </div>
        )}
        {/* route */}
        {step === 5 &&( 
        <div className="portfolio">
           <h2>Choose your route name</h2>
           <div className="flex w-full justify-between ">
           <div className="w-[60%]" >

        <input {...register('routeName')}  placeholder="dossier.com/..."  className="w-full"
        onChange={handleChange}/>
        {errors.routeName && (
          <span>{errors.routeName.message}</span>
        )}
           </div>
        <button className="w-[30%] h-fit p-2 bg-yellows rounded-lg" onClick={handleAvailability}>Check availability</button>
           </div>
        
            <div className="buttons">
              <button type="button" onClick={prevStep} className="nav">
                Previous
              </button>
              <button type="submit"  disabled={isDisabled} className={`${isDisabled?'bg-grays':'bg-greens'} p-3 rounded-lg`}>
                Done
              </button>
            </div>
        </div>)
        }
      </form>
    </div>
    </>
  );
}
