// app/signin/SignInForm.js (Client Component)
"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function SignInForm() {
  const searchParams = useSearchParams();
  const callbackUrlParam = searchParams?.get("callbackUrl");

  const callbackUrl = callbackUrlParam
    ? new URL(callbackUrlParam, window.location.origin).toString()
    : new URL("", window.location.origin).toString();

  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", {
        callbackUrl,
        redirect: true,
      });
    } catch (error) {
      console.error("Sign-in error:", error);
      alert("Sign-in failed. Please try again or contact support.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-md px-4 sm:px-6 lg:px-8">
      <div className="relative transform transition-all duration-500 ease-in-out hover:scale-[1.01]">
        <div className="backdrop-blur-xl bg-white/90 rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="relative px-8 pt-10 pb-6 text-center">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <Image
                src="/assets/images/iittp-logo.png"
                alt="IIT Tirupati Logo"
                width={128}
                height={128}
                priority
                className="object-contain"
                unoptimized
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              Department of Computer Science and Engineering
            </h1>
            <h2 className="text-xl font-semibold text-gray-700 mt-2">
              IIT Tirupati
            </h2>
            <div className="mt-6 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
            <h3 className="mt-6 text-2xl font-bold text-gray-800">
              Department Flow Portal
            </h3>
            <p className="mt-3 text-gray-600">
              Sign in with your institute email to access the portal
            </p>
          </div>

          <div className="px-8 pb-8">
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="group relative w-full flex items-center justify-center px-6 py-4 rounded-xl text-white overflow-hidden transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-900 group-hover:scale-102 transition-transform duration-300"></div>
              <div className="relative flex items-center">
                {isLoading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span className="text-base font-medium">Signing in...</span>
                  </div>
                ) : (
                  <>
                    <div className="bg-white p-2 rounded-lg mr-3 transform group-hover:scale-110 transition-transform duration-300">
                      <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                    </div>
                    <span className="text-base font-medium">
                      Sign in with Institute Email
                    </span>
                  </>
                )}
              </div>
            </button>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Only users with @iittp.ac.in email addresses are allowed
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a
            href="https://cse.iittp.ac.in"
            className="inline-flex items-center text-sm text-red-800 hover:text-red-300 transition-colors duration-300"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 18h6a2 2 0 002-2V8a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h6m0-6h6v6m-6-6V4m0 16v4m8-16v4m-8 12v4m8-12v4m-8 12v4m8-12v4"
              ></path>
            </svg>
            Visit the Department Website
          </a>
        </div>
      </div>
    </div>
  );
}
