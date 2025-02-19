"use client";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FaGoogle } from "react-icons/fa6";
import { ArrowRight, Eye, EyeOff, Mail, User, Lock } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { setToastMsgRedux } from "@/features/toastMsg/toastMsgSlice";
export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const togglePasswordVisibility = (field: "password" | "confirmPassword") => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.confirmPassword != formData.password) {
      dispatch(
        setToastMsgRedux({ msg: "Password doesn't matches", type: "error" })
      );
      return;
    }
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("password", formData.password);

      const getMagicLink = await axios.post("/api/sendMagicLink", data);
      if (getMagicLink.data.success) {
        dispatch(
          setToastMsgRedux({
            msg: "Verification mail sent successfully",
            type: "msg",
            expire:false
          })
        );
      }
    } catch (error: any) {
      switch (error.response?.status) {
        case 422:
          dispatch(
            setToastMsgRedux({ msg: "All fields are required", type: "error" })
          );
          break;

        case 400:
          dispatch(
            setToastMsgRedux({ msg: "Invalid email format.", type: "error" })
          );
          break;

        case 409:
          dispatch(
            setToastMsgRedux({ msg: "User already exists.", type: "error" })
          );
          break;

        default:
          dispatch(
            setToastMsgRedux({ msg: "Something went wrong.", type: "error" })
          );
          break;
      }
    }
    setFormData({ name: "", password: "", email: "", confirmPassword: "" });
  };

  return (
    <section className=" relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-light to-white dark:from-black dark:to-black-bg pt-20">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-black dark:text-whites">
            Create Account
          </h2>
          <p className="mt-3 text-lg text-gray-600 dark:text-grays">
            Join Dossier to build your portfolio
          </p>
        </div>

        {/* Register Form */}
        <div className="bg-white dark:bg-black-bg rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-grays mb-2"
                >
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="name"
                    required={true}
                    value={formData.name}
                    aria-required="true"
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 dark:border-theme/10 bg-white dark:bg-black focus:ring-2 focus:ring-theme focus:border-transparent dark:text-whites transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-grays mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    aria-required="true"
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 dark:border-theme/10 bg-white dark:bg-black focus:ring-2 focus:ring-theme focus:border-transparent dark:text-whites transition-colors"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-grays mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword.password ? "text" : "password"}
                    id="password"
                    required={true}
                    value={formData.password}
                    aria-required="true"
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full pl-12 pr-12 py-3 rounded-lg border border-gray-200 dark:border-theme/10 bg-white dark:bg-black focus:ring-2 focus:ring-theme focus:border-transparent dark:text-whites transition-colors"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("password")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-grays transition-colors"
                  >
                    {showPassword.password ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div>
                <label
                  htmlFor="confirmPassword "
                  className="block text-sm font-medium text-gray-700 dark:text-grays mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword.confirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    aria-required="true"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full pl-12 pr-12 py-3 rounded-lg border border-gray-200 dark:border-theme/10 bg-white dark:bg-black focus:ring-2 focus:ring-theme focus:border-transparent dark:text-whites transition-colors"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirmPassword")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-grays transition-colors"
                  >
                    {showPassword.confirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                className="w-full bg-theme hover:bg-theme-dark text-black font-semibold px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center group"
              >
                Create Account
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-theme/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 text-gray-500 dark:text-grays bg-white dark:bg-black-bg">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Register */}
            <button
              className="w-full bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-black-bg2 text-gray-700 dark:text-whites font-semibold px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] border border-gray-200 dark:border-theme/10 flex items-center justify-center"
              onClick={() => signIn("google")}
            >
              <FaGoogle className="w-5 h-5 mr-2" />
              Continue with Google
            </button>

            {/* Login Link */}
            <p className="text-center text-gray-600 dark:text-grays mt-8">
              Already have an account?{" "}
              <Link
                href="/auth"
                scroll={true}
                className="text-theme hover:text-theme-dark font-semibold transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-sm text-gray-600 dark:text-grays pb-40">
          By creating an account, you agree to our{" "}
          <Link prefetch={false} href="/terms-of-service" className="text-theme hover:text-theme-dark">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link prefetch={false} href="/privacy-policy" className="text-theme hover:text-theme-dark">
            Privacy Policy
          </Link>
        </p>
      </div>
    </section>
  );
}
