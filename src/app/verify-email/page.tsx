"use client";
import { useState, useEffect } from "react";
import { useSearchParams ,useRouter} from "next/navigation";
import { Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { useAppDispatch } from "../_store/hooks";
import { setToastMsgRedux } from "../_features/toastMsg/toastMsgSlice";

type VerificationStatus =
  | "loading"
  | "success"
  | "invalid-token"
  | "error"
  | "no-token";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [status, setStatus] = useState<VerificationStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const queryParams = useSearchParams();
  const token = queryParams.get("token");
  const dispatch=useAppDispatch()
    const reloadPage = () => {
    router.refresh()
  };

  useEffect(() => {
    if (!token) {
      setStatus("no-token");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await axios.post(
          "/api/verify-email",
          { token },
          { headers: { "Content-Type": "application/json" } }
        );
       if(response.data.success){

         setStatus("success");
       }

      } catch (error:any) {
        setStatus("error")
        setErrorMessage(`${error.response?.message}`)
        switch (error.response?.status) {
          case 400:
            dispatch(setToastMsgRedux({msg:"Token is required",type:"error"}))
            break;
          case 401:
            dispatch(setToastMsgRedux({msg:`${error.response.message}`,type:"error"}))
            break;
            case 404:
            dispatch(setToastMsgRedux({msg:"No user to verify",type:"error"}))
            break;
            case 403:
            setStatus("invalid-token")
            dispatch(setToastMsgRedux({msg:"Verification token mismatch",type:"error"}))
            break;
          default:
            dispatch(setToastMsgRedux({msg:"Something went wrong",type:"error"}))

            break;
        }
       
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 dark:text-white text-black">
      <div className="max-w-md w-full bg-card rounded-lg shadow-lg p-8 text-center">
        {status === "loading" && (
          <div className="space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <h2 className="text-2xl font-semibold text-foreground">
              Verifying your email
            </h2>
            <p className="text-muted-foreground">
              Please wait while we verify your email address...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
            <h2 className="text-2xl font-semibold text-foreground">
              Email Verified!
            </h2>
            <p className="text-muted-foreground">
              Your email has been successfully verified. You can now access all
              features of your account.
            </p>
            <Link
              href="/auth"
              className="inline-block mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Continue to Login
            </Link>
          </div>
        )}
       {/* If no token  */}
        {status === "no-token" && (
          <div className="space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
            <h2 className="text-2xl font-semibold text-foreground">
              Invalid Request
            </h2>
            <p className="text-muted-foreground">
              No verification token was provided. Please use the link from your
              verification email.
            </p>
          </div>
        )}


        

        {status === "invalid-token" && (
          <div className="space-y-4">
            <XCircle className="h-12 w-12 text-destructive mx-auto" />
            <h2 className="text-2xl font-semibold text-foreground">
              Invalid Link
            </h2>
            <p className="text-muted-foreground">
              This verification link is invalid. Please request a new
              verification email.
            </p>
            <Link
              href="/resend-verification"
              className="inline-block mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Request New Link
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <XCircle className="h-12 w-12 text-destructive mx-auto" />
            <h2 className="text-2xl font-semibold text-foreground">
              Verification Failed
            </h2>
            <p className="text-muted-foreground">{errorMessage}</p>
            <div className="flex flex-col gap-2">
              <button 
              type='button'

               onClick={reloadPage}

                className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Try Again
              </button>
              <Link
                href="/support"
                className="inline-block px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
