import './globals.css';
import type { Metadata } from 'next';
import { MetadataProvider } from './context/MetadataProvider';
import ClientLayout from './ClientLayout';

const siteBase = process.env.NEXT_PUBLIC_SITE_URL || 'https://cse.iittp.ac.in';

// Default metadata (can be overridden by client)
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
      <head />
      <body suppressHydrationWarning>
        <MetadataProvider>
          <ClientLayout>{children}</ClientLayout>
        </MetadataProvider>
      </body>
    </html>
  );
}