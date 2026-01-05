import React from "react";

type Props = { params: { slug: string } };

type MinimalFaculty = {
  profileUrl?: string;
  name?: string;
  researchInterests?: string;
  designation?: string;
  imageUrl?: string;
};

export default async function Head({ params }: Props) {
  const { slug } = params;
  const siteBase = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  try {
    const res = await fetch(`${siteBase}/api/public/faculty-information?limit=500`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch faculty data");

    const data = await res.json();
    const list = Array.isArray(data) ? data : data.data || [];
    const faculty = (list as MinimalFaculty[]).find((f) => f.profileUrl === slug) || null;

    const name = faculty?.name || slug.replace(/[-_]/g, " ");
    const description =
      faculty?.researchInterests?.slice(0, 160) ||
      faculty?.designation ||
      "Faculty profile — Department of CSE, IIT Tirupati";
    const image = faculty?.imageUrl
      ? faculty.imageUrl.startsWith("http")
        ? faculty.imageUrl
        : `${siteBase}${faculty.imageUrl}`
      : `${siteBase}/assets/images/iittp-logo.png`;
    const url = `${siteBase}/people/faculty/${slug}`;

    return (
      <>
        <title>{`${name} — Department of CSE, IIT Tirupati`}</title>
        <meta name="description" content={description} />

        {/* Open Graph */}
        <meta property="og:title" content={`${name} — Department of CSE, IIT Tirupati`} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={image} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${name} — Department of CSE, IIT Tirupati`} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
      </>
    );
  } catch {
    const fallbackTitle = `${slug.replace(/[-_]/g, " ")} — Department of CSE, IIT Tirupati`;
    const fallbackDesc = "Faculty profile — Department of CSE, IIT Tirupati";
    const fallbackImage = `${siteBase}/assets/images/iittp-logo.png`;

    return (
      <>
        <title>{fallbackTitle}</title>
        <meta name="description" content={fallbackDesc} />
        <meta property="og:title" content={fallbackTitle} />
        <meta property="og:description" content={fallbackDesc} />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={`${siteBase}/people/faculty/${slug}`} />
        <meta property="og:image" content={fallbackImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fallbackTitle} />
        <meta name="twitter:description" content={fallbackDesc} />
        <meta name="twitter:image" content={fallbackImage} />
      </>
    );
  }
}
