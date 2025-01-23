import { updateProfileAsync } from '@/app/_features/portfolio/portfolioSlice';
import { useAppDispatch, useAppSelector } from '@/app/_store/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { watch } from 'fs';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { TiDeleteOutline } from 'react-icons/ti';
import { z } from 'zod';

type Props = {
  setUpdatingProfile: Dispatch<SetStateAction<boolean>>; 
};

const updateProfileSchema = z.object({
  
  personalInfo: z.object({
    fullName: z.string().min(1, 'Name is required !!'),
    profilePicture: z.string().optional(),
    title: z.string().min(3, 'Title is required !!'),
    location: z.string().optional(),
    email: z.string().min(6, 'Email is required !!'),
    phone: z.string().optional(),
    socialLinks: z
      .object({
        linkedIn: z.string().optional(),
        github: z.string().optional(),
        twitter: z.string().optional(),
        instagram: z.string().optional(),
        facebook: z.string().optional(),
        youtube: z.string().optional(),
      })
      .optional(),
  }),
  summary: z
    .object({
      aboutMe: z.string().optional(),
      careerObjective: z.string().optional(),
    })
});

export type UpdateProfileType = z.infer<typeof updateProfileSchema>;

export default function UpdateProfile({setUpdatingProfile}: Props) {
  const portfolio = useAppSelector((state) => state.portfolioSlice);
  const dispatch = useAppDispatch();
  const [isUnchanged, setIsUnchanged] = useState(true);
  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
    watch
  } = useForm<UpdateProfileType>({
    resolver: zodResolver(updateProfileSchema),
    mode: 'onChange',
    defaultValues: {
      personalInfo: portfolio.personalInfo,
      summary: portfolio.summary,
    },
  });
    const currentValues=watch()
    useEffect(() => {
    const isSame = (JSON.stringify(currentValues.personalInfo) === JSON.stringify(portfolio.personalInfo))&&(JSON.stringify(currentValues.summary)===JSON.stringify(portfolio.summary));
    setIsUnchanged(isSame);
  }, [currentValues,portfolio]);
  const handleFormClose =(e:React.MouseEvent<HTMLElement>)=>{
    const section = e.target as HTMLElement;
    if (section.id === "updateProfile") {
      setUpdatingProfile(false);
    }
  };
  const onSubmit = async (data: UpdateProfileType) => {
    console.log(data);
    dispatch(updateProfileAsync({data,routeName:portfolio.routeName}))
    setUpdatingProfile(false)
    // Dispatch an action or handle form submission here
  };
  return (
    <section className="fixed z-10 w-full h-full top-0 left-0 dark:bg-black dark:bg-opacity-90 bg-white my-10 " onClick={handleFormClose} id='updateProfile'>
      <div className="fixed top-[80px] left-[50%] csw max-h-[80vh] overflow-y-auto border shadow-2xl shadow-gray-500 dark:shadow-gray-500 border-black dark:border-gray-500 translate-x-[-50%]   dark:bg-black rounded-lg flex flex-col justify-between dark:text-whites bg-opacity-65">
        <div className=" sticky bg-white top-0  w-full flex justify-between items-center px-4 py-2 text-lg md:text-xl dark:text-theme  dark:bg-black border-b dark:border-b  border-black">
          Edit Profile
          <span
            onClick={() => {
              setUpdatingProfile(false);
            }}
          >
            <TiDeleteOutline className="scale-150 dark:text-white cursor-pointer hover:text-reds" />
          </span>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-3 text-sm ">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block mb-1">Name*</label>
                <input
                  type="text"
                  id="fullName"
                  {...register('personalInfo.fullName')}
                  className="border rounded-md p-2 w-full dark:bg-gray-800 dark:text-white"
                />
                {errors.personalInfo?.fullName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.personalInfo.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="title" className="block mb-1">Title*</label>
                <input
                  type="text"
                  id="title"
                  {...register('personalInfo.title')}
                  className="border rounded-md p-2 w-full dark:bg-gray-800 dark:text-white"
                />
                {errors.personalInfo?.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.personalInfo.title.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block mb-1">Email*</label>
                <input
                  type="email"
                  id="email"
                  {...register('personalInfo.email')}
                  className="border rounded-md p-2 w-full dark:bg-gray-800 dark:text-white"
                />
                {errors.personalInfo?.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.personalInfo.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block mb-1">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  {...register('personalInfo.phone')}
                  className="border rounded-md p-2 w-full dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="location" className="block mb-1">Location</label>
                <input
                  type="text"
                  id="location"
                  {...register('personalInfo.location')}
                  className="border rounded-md p-2 w-full dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="aboutMe" className="block mb-1">About Me</label>
                <textarea
                  id="aboutMe"
                  {...register('summary.aboutMe')}
                  rows={5}
                  className="border rounded-md p-2 w-full dark:bg-gray-800 dark:text-white"
                ></textarea>
              </div>

              <div>
                <label htmlFor="linkedin" className="block mb-1">LinkedIn</label>
                <input
                  type="url"
                  id="linkedin"
                  {...register('personalInfo.socialLinks.linkedIn')}
                  placeholder="https://linkedin.com/in/yourusername"
                  className="border rounded-md p-2 w-full dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="github" className="block mb-1">GitHub</label>
                <input
                  type="url"
                  id="github"
                  {...register('personalInfo.socialLinks.github')}
                  placeholder="https://github.com/yourusername"
                  className="border rounded-md p-2 w-full dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="twitter" className="block mb-1">Twitter</label>
                <input
                  type="url"
                  id="twitter"
                  {...register('personalInfo.socialLinks.twitter')}
                  placeholder="https://twitter.com/yourusername"
                  className="border rounded-md p-2 w-full dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            {<button type="submit" disabled={isUnchanged} className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors">
              Save Changes
            </button>}
          </div>
        </form>
      </div>
    </section>
  );}
