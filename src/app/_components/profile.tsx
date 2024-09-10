'use client';
import Image from "next/image";
import axios from "axios";
import { signOut } from "next-auth/react";
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

  const logout = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();

    try {
      // Calling logout API on the server
      await axios.get('/api/logout');
      // Redirect to home page or login page
      await signOut();
      window.location.href = '/';
    } catch (err) {
      console.error('Logout failed:', err);
      // Provide user feedback if necessary
      alert('Logout failed. Please try again.');
    }
  };

  return (
    <>
      <div
        className="rounded-full outline outline-black dark:outline-white hover:outline-theme transition-all ease-in-out duration-300 cursor-pointer"
        onClick={handleProfileSection}
        aria-label="Toggle profile section"
      >
        <Image width={20} height={20} src={user.imageUrl} alt={user.name} />
      </div>
      <section
        id="profileSection"
        className="hidden absolute top-0 right-0  w-[100vw] h-[100vh] bg-gray-800 bg-opacity-50 z-30"
        onClick={handleProfileSection}
        aria-label="Profile section"
      >
        <div className="fixed w-full h-full mx-auto">
          <div className="relative h-full">
            <section
              className="absolute dark:bg-black dark:border-none border-black border dark:text-white w-36 h-24 py-2 rounded-lg top-20 right-3 bg-white shadow-lg"
              onClick={e => e.stopPropagation()}
            >
              <button
                className="w-full py-1 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={logout}
              >
                Logout
              </button>
              <h1 className="text-center mt-2">{`Hello ${user.name}`}</h1>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}
