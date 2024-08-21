'use client';
import Link from "next/link";
import axios from "axios";
import { useState } from "react";
import { redirect,useRouter } from "next/navigation";

export default function Auth() {
const [formData,setFormData]=useState<{email:string,password:string}>({email:'',password:''});
const router = useRouter();

  const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
    const input=e.target as HTMLInputElement;
    const label=document.querySelector(`label[for='${input.name}']`);
    setFormData({...formData,[input.name]:input.value});
    if(e.target.value==''){ 
      label?.classList.add('top-1/2');
      label?.classList.remove('text-xs');
    }else {
      label?.classList.remove('top-1/2');
      label?.classList.add('top-0');
      label?.classList.add('text-xs');
     }
  }
  const handleSubmit=async (e: React.FormEvent<HTMLFormElement>)=> {
    e.preventDefault();
    try{

      const response=await axios.post('/api/login',formData);
      console.log(response);
      
      if(response.data?.msg=='User Found'){
        router.push('/');
      }

    }catch(error){
      console.log(error);
      
    }
    // setFormData({email:'',password:''});
  }

  return (
    <>
      <section className=" csw dark:bg-black flex justify-center items-center dark:text-white h-[calc(100vh-4rem)]">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col  items-center border border-black-bg hover:border-black dark:hover:border-white  h-[50%] w-[50%] rounded-lg "
        >
          <h1 className="text-3xl mt-5 mb-7">Login</h1>
          <div className="relative">
            <input
              className="dark:bg-black my-1 pl-1 py-1 w-full peer "
              type="email"
              id="email"
              name="email"
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

          <button
            type="submit"
            className=" py-1 font-semibold text-black w-[215px] rounded-lg bg-theme mb-2"
          >
            Submit
          </button>
          <span className="text-xs">
            Don&apos;t have account?{" "}
            <Link
              className="text-blue-600 hover:text-blue-400"
              href="/auth/signup"
            >
              SignUp.
            </Link>
          </span>
        </form>
      </section>
    </>
  );
}
