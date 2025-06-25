"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import Err from "../../components/Err";

import Skills from "../../components/form/Skills";
import FormNavigation from "../../components/form/FormNavigation";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "../../store/hooks";
import { setToastMsgRedux } from "../../features/toastMsg/toastMsgSlice";
import { updateRouteName } from "../../features/user/userSlice";

const personalInfoSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  profilePicture: z
    .string()
    .url("Profile Picture must be a valid URL")
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
  socialLinks: z
    .object({
      linkedIn: z
        .string()
        .url("LinkedIn URL must be a valid URL")
        .or(z.literal(""))
        .default(""),
      github: z
        .string()
        .url("GitHub URL must be a valid URL")
        .or(z.literal(""))
        .default(""),
      twitter: z
        .string()
        .url("Twitter URL must be a valid URL")
        .or(z.literal(""))
        .default(""),
    })
    .optional(),
});

const summarySchema = z.object({
  aboutMe: z.string().min(1, "About Me is required"),
  careerObjective: z.string().optional(),
});

const skillSchema = z.object({
  category: z.string(),
  skills: z.array(z.string()),
  proficiency: z.enum(["Beginner", "Intermediate", "Advanced"]),
});

const resumeSchema = z.object({
  fileUrl: z.string().url("Resume URL must be a valid URL").or(z.literal("")).default(""),
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
  const [isAvailable, setIsAvailable] = useState(false);
  //to keep track if the form is submitting 
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [step, setStep] = useState(1);
  const { data: session } = useSession();
  const router = useRouter();
  const dispatch=useAppDispatch();
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

  useEffect(() => {
    const check = async () => {
      try {
        if (session?.user) {
          const response = await axios.get("/api/existing-portfolio", {
            params: { email: session.user.email },
          });

          if (response.data.msg == "new user") {
            return;
          } else {
            router.push("/");
          }
        } else {
          const response = await axios.get("/api/check-login");

          if (response.data?.data?.username === "") {
            return;
          } else {
            router.push("/");
          }
        }
      } catch (error) {
        console.log("i am in the catch", error);
      }
    };
    check();
  }, [router, session]);

  const handleAvailability = async () => {
    const routename = (watch("routeName") || "").trim();

    // Validate the length of the route name
    if (routename.length < 3 || routename.length > 30) {
      return;
    }

    try {
      // Send a POST request to the server with the route name
      const formData = new FormData();
      formData.append("routeName", routename);
      const response = await axios.post("/api/check-availability", formData);

      // Handle the response, assuming the API sends a success or error message
      if (response.data.available) {
        await setIsDisabled(false);
        clearErrors("routeName");

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
    } catch (error: any) {
      await setIsAvailable(false);
      // Handle any network or server errors
      setError("routeName", {
        type: "custom",
        message: error.response?.data?.msg || "An error occurred while checking availability",
      });
      console.error(error);
    }
  };
  const handleChange = () => {
    setIsAvailable(false)
    setIsDisabled(true);
  };
  const handleClick = () => {
    
    if (Object.keys(errors).length !== 0) {
      // Recursively search for first message property
      const findFirstMessage = (obj: any): string | undefined => {
        if (obj.message) return obj.message;
        
        for (const key in obj) {
          if (typeof obj[key] === 'object') {
            const message = findFirstMessage(obj[key]);
            if (message) return message;
          }
        }
        return undefined;
      };

      const errorMessage = findFirstMessage(errors) || "Validation failed";
      dispatch(setToastMsgRedux({ msg: errorMessage }));
    }
  };
 
const submit: SubmitHandler<FormData> = async (values: FormData) => {
  setIsSubmiting(true);
  
  // Filter out skills with empty categories or empty skills arrays
  const filteredSkills = values.skills.filter(skill => 
    skill.category !== "" && skill.skills.length > 0
  );
  setValue("skills", filteredSkills);

  const payload = {
    data: {...values, skills: filteredSkills},
    type: session ? 1 : 2,
    ...(session && { email: session.user?.email }),
  };

  try {
    const response = await axios.post("/api/create-portfolio", payload);

    if (response.data.success) {
      dispatch(updateRouteName(payload.data.routeName))
      router.push("/" + response.data.routename);
      reset();
    }
  } catch (error: any) {
    console.log(error)
    setIsSubmiting(false);
    if ( error.response?.data.message) {
      dispatch(setToastMsgRedux({ msg: error.response.data.message }));
    } else {
      console.error(error);
    }
  }
};

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="csw relative pt-24 flex flex-col justify-between items-center">
    
      <h1 className="text-xl md:text-3xl csw font-bold mb-1 pt-2 text-center dark:text-whites">
        Create Your Portfolio
      </h1>
      <FormNavigation setStep={setStep} step={step} />
      <div className=" relative border-[0.1px] border-gray-700 rounded-md   dark:bg-[#121621] bg-whites text-gray-900 dark:text-gray-100 h-fit max-w-3xl lg:w-[800px] md:w-[650px] sm:w-[500] mb-24 w-full p-6">
        <form
          className="max-w-3xl mx-auto space-y-6"
          onSubmit={handleSubmit(submit)}
        >
          {step === 1 && (
            <div className="portfolio">
              {/* Full Name */}
              <label htmlFor="fullName">
                Full Name <div className="text-theme inline">*</div>
              </label>
              <input
                id="fullName"
                {...register("personalInfo.fullName")}
                placeholder="Full Name"
              />
              {errors.personalInfo?.fullName && (
                <span>{errors.personalInfo.fullName.message}</span>
              )}

              {/* Professional Title */}
              <label htmlFor="title">
                Professional Title <div className="text-theme inline">*</div>
              </label>
              <input
                id="title"
                {...register("personalInfo.title")}
                placeholder="Senior Software Engineer"
              />
              {errors.personalInfo?.title && (
                <span>{errors.personalInfo.title.message}</span>
              )}

              {/* Location */}
              <label htmlFor="location">Location</label>
              <input
                id="location"
                {...register("personalInfo.location")}
                placeholder="Location"
              />

              {/* Email */}
              <label htmlFor="email">
                Email <div className="text-theme inline">*</div>
              </label>
              <input
                id="email"
                {...register("personalInfo.email")}
                autoComplete="email"
                placeholder="john@example.com"
              />
              {errors.personalInfo?.email && (
                <span>{errors.personalInfo.email.message}</span>
              )}

              {/* Phone */}
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                {...register("personalInfo.phone")}
                placeholder="Phone"
              />
              {errors.personalInfo?.phone && (
                <span>{errors.personalInfo.phone.message}</span>
              )}
              <h3 className="text-lg font-semibold my-2">Social Links</h3>
              {/* LinkedIn URL */}
              <label htmlFor="linkedIn">LinkedIn URL</label>
              <input
                id="linkedIn"
                {...register("personalInfo.socialLinks.linkedIn")}
                placeholder="https://linkedin.com/in/..."
                type="url"
              />

              {/* GitHub URL */}
              <label htmlFor="github">GitHub URL</label>
              <input
                id="github"
                {...register("personalInfo.socialLinks.github", {
                  required: false,
                })}
                placeholder="https://github.com/..."
                type="url"
              />

              {/* Twitter URL */}
              <label htmlFor="twitter">Twitter URL</label>
              <input
                id="twitter"
                {...register("personalInfo.socialLinks.twitter")}
                placeholder="https://twitter.com/..."
                type="url"
              />
              <div className="w-full flex justify-end mt-3">
                <button type="button" onClick={nextStep} className="nav-next">
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="portfolio">
              <label htmlFor="aboutMe">About Me <div className="text-theme inline">*</div></label>
              <textarea
                id="aboutMe"
                {...register("summary.aboutMe")}
                placeholder="About Me"
              />
              {errors.summary?.aboutMe && (
                <span>{errors.summary.aboutMe.message}</span>
              )}
              <div className="buttons">
                <button type="button" onClick={prevStep} className="nav-prev">
                  Previous
                </button>
                <button type="button" onClick={nextStep} className="nav-next">
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
                <button type="button" onClick={prevStep} className="nav-prev">
                  Previous
                </button>
                <button type="button" onClick={nextStep} className="nav-next">
                  Next
                </button>
              </div>
            </div>
          )}
          {/* route */}
          {step === 5 && (
            <div className="portfolio">
              <h2>Choose your route name</h2>
              <div className="flex w-full justify-between mt-6 ">
                <div className="w-[60%]">
                  <input
                    {...register("routeName")}
                    placeholder="dossier.com/..."
                    className="w-full"
                    onChange={handleChange}
                  />
                </div>
                <button
                  type="button"
                  className="w-[30%] p-2 bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700 rounded-lg text-sm transition-colors"
                  onClick={handleAvailability}
                >
                  Check
                </button>
              </div>
              {errors.routeName && <span>{errors.routeName.message}</span>}
              {isAvailable && (
                <div className="text-greens">Route Name is available ✔</div>
              )}
              <div className="buttons">
                <button type="button" onClick={prevStep} className="nav-prev">
                  Previous
                </button>
                <button
                  type="submit"
                  disabled={isDisabled}
                  className={`${
                    isDisabled ? "bg-grays" : "bg-greens"
                  } px-3 py-2 rounded-lg`}
                  onClick={handleClick}
                >
                  {isSubmiting?<div>Submiting... </div>:"Submit"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
