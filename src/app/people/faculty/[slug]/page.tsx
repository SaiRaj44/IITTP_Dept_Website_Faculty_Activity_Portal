import ClientPage from "./ClientPage";
import type { Metadata } from "next";
import connectDB from "@/app/lib/mongodb";
import FacultyInformation from "@/app/models/website/faculty-information";

const siteBase = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// type MinimalFaculty = {
//   profileUrl?: string;
//   name?: string;
//   researchInterests?: string;
//   designation?: string;
//   imageUrl?: string;
//   email?: string;
// };

// Force dynamic rendering to avoid build-time API calls
export const dynamic = 'force-dynamic';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateMetadata(props: any): Promise<Metadata> {
  const { params } = props as { params: Promise<{ slug: string }> };
  const { slug } = await params;

  try {
    await connectDB();
    const faculty = await FacultyInformation.findOne({ profileUrl: slug, published: true, isActive: true });

    if (!faculty) {
      throw new Error("Faculty not found");
    }

    const isHOD = faculty.name?.toLowerCase().includes("sridhar chimalakonda");
    // const hodSuffix = isHOD ? " (Head of Department)" : "";
    const formattedSlug = slug.replace(/[-_]/g, " ").replace(/\b\w/g, l => l.toUpperCase()).replace(/\bProf\b/g, 'Prof.').replace(/\bDr\b/g, 'Dr.');
    // const title = `${formattedSlug}${hodSuffix}`;
    const title = `${formattedSlug}`;

    
    const kewyworddesignation = isHOD ? `Head of the Department and ${faculty.designation}` : faculty.designation || "";
    const designation = isHOD ? `Head of the Department and ${faculty.designation} at the Department of CSE` : `${faculty.designation} at the Department of CSE`;
    const keywordresearch = faculty.researchInterests || "";

    const research = faculty.researchInterests ? `Research Interest: ${faculty.researchInterests}` : "";
    const email = faculty.email || "";
    const descriptionParts = [designation, research, email].filter(Boolean);
    const description = descriptionParts.length > 0 
      ? descriptionParts.join(" | ") 
      : "Faculty profile — Department of CSE, IIT Tirupati";
    
    const image = faculty.imageUrl ? (faculty.imageUrl.startsWith("http") ? faculty.imageUrl : `${siteBase}${faculty.imageUrl}`) : `${siteBase}/assets/images/iittp-logo.png`;
    const url = `${siteBase}/people/faculty/${slug}`;

    // Generate dynamic keywords
    const dynamicKeywords = [
      faculty.name,
      "CSE IIT Tirupati",
      `${kewyworddesignation} - CSE`,
      keywordresearch,
      "iit tirupati cse",
      "iit tirupati faculty",
      "Computer Science Engineering",
      "IITTP faculty profile",
      "Official Faculty Profile",
    ].filter(Boolean);

    return {
      title,
      description,
      keywords: dynamicKeywords as string[],
      alternates: {
        canonical: url,
      },
      openGraph: {
        title,
        description,
        url,
        images: [{ url: image, width: 1200, height: 630 }],
        siteName: "Department of CSE, IIT Tirupati",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },
    };
  } catch {
    return {
      title: `${slug.replace(/[-_]/g, " ")} — Department of CSE, IIT Tirupati`,
      description: "Faculty profile — Department of CSE, IIT Tirupati",
      openGraph: {
        title: `${slug.replace(/[-_]/g, " ")} — Department of CSE, IIT Tirupati`,
        description: "Faculty profile — Department of CSE, IIT Tirupati",
        url: `${siteBase}/people/faculty/${slug}`,
        images: [{ url: `${siteBase}/assets/images/iittp-logo.png`, width: 1200, height: 630 }],
      },
      twitter: {
        card: "summary_large_image",
        title: `${slug.replace(/[-_]/g, " ")} — Department of CSE, IIT Tirupati`,
        description: "Faculty profile — Department of CSE, IIT Tirupati",
        images: [`${siteBase}/assets/images/iittp-logo.png`],
      },
    };
  }
}

// Accept flexible props shape provided by Next.js router
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function Page(props: any) {
  const params = props?.params as Promise<{ slug: string }>;
  const { slug } = await params;
  return <ClientPage slug={slug} />;
}

