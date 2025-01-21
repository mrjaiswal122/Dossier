'use client';
import axios from "axios";
import { BookOpen, Briefcase, Layout, Palette, Rocket, Sparkles, Trophy } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaArrowRight } from "react-icons/fa6";
import { useAppDispatch, useAppSelector } from "./_store/hooks";
import { setToastMsgRedux } from "./_features/toastMsg/toastMsgSlice";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const user=useAppSelector(state=>state.userSlice)
  const dispatch=useAppDispatch()
  const handlePortfolioCreation = async () => {
    if (status === "loading") return; // Wait for the session to load
    if (session?.user || user.email) {
      try {
        const response = await axios.get('/api/existing-portfolio', {
          params: { email: user.email }
        });

        if (response.data.msg === 'existing user') {
          router.push(`/${response.data.username}`);
        } else if(response.data.msg==="new user") {
          router.push('/create-portfolio');
        }else{
        }
      } catch (error:any) {
        dispatch(setToastMsgRedux({msg:error.response.msg}))
      }
    } else {
      router.push('/auth');
     
    }
  };

  return (
    <>
   <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-black">
      {/* Gradient Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-30">
        <div className="absolute top-0 left-0 w-72 h-72 bg-theme blur-[120px] rounded-full"></div>
        <div className="absolute top-20 right-0 w-72 h-72 bg-theme-dark blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-blue-muted blur-[120px] rounded-full"></div>
      </div>

      <div className="container mx-auto text-center relative z-10">
        <div className="inline-block mb-6 px-6 py-2 rounded-full border border-theme/20 bg-black-bg/50 backdrop-blur-sm">
          <span className="text-theme">✨ Create your portfolio for free</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-whites via-theme-light to-theme bg-clip-text text-transparent">
          Build Your Portfolio in Minutes
        </h1>
        <p className="text-xl text-grays max-w-2xl mx-auto mb-12">
          Create stunning portfolio websites without coding. Showcase your work professionally with our intuitive builder.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="group bg-gradient-to-r from-theme to-theme-dark hover:opacity-90 text-black font-semibold px-8 py-3 rounded-lg transition-all flex items-center" onClick={handlePortfolioCreation}>
            Start Building Free 
            <FaArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
          </button>
          <button className="relative px-8 py-3 rounded-lg transition-all overflow-hidden group">
            <span className="absolute inset-0 bg-gradient-to-r from-theme/10 to-theme-dark/10 opacity-0  transition-opacity"></span>
            <span className="relative text-theme border border-theme rounded-lg px-8 py-3 hover:bg-theme hover:bg-opacity-20">
              View Examples
            </span>
          </button>
        </div>
        
        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-8 max-w-3xl mx-auto px-4 py-6 rounded-2xl bg-black-bg/50 backdrop-blur-sm border border-theme/10">
          {[
            { number: "10K+", label: "Portfolios Created" },
            { number: "98%", label: "Satisfaction Rate" },
            { number: "24/7", label: "Support" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-theme-light to-theme bg-clip-text text-transparent">
                {stat.number}
              </div>
              <div className="text-sm text-grays mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>



 {/* Features */}
      <section id="features" className="py-20 bg-black-bg text-whites">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Why Choose Dossier?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              
              {
                icon: <BookOpen className="w-12 h-12 text-theme" />,
                title: "Showcase Skills",
                description: "Add and manage your technical skills with beautiful visualizations and proficiency levels."
              },
              {
                icon: <Trophy className="w-12 h-12 text-theme" />,
                title: "Project Gallery",
                description: "Display your projects with rich media support, descriptions, and live demo links."
              },
              {
                icon: <Briefcase className="w-12 h-12 text-theme" />,
                title: "Experience Timeline",
                description: "Create an interactive timeline of your professional journey and achievements."
              },

              {
                icon: <Rocket className="w-12 h-12 text-theme" />,
                title: "Instant Deploy",
                description: "Deploy your portfolio instantly with one click and share it with the world."
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="bg-black p-8 rounded-xl hover:transform hover:-translate-y-2 transition-all duration-300 border border-theme/10"
              >
                {feature.icon}
                <h3 className="text-xl font-semibold mt-4 mb-2">{feature.title}</h3>
                <p className="text-grays">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Growing Feature Card */}
          <div className="mt-12 bg-gradient-to-r from-theme/10 via-theme-dark/10 to-theme/10 p-1 rounded-xl">
            <div className="bg-black p-8 rounded-lg flex flex-col md:flex-row items-center gap-6">
              <div className="bg-theme/10 p-4 rounded-full">
                <Sparkles className="w-12 h-12 text-theme" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-semibold mb-2">Constantly Evolving</h3>
                <p className="text-grays">
                  We{`\'`}re committed to making Dossier better every week. Our team is constantly adding new features, templates, and improvements based on user feedback.
                </p>
              </div>
              <div className="hidden md:flex items-center gap-3">
                <span className="inline-flex h-3 w-3 animate-ping rounded-full bg-theme opacity-75"></span>
                <span className="text-theme">New updates weekly</span>
              </div>
            </div>
          </div>
        </div>
      </section>

     
    </>
  );
}
