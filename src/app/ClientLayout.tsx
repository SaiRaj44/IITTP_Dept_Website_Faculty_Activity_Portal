"use client";

import { useEffect } from 'react';
import { useMetadata } from './context/MetadataProvider';
import AuthProvider from "./context/AuthProvider";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { metadata } = useMetadata();

  // Update document title and meta tags on client side
  useEffect(() => {
    // Update title
    document.title = metadata.title;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', metadata.description);
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords && metadata.keywords) {
      metaKeywords.setAttribute('content', metadata.keywords.join(', '));
    }

    // Update OG tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', metadata.ogTitle || metadata.title);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', metadata.ogDescription || metadata.description);
    }

    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage && metadata.ogImage) {
      const siteBase = process.env.NEXT_PUBLIC_SITE_URL || 'https://cse.iittp.ac.in';
      ogImage.setAttribute('content', `${siteBase}${metadata.ogImage}`);
    }

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl && metadata.ogUrl) {
      ogUrl.setAttribute('content', metadata.ogUrl);
    }

    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', metadata.ogTitle || metadata.title);
    }

    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', metadata.ogDescription || metadata.description);
    }

    const twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (twitterImage && metadata.ogImage) {
      const siteBase = process.env.NEXT_PUBLIC_SITE_URL || 'https://cse.iittp.ac.in';
      twitterImage.setAttribute('content', `${siteBase}${metadata.ogImage}`);
    }

  }, [metadata]);

  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          {children}
        </main>
      </div>
    </AuthProvider>
  );
}