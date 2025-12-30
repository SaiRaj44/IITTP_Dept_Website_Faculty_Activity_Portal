"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

interface MetadataState {
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
}

interface MetadataContextType {
  metadata: MetadataState;
  updateMetadata: (newMetadata: Partial<MetadataState>) => void;
  resetMetadata: () => void;
}

const defaultMetadata: MetadataState = {
  title: "Computer Science & Engineering",
  description: "Department of Computer Science & Engineering at IIT Tirupati",
  keywords: [
    "CSE IIT Tirupati",
    "Computer Science Engineering",
    "IIT Tirupati Department",
    "Faculty",
    "Research",
    "Academics",
  ],
  ogTitle: "Computer Science & Engineering - IIT Tirupati",
  ogDescription: "Department of Computer Science & Engineering at IIT Tirupati",
  ogImage: "/assets/images/iittp-logo.png",
  ogUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://cse.iittp.ac.in",
};

const MetadataContext = createContext<MetadataContextType | undefined>(
  undefined
);

export function useMetadata() {
  const context = useContext(MetadataContext);
  if (!context) {
    throw new Error("useMetadata must be used within MetadataProvider");
  }
  return context;
}

export function MetadataProvider({ children }: { children: ReactNode }) {
  const [metadata, setMetadata] = useState<MetadataState>(defaultMetadata);

  // Memoize update function to prevent unnecessary re-renders
  const updateMetadata = useCallback((newMetadata: Partial<MetadataState>) => {
    setMetadata((prev) => ({ ...prev, ...newMetadata }));
  }, []);

  // Memoize reset function
  const resetMetadata = useCallback(() => {
    setMetadata(defaultMetadata);
  }, []);

  return (
    <MetadataContext.Provider
      value={{ metadata, updateMetadata, resetMetadata }}
    >
      {children}
    </MetadataContext.Provider>
  );
}
