import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { options } from "./options";
import { getRole } from "./options";

// Define the basePath for use in callbacks
const basePath = "";

// Use standard NextAuth setup with explicit callback URL
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "select_account",
          hd: "iittp.ac.in",
          // Match exactly what's in Google console
          redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        },
      },
      profile(profile) {
        if (!profile.email?.endsWith("@iittp.ac.in")) {
          throw new Error("Only emails ending with @iittp.ac.in are allowed.");
        }

        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture || null,
          role: getRole(profile.email),
        };
      },
    }),
  ],
  // Copy over the callbacks from the options
  callbacks: {
    ...options.callbacks,
    async redirect({ url, baseUrl }) {
      console.log("NextAuth redirect:", { url, baseUrl });

      // Handle callback URLs specifically - redirect to dashboard
      if (
        url.includes("/callback/google") ||
        url.includes("/api/auth/callback")
      ) {
        return `${baseUrl}/dashboard`;
      }

      // If the URL is absolute, use it directly
      if (url.startsWith("http")) {
        return url;
      }

      // For dashboard redirect
      if (url === "/dashboard" || url === `${basePath}/dashboard`) {
        return `${baseUrl}/dashboard`;
      }

      // For relative URLs, ensure they have the basePath
      if (url.startsWith("/")) {
        if (url.startsWith(basePath)) {
          return url;
        }
        return `${basePath}${url}`;
      }

      // Default to dashboard
      return `${baseUrl}/dashboard`;
    },
  },
  pages: options.pages,
  debug: process.env.NODE_ENV === "production",
});

export { handler as GET, handler as POST };
