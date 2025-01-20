"use client";
import Link from "next/link";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { ArrowRight, Eye, EyeOff, Mail,Lock } from "lucide-react";
import { FaGoogle } from "react-icons/fa6";
import { useAppDispatch } from "../_store/hooks";
import { setToastMsgRedux } from "../_features/toastMsg/toastMsgSlice";
import { updateUser } from "../_features/user/userSlice";
export default function Auth() {
  const [formData, setFormData] = useState<{ email: string; password: string }>(
    { email: "", password: "" }
  );
  const dispatch=useAppDispatch()
  const [showPassword,setShowPassword]=useState(false)
  const router = useRouter();
  const togglePasswordVisibility=()=>{
    setShowPassword(!showPassword)
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    setFormData({ ...formData, [input.name]: input.value });
  
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/login", formData);

      if (response.data?.success) {
       
        dispatch(updateUser(response.data.user))
        router.back();
        
      } else if (response.data?.msg && (typeof response.data.msg)=="string" ) {
          dispatch(setToastMsgRedux({msg:`${response.data.msg}`,type:"error"}))
      }
       else {
          dispatch(setToastMsgRedux({msg:"Something went wrong !!",type:"error"}))
      }
    }catch (error: any) {
      // Handle errors based on status codes
      if (error.response?.status === 409) {
        dispatch(setToastMsgRedux({ msg: "Try logging in with Google.", type: "error" }));
      } else if (error.response?.status === 403) {
        dispatch(setToastMsgRedux({ msg: "Account is not verified.", type: "error" }));
      } else if (error.response?.status === 401) {
        dispatch(setToastMsgRedux({ msg: "Invalid password.", type: "error" }));
      } else if (error.response?.status === 404) {
        dispatch(setToastMsgRedux({ msg: "No user found with this email.", type: "error" }));
      } else {
        dispatch(setToastMsgRedux({ msg: "An unexpected error occurred.", type: "error" }));
      }
    } finally {
      setFormData({ email: "", password: "" });
      
    }
  };

  return (
       <section className="min-h-screen flex items-center justify-center px-4 pt-20 sm:px-6 lg:px-8 bg-gradient-to-b from-light to-white dark:from-black dark:to-black-bg relative">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-black dark:text-whites">Welcome to Dossier</h2>
          <p className="mt-3 text-lg text-gray-600 dark:text-grays">Sign in to continue building your portfolio</p>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-black-bg rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-grays mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 dark:border-theme/10 bg-white dark:bg-black focus:ring-2 focus:ring-theme focus:border-transparent dark:text-whites transition-colors"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-grays mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-12 py-3 rounded-lg text-black border  border-gray-200 dark:border-theme/10 bg-white dark:bg-black focus:ring-2 focus:ring-theme focus:border-transparent dark:text-whites transition-colors"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-grays transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 rounded border-gray-300 text-theme focus:ring-theme"
                  />
                  <label htmlFor="remember" className="ml-2 text-sm text-gray-600 dark:text-grays">
                    Remember me
                  </label>
                </div>
                <Link href="/forgot-password" prefetch={false} className="text-sm text-theme hover:text-theme-dark transition-colors">
                  Forgot password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-theme hover:bg-theme-dark text-black font-semibold px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center group"
              >
                Sign In
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-theme/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 text-gray-500 dark:text-grays bg-white dark:bg-black-bg">Or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <button className="w-full bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-black-bg2 text-gray-700 dark:text-whites font-semibold px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] border border-gray-200 dark:border-theme/10 flex items-center justify-center"
            onClick={() => signIn("google")}>
              <FaGoogle className="w-5 h-5 mr-2" />
              Continue with Google
            </button>

            {/* Register Link */}
            <p className="text-center text-gray-600 dark:text-grays mt-8">
              Don&#39;t have an account?{' '}
              <Link href="/auth/signup" scroll={true} className="text-theme hover:text-theme-dark font-semibold transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-sm text-gray-600 dark:text-grays pb-40">
          By signing in, you agree to our{' '}
          <a href="#" className="text-theme hover:text-theme-dark">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-theme hover:text-theme-dark">
            Privacy Policy
          </a>
        </p>
      </div>
    </section>
  );
}
