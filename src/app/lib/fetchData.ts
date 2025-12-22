export async function fetchData(endpoint: string) {
  // Use a proper base URL strategy based on the environment
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://cse.iittp.ac.in" // Replace with your actual domain
      : "https://cse.iittp.ac.in");

  try {
    // Add timeout to avoid hanging during build
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${baseUrl}${endpoint}`, {
      signal: controller.signal,
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    // During build, return empty data instead of failing
    if (
      process.env.NODE_ENV === "production" &&
      typeof window === "undefined"
    ) {
      console.log(`Build-time fetch skipped for ${endpoint}`);
      return { success: true, data: [] };
    }

    // In development/client-side, rethrow
    throw error;
  }
}
