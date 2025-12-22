import './globals.css';
import type { Metadata } from 'next';

import AuthProvider from "./context/AuthProvider";

const siteBase = process.env.NEXT_PUBLIC_SITE_URL || 'https://cse.iittp.ac.in';

export const metadata: Metadata = {
  title: 'Computer Science & Engineering',
  description: 'Department of Computer Science & Engineering at IIT Tirupati',
  keywords: ['CSE IIT Tirupati', 'Computer Science Engineering', 'IIT Tirupati Department', 'Faculty', 'Research', 'Academics'],
  openGraph: {
    title: 'Computer Science & Engineering - IIT Tirupati',
    description: 'Department of Computer Science & Engineering at IIT Tirupati',
    url: siteBase,
    siteName: 'Department of CSE, IIT Tirupati',
    images: [
      {
        url: `${siteBase}/assets/images/iittp-logo.png`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Computer Science & Engineering - IIT Tirupati',
    description: 'Department of Computer Science & Engineering at IIT Tirupati',
    images: [`${siteBase}/assets/images/iittp-logo.png`],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
