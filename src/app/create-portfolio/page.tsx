"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SubmitHandler, useForm,} from "react-hook-form";
import Err from "../_components/Err";

import Skills from "../_components/form/Skills";
import FormNavigation from "../_components/form/FormNavigation";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { log } from "console";


const personalInfoSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  profilePicture: z
    .string()
    .url("Must be a valid URL")
    .or(z.literal(""))
    .default(""),
  title: z.string().min(1, "Professional title is required"),
  location: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
    .optional()
    .or(z.literal("")),
  socialLinks: z.object({
    linkedIn: z
      .string()
      .url("Must be a valid URL")
      .or(z.literal(""))
      .default(""),
    github: z.string().url("Must be a valid URL").or(z.literal("")).default(""),
    twitter: z
      .string()
      .url("Must be a valid URL")
      .or(z.literal(""))
      .default(""),
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


const resumeSchema = z.object({
  fileUrl: z.string().url("Must be a valid URL").or(z.literal("")).default(""),
});

// Combine all schemas
const portfolioSchema = z.object({
  personalInfo: personalInfoSchema, // Required
  summary: summarySchema, // Required
  skills: z.array(skillSchema), // Required
  languages: z.array(z.string()).optional().default([]),
  interests: z.array(z.string()).optional().default([]),
  resume: resumeSchema, // Required
  routeName: z
    .string()
    .min(3, "Route Name should be more than 3 characters")
    .max(30, "Route Name should be less than 30 characters"), // Required
});

export type FormData = z.infer<typeof portfolioSchema>;

export default function Page() {
  // Initialize useForm
  const [isDisabled, setIsDisabled] = useState(true);
  const [isAvailable,setIsAvailable]=useState(false);
  const [showError, setShowError] = useState(false);
  const [step, setStep] = useState(1);
  const { data: session } = useSession();
  const router=useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
    setError,
    clearErrors,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(portfolioSchema),
    mode: "onChange",
    defaultValues: {
      personalInfo: {
        fullName: "",
        title: "",
        email: "",
      },
      summary: {
        careerObjective: "none",
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
   
  useEffect(()=>{
   const check= async()=>{
    try{
      if(session?.user){
 
        
        const response= await axios.get('/api/existing-portfolio',{params:{email:session.user.email}});
   
        
        if(response.data.msg=='new user'){
         return;
        }else{
         
          
          router.push('/')
        }
      }else{
              

        const response=await axios.get('/api/check-login');
     
       
        
        if( response.data?.data?.username === ''){
     
          
          return;
        }else{     
          router.push('/')

        }
      }
    }catch(error){
      console.log('i am in the catch',error)
    }
  }
  check();
},[router,session])
  
    
  const handleAvailability = async () => {
   
    const routename = (watch("routeName") || "").trim();
   

    // Validate the length of the route name
    if (routename.length < 3 || routename.length > 30) {
      return;
    }

    try {
      // Send a POST request to the server with the route name
       const formData = new FormData();
       formData.append('routeName',routename)
      const response = await axios.post("/api/check-availability", formData);
    
      // Handle the response, assuming the API sends a success or error message
      if (response.data.available) {
        await setIsDisabled(false);
        clearErrors('routeName')
   
        await setIsAvailable(true);
      } else if (response.data.available == false) {
        // Example: Route is not available
         await setIsAvailable(false);
        setError("routeName", {
          type: "custom",
          message: "Route name is already taken",
        });
      } else {
        await setIsAvailable(false);
        setError("routeName", {
          type: "custom",
          message: "Something happend wrong !!",
        });
      }
    } catch (error) {
      await setIsAvailable(false);
      // Handle any network or server errors
      setError("routeName", {
        type: "custom",
        message: "An error occurred while checking availability",
      });
      console.error(error);
    }
  };
  const handleChange = () => {
    setIsDisabled(true);
  };
  const handleClick = () => {
    if (Object.keys(errors).length !== 0) {
      setShowError(true);
    }
  };
  const closeErrorBox = () => {
    setShowError(false);
  };
  // Submit handler
  const submit: SubmitHandler<FormData> = async (values: FormData) => {
    if (session) {
      try {
        const response = await axios.post("/api/create-portfolio", {
          data: values,
          type: 1,
          email: session.user?.email,
        });
        reset();
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const response = await axios.post("/api/create-portfolio", {
          data: values,
          type: 2,
        });

        reset();
      } catch (error) {
        console.log(error);
      }
    }

  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="csw relative pt-24">
      {showError && (
        <Err
          msg="Pleses Fill All The Required Field"
          handleClick={closeErrorBox}
        />
      )}
      <h1 className="text-xl md:text-3xl csw font-bold mb-1 pt-2 text-center dark:text-whites">
        Create Your Portfolio
      </h1>
      <FormNavigation setStep={setStep} step={step} />
      <div className=" relative csw mx-auto p-4  dark:bg-gray-800 bg-theme-light text-gray-900 dark:text-gray-100 min-h-screen">
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
              <input
                {...register("personalInfo.email")}
                placeholder="Email"
                id="email"
              />
              {errors.personalInfo?.email && (
                <span>{errors.personalInfo.email.message}</span>
              )}
              <input {...register("personalInfo.phone")} placeholder="Phone" />
              <input
                {...register("personalInfo.socialLinks.linkedIn")}
                placeholder="LinkedIn URL"
              />
              <input
                {...register("personalInfo.socialLinks.github", {
                  required: false,
                })}
                placeholder="GitHub URL"
              />
              <input
                {...register("personalInfo.socialLinks.twitter")}
                placeholder="Twitter URL"
              />

              <button
                type="button"
                onClick={nextStep}
                className="bg-theme p-3 rounded-lg"
              >
                Next
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="portfolio">
              <textarea
                {...register("summary.aboutMe")}
                placeholder="About Me"
              />
              {errors.summary?.aboutMe && (
                <span>{errors.summary.aboutMe.message}</span>
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

          {step === 3 && (
            <Skills
              control={control}
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
          {step === 5 && (
            <div className="portfolio">
              <h2>Choose your route name</h2>
              <div className="flex w-full justify-between ">
                <div className="w-[60%]">
                  <input
                    {...register("routeName")}
                    placeholder="dossier.com/..."
                    className="w-full"
                    onChange={handleChange}
                  />
                  {errors.routeName && <span>{errors.routeName.message}</span>}
                  {isAvailable && <div className="text-greens">Route Name is available ✔</div>}
                </div>
                <button
                  type="button"
                  className="w-[30%] h-fit p-2 bg-yellows rounded-lg"
                  onClick={handleAvailability}
                >
                  Check availability
                </button>
              </div>

              <div className="buttons">
                <button type="button" onClick={prevStep} className="nav">
                  Previous
                </button>
                <button
                  type="submit"
                  disabled={isDisabled}
                  className={`${
                    isDisabled ? "bg-grays" : "bg-greens"
                  } p-3 rounded-lg`}
                  onClick={handleClick}
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
