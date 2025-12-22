// app/signin/page.js (Server Component)
import { Suspense } from 'react';
import Image from 'next/image';
import SignInForm from './SignInForm';

export default function SignInPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 opacity-10"></div>
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      </div>

      <Suspense fallback={
        <div className="relative w-full max-w-md px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-32 h-32 mx-auto mb-6 relative">
            <Image
              src="/assets/images/iittp-logo.png"
              alt="Loading IIT Tirupati Logo"
              width={128}
              height={128}
              priority
              className="object-contain animate-pulse"
              unoptimized
            />
          </div>
          <p className="text-gray-600">Loading authentication options...</p>
        </div>
      }>
        <SignInForm />
      </Suspense>
    </div>
  );
}