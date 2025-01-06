"use client";
import React, { useState } from "react";
import EmailStep from "./EmailStep";
import OtpStep from "./OtpStep";
import PasswordStep from "./PasswordStep";
import axios from "axios";
import { useAppDispatch } from "@/app/_store/hooks";
import { setToastMsgRedux } from "@/app/_features/toastMsg/toastMsgSlice";
import { useRouter } from "next/navigation";
type Step = "email" | "otp" | "password";

export default function ForgotPassword() {
  const router=useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const dispatch = useAppDispatch();
  const handleEmailSubmit = async (email: string) => {
    //check if email exists and is userType of manuual and isVerified =true and then send the email with OPT and store this OPT with email in Redis
    try {
      const sendOpt = await axios.get(`/api/send-otp?email=${email}`);
      // console.log(sendOpt);

      if (sendOpt.data.success) {
        setStep("otp");
        setEmail(email);
      }
    } catch (error: any) {
      if (error.response.message)
        dispatch(
          setToastMsgRedux({ msg: `${error.response.msg}`, type: "error" })
        );
      else
        dispatch(
          setToastMsgRedux({ msg: "Something went wrong.", type: "error" })
        );
      setEmail("");
    }

    // TODO: Implement actual API call to verify email
  };

  const handleOtpSubmit = async (otp: string) => {
    // TODO: Implement actual API call to verify OTP
    try {
      const verify = await axios.post("/api/verify-otp", { otp, email });
      if (verify.data.success) {
        dispatch(
          setToastMsgRedux({ msg: "Otp verified successfully", type: "msg" })
        );
        setStep("password");
      }
    } catch (error: any) {
      if (error.response.message)
        dispatch(
          setToastMsgRedux({ msg: `${error.response.msg}`, type: "error" })
        );
      else
        dispatch(
          setToastMsgRedux({ msg: "Something went wrong.", type: "error" })
        );
    }
  };

  const handlePasswordSubmit = async (password: string) => {
    // TODO: Implement actual API call to reset password
    try {
      
      const reset=await axios.post("/api/reset-password",{password,email})
      if (reset.data.success) {
           dispatch(
             setToastMsgRedux({ msg: "Password changed successfully.", type: "msg" })
           );
       router.replace('/auth');
         }
    }  catch (error: any) {
      if (error.response.message)
        dispatch(
          setToastMsgRedux({ msg: `${error.response.msg}`, type: "error" })
        );
      else
        dispatch(
          setToastMsgRedux({ msg: "Something went wrong.", type: "error" })
        );
    }
   
  };

  const handleBack = () => {
    switch (step) {
      case "otp":
        setStep("email");
        break;
      case "password":
        setStep("otp");
        break;
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-black-bg p-8 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-whites mb-6 text-center">
          Reset Password
        </h2>

        {step === "email" && <EmailStep onSubmit={handleEmailSubmit} />}
        {step === "otp" && (
          <OtpStep
            email={email}
            onSubmit={handleOtpSubmit}
            onBack={handleBack}
          />
        )}
        {step === "password" && (
          <PasswordStep onSubmit={handlePasswordSubmit} onBack={handleBack} />
        )}
      </div>
    </div>
  );
}
