'use client';
import Image from "next/image";
import axios from "axios";
import { cookies } from "next/headers";

type ProfileProps = {
  user: {
    name: string;
    email: string;
    imageUrl: string;
    role: string;
  };
};

export default function Profile({ user }: ProfileProps) {
    
  const handleProfileSection = () => {
    const themeSection = document.getElementById("profileSection");
    themeSection?.classList.toggle("hidden");
  };
const logout = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
e.stopPropagation();
//calling logout api  on the server because cookies is protected
axios.get('/api/logout').then((response)=>{
  window.location.href = '/';
}).catch((err) => {console.log(err)});

}
  return (
    <>
      <div
        className="  rounded-full outline outline-black dark:outline-white hover:outline-theme transition-all ease-in-out duration-300"
        onClick={handleProfileSection}
      >
        <Image width={20} height={20} src={user.imageUrl} alt={user.name} />
      </div>
      <section
        id="profileSection"
        className="hidden absolute top-0 right-0 inset-0 w-[100vw] h-[100vh]"
        onClick={handleProfileSection}
      >
        <div className="fixed w-full h-full mx-auto">
          <div className="csw h-full relative">
            <section className=" absolute  dark:bg-black-bg dark:border-none border-black-icon border dark:text-white w-36 h-24 py-2  rounded-lg top-20 right-3 " onClick={e=>e.stopPropagation()}>
             <button onClick={logout}>Logout</button>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}
