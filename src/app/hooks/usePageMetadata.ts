"use client";

import { useLayoutEffect, useRef } from "react";
import { useMetadata } from "../context/MetadataProvider";

interface PageMetadataProps {
  title: string;
  description: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
}

export function usePageMetadata(props: PageMetadataProps) {
  const { updateMetadata } = useMetadata();
  const hasUpdatedRef = useRef(false);
  const propsRef = useRef(props);

  // Use useLayoutEffect to run synchronously after render
  useLayoutEffect(() => {
    // Only update on initial mount or if props actually changed
    if (
      !hasUpdatedRef.current ||
      JSON.stringify(propsRef.current) !== JSON.stringify(props)
    ) {
      const currentMetadata = {
        title: props.title,
        description: props.description,
        keywords: props.keywords || [],
        ogTitle: props.ogTitle || props.title,
        ogDescription: props.ogDescription || props.description,
        ogImage: props.ogImage || "/assets/images/iittp-logo.png",
        ogUrl:
          props.ogUrl ||
          process.env.NEXT_PUBLIC_SITE_URL ||
          "https://cse.iittp.ac.in",
      };

      updateMetadata(currentMetadata);
      hasUpdatedRef.current = true;
      propsRef.current = props;
    }
  });

  // No cleanup - let each page manage its own metadata
}
