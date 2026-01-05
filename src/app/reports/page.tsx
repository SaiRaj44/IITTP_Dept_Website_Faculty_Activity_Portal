'use client';

import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import Header from '@/app/components/layout/Header';
import Footer from '@/app/components/layout/Footer';
import Loading from '@/app/components/layout/Loading';
import GoogleSlidesReportGenerator from '../components/GoogleSlidesReportGenerator';

export default function ReportsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/signin');
    }
  }, [status, router, session]);

  if (status === 'loading') {
    return <Loading />;
  }
  
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Authentication Required
          </h1>
          <p className="text-gray-600 mb-6">
            Please sign in to access the Department Reports Generator.
          </p>
          <button
            onClick={() => window.location.href = '/api/auth/signin'}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const breadcrumbsItems = [
    { label: "Home", href: "/" },
    { label: "Reports" },
  ];

  const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Activity Portal", href: "/activity-portal" },
    { name: "Website Updates", href: "/website-updates" },
    { name: "Asset Management", href: "/asset-management" },
    { name: "Reports", href: "/reports", active: true },
 
  ];

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/signin" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header navItems={navItems} onSignOut={handleSignOut} />
      
      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                {breadcrumbsItems.map((item, index) => (
                  <li key={index}>
                    {item.href ? (
                      <>
                        <Link
                          href={item.href}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          {item.label}
                        </Link>
                        <span className="mx-2 text-gray-400">/</span>
                      </>
                    ) : (
                      <span className="text-gray-900 font-medium">
                        {item.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">
              Department Activity Reports
            </h1>
            <p className="mt-2 text-gray-600">
              Generate comprehensive PowerPoint presentations for department activities including publications, projects, workshops, conferences, and talks.
            </p>

         
          </div>

          {/* Report Generator Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start">
              
                <div className="ml-4">
                  <h2 className="text-xl font-bold text-gray-900">PowerPoint Report Generator</h2>
                  <p className="text-gray-600 mt-1">Create presentation slides with department activity data</p>
                </div>
              </div>
              
              {/* Main Report Generator Component */}
              <div className="mt-6">
                <GoogleSlidesReportGenerator />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}