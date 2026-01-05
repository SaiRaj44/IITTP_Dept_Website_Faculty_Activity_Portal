/**
 * Advanced publication formatting based on your example:
 * "Palit, A.,& Yeturu, K. (2025). Pooling Diverse Voices: Logarithmic Binary Fusion for Server-Side Pseudo-Labeling in Federated Learning.
 * In Proceedings of the Sixteenth Indian Conference on Computer Vision, Graphics and Image Processing (pages 7) Dec 17 - 20, 2025"
 */

export const formatPublicationAdvanced = (
  pub: {
    details: string;
    publication_date: string;
    type: string;
  },
  facultyName: string
): string => {
  try {
    // Extract and clean title from details
    const rawTitle = pub.details
      .replace(/<[^>]*>/g, "")
      .replace(/&[a-z]+;/g, " ")
      .trim();

    // Get year
    const year = pub.publication_date
      ? new Date(pub.publication_date).getFullYear()
      : new Date().getFullYear();

    // Format author (simplified - you might want to extract authors from your data)
    // Assuming faculty is the last author as per your example
    const authors = `${facultyName}`; // Simplified - you can add more logic here

    // Get conference/journal info
    const venue = pub.type || "Journal";

    // Try to extract additional info (pages, conference dates) if available in details
    let pages = "";
    let conferenceDates = "";

    // Example regex patterns (customize based on your data structure)
    const pagesMatch = rawTitle.match(/\(pages\s*(\d+)\)/i);
    if (pagesMatch) {
      pages = ` (pages ${pagesMatch[1]})`;
    }

    const dateMatch = rawTitle.match(
      /(Dec|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov)\s+\d+\s*-\s*\d+\s*,\s*\d{4}/i
    );
    if (dateMatch) {
      conferenceDates = ` ${dateMatch[0]}`;
    }

    // Construct the formatted string
    return `${authors}. (${year}). ${rawTitle}. In ${venue}${pages}${conferenceDates}`;
  } catch (error) {
    console.error("Error in advanced formatting:", error);
    return formatPublicationBasic(pub, facultyName);
  }
};

export const formatPublicationBasic = (
  pub: {
    details: string;
    publication_date: string;
    type: string;
  },
  facultyName: string
): string => {
  const title = pub.details
    .replace(/<[^>]*>/g, "")
    .replace(/&[a-z]+;/g, " ")
    .trim();

  const year = pub.publication_date
    ? new Date(pub.publication_date).getFullYear()
    : new Date().getFullYear();

  const venue = pub.type || "Journal";

  return `${facultyName}. (${year}). ${title}. ${venue}`;
};
