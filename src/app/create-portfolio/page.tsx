'use client'
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z }from 'zod';
// import { useForm} from "react-hook-form";
import { useForm } from "react-hook-form";
type Props = {}
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
const fromSchema =z.object({
  username:z.string().min(3,"Username should be longer than 3 characters").max(30,"Username can't exceed 30 characters"),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  profession: z.string().min(2, 'Profession must be at least 2 characters'),
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  linkedin: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  github: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
  profilePicture: z
    .any()
    .refine((files) => files?.length == 0 || (files?.[0]?.size <= MAX_FILE_SIZE), 
      `Max file size is 5MB.`)
    .refine(
      (files) => files?.length == 0 || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    )
    .optional(),
})
type formData =z.infer<typeof fromSchema>;
export default function Page({}: Props) {
  // initialed useForm
 const {register,handleSubmit,formState:{errors}}=useForm<formData>({
  resolver:zodResolver(fromSchema),
 });
// submit handler
const submit =(data:formData)=>{
console.log(data);
console.log('jshdsjhdsdsdsdsdsd')

}
  return (
   

    <div className="max-w-2xl mx-auto p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">Create Your Portfolio</h1>
      <form onSubmit={handleSubmit(submit)} className="space-y-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            {...register('fullName')}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-white dark:bg-gray-700"
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register('email')}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-white dark:bg-gray-700"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="profession" className="block text-sm font-medium">
            Profession
          </label>
          <input
            type="text"
            id="profession"
            {...register('profession')}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-white dark:bg-gray-700"
          />
          {errors.profession && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.profession.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium">
            Bio
          </label>
          <textarea
            id="bio"
            {...register('bio')}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-white dark:bg-gray-700"
          ></textarea>
          {errors.bio && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.bio.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium">
            Phone Number (optional)
          </label>
          <input
            type="tel"
            id="phoneNumber"
            {...register('phoneNumber')}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-white dark:bg-gray-700"
          />
          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phoneNumber.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="website" className="block text-sm font-medium">
            Website URL (optional)
          </label>
          <input
            type="url"
            id="website"
            {...register('website')}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-white dark:bg-gray-700"
          />
          {errors.website && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.website.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="linkedin" className="block text-sm font-medium">
            LinkedIn Profile (optional)
          </label>
          <input
            type="url"
            id="linkedin"
            {...register('linkedin')}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-white dark:bg-gray-700"
          />
          {errors.linkedin && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.linkedin.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="github" className="block text-sm font-medium">
            GitHub Profile (optional)
          </label>
          <input
            type="url"
            id="github"
            {...register('github')}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-white dark:bg-gray-700"
          />
          {errors.github && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.github.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="profilePicture" className="block text-sm font-medium">
            Profile Picture (optional)
          </label>
          <input
            type="file"
            id="profilePicture"
            accept="image/*"
            {...register('profilePicture')}
            className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              dark:file:bg-indigo-900 dark:file:text-indigo-300
              hover:file:bg-indigo-100 dark:hover:file:bg-indigo-800"
          />
          {errors.profilePicture && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.profilePicture.message}</p>
          )}
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-offset-gray-800"
          >
            Create Portfolio
          </button>
        </div>
      </form>
    </div>
  )
}