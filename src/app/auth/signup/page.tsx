'use client'
import axios from "axios";
import Link from "next/link";
import { useState } from "react";


export default function SignupPage() {
const[formData,setFormData] =useState<{name:string,password:string,email:string}>({name:"",password:"",email:""});

const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
  const input= e.target as HTMLInputElement;
  const label = document.querySelector(`label[for='${input.id}']`);
  
  
setFormData({...formData,[e.target.name]:e.target.value})
  
  
  if(true){
    if(e.target.value==''){ 
      label?.classList.add('top-1/2');
      label?.classList.remove('text-xs');
    }else {
      label?.classList.remove('top-1/2');
      label?.classList.add('top-0');
      label?.classList.add('text-xs');
     }}

  }
const  handleSubmit=async(e: React.FormEvent<HTMLFormElement>)=>{
  e.preventDefault();
  try{

    const response=await axios.post('/api/signup', formData);
    console.log(response);
    
  }catch(error){
    console.log(error)
  }
  setFormData({name:"",password:"",email:""})

  }

  return (
    <section className=" csw dark:bg-black flex justify-center items-center dark:text-white h-[calc(100vh-4rem)]">

    <form onSubmit={handleSubmit} className="flex flex-col  items-center border border-black-bg h-[55%] w-[50%] rounded-lg ">
      <h1 className="text-3xl mt-5 mb-7">SignUp</h1>
      
      <div className="relative mb-1 input-div">
            <input
              className="dark:bg-black my-1 pl-1 py-1 w-full peer "
              type="text"
              id="name"
              name="name"
              placeholder=""
              value={formData.name}
              onChange={handleChange}
              required
            />
            <label
              htmlFor="name"
                      className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-500 transition-all duration-200 ease-in-out 
                       peer-placeholder-shown:top-1/2 
                       peer-placeholder-shown:left-1 
                       peer-placeholder-shown:-translate-y-1/2
                       peer-placeholder-shown:text-base 
                       peer-focus:top-0 
                       peer-focus:left-3 
                       peer-focus:-translate-y-1/3 
                       peer-focus:text-xs 
                       peer-focus:font-semibold 
                       peer-focus:text-black 
                       dark:peer-focus:text-white 
                       bg-white dark:bg-black"
            >
              Name
            </label>
          </div>

      
      <div className="relative">
            <input
              className="dark:bg-black my-1 pl-1 py-1 w-full peer "
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label
              htmlFor="email"
              className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-500 transition-all duration-200 ease-in-out 
                       peer-placeholder-shown:top-1/2 
                       peer-placeholder-shown:left-1 
                       peer-placeholder-shown:-translate-y-1/2
                       peer-placeholder-shown:text-base 
                       peer-focus:top-0 
                       peer-focus:left-3 
                       peer-focus:-translate-y-1/3 
                       peer-focus:text-xs 
                       peer-focus:font-semibold 
                       peer-focus:text-black 
                       dark:peer-focus:text-white 
                       bg-white dark:bg-black"
            >
              Email
            </label>
          </div>      
     
          <div className="relative mb-7">
            <input
              className="dark:bg-black my-1 pl-1 py-1 w-full peer "
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <label
              htmlFor="password"
              className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-500 transition-all duration-200 ease-in-out 
                       peer-placeholder-shown:top-1/2 
                       peer-placeholder-shown:left-1 
                       peer-placeholder-shown:-translate-y-1/2
                       peer-placeholder-shown:text-base 
                       peer-focus:top-0 
                       peer-focus:left-3 
                       peer-focus:-translate-y-1/3 
                       peer-focus:text-xs 
                       peer-focus:font-semibold 
                       peer-focus:text-black 
                       dark:peer-focus:text-white 
                       bg-white dark:bg-black"
            >
              Password
            </label>
          </div>
      
      <button type="submit"  className=" py-1 font-semibold text-black w-[215px] rounded-lg bg-theme mb-2">Submit</button>
      <span className="text-xs">

      Already have an account? <Link className="text-blue-600" href="/auth">LogIn.</Link>
      </span>
    </form>
  
</section>
  )
}
