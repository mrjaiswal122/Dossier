'use client';
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handlePortfolioCreation = async () => {
    if (status === "loading") return; // Wait for the session to load
    if (session?.user) {
      try {
        const response = await axios.get('/api/existing-portfolio', {
          params: { email: session.user.email }
        });

        if (response.data.msg === 'existing user') {
          router.push(`/${response.data.username}`);
        } else {
          router.push('/create-portfolio');
        }
      } catch (error) {
        console.error("Error fetching portfolio:", error);
        // You could add user feedback here, like a toast or message
      }
    } else {
      // router.push('/auth');
      try{
      const response = await axios.get('/api/check-login');
      if(response.data.msg=='Show User' && response.data.data.username!==''){
        router.push(`/${response.data.data.username}`)
      }else if(response.data.msg=='Show User' && response.data.data.username===""){
        router.push('/create-portfolio'); 
      }else{
            router.push('/auth');
      }
      }catch(error){
       console.log(error);
       
      }
    }
  };

  return (
    <main className="h-[100vh] dark:bg-black dark:text-white flex gap-6 justify-center items-center">
      <button className=" bg-theme rounded-lg p-3" onClick={handlePortfolioCreation}>
        Create Portfolio
      </button>
    {session?.user?"": <a href="/auth" className="backdrop-blur-sm border p-3 rounded-lg">
        LOGIN
      </a>}
     

    </main>
  );
}
