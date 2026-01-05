export function getApiBaseUrl(): string {
  // In the browser, use window.location to determine the current port
  if (typeof window !== "undefined") {
    const { protocol, hostname, port } = window.location;
    const currentPort = port || (protocol === "https:" ? "443" : "80");
    return `${protocol}//${hostname}:${currentPort}`;
  }

  // On the server, fall back to the environment variable or default
  return process.env.NEXT_PUBLIC_API_URL || "https://cse.iittp.ac.in";
}
