'use client'
import { useSession } from "next-auth/react";
export default function Home() {
  const { data: session, status } = useSession();
  console.log(session?.user);
  
  // const session=useSession()
  const handlePortfolioCreation=()=>{
   console.log('testing');
   
  }
  return (
    <main className="h-[100vh] bg-black dark:text-white flex gap-6 justify-center items-center">
    <button className=" bg-theme rounded-lg" onClick={handlePortfolioCreation}>
      Create Portfolio
    </button>
    <button className="backdrop-blur-sm">
      LOGIN 
    </button>

    </main>
  );
}
