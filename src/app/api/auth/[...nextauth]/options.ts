import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectMongoDB from "../../../lib/mongodb";
import UserLog from "../../../models/auth/UserLog";
import User from "../../../models/auth/User";

interface UserProfile {
  id?: string;
  name?: string;
  email?: string;
  image?: string;
  role?: string;
  googleId?: string;
}

interface DbUser {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
  googleId?: string;
  save?: () => Promise<void>;
}

export const getRole = (email: string): string => {
  // Role determination based on email
  const roleMap: { [key: string]: string } = {
    "webmaster_cse@iittp.ac.in": "admin",
    "sairaj@iittp.ac.in": "admin",
    "abhijit@iittp.ac.in": "staff",
    "cse_office@iittp.ac.in": "staff",
    "at250015@iittp.ac.in": "staff",

    "ramana@iittp.ac.in": "faculty",
    "ch@iittp.ac.in": "faculty",
    "ykalidas@iittp.ac.in": "faculty",
    "rama@iittp.ac.in": "faculty",

    "ajin@iittp.ac.in": "faculty",
    "jtt@iittp.ac.in": "faculty",
    "mahendran@iittp.ac.in": "faculty",
    "raghavendra@iittp.ac.in": "faculty",
    "raja@iittp.ac.in": "faculty",
    "chalavadivishnu@iittp.ac.in": "faculty",
    "varshabhat@iittp.ac.in": "faculty",
  };

  if (roleMap[email]) return roleMap[email];
  if (/^cs\d{2}[a-z]{1,3}\d{3}@iittp\.ac\.in$/.test(email)) return "student";
  if (/^cs21b0\d{2}@iittp\.ac\.in$/.test(email)) return "student"; // cs21b0xx for student
  if (
    /^cs21d\d{3}@iittp\.ac\.in$/.test(email) ||
    /^cs21s\d{3}@iittp\.ac\.in$/.test(email)
  )
    return "scholar"; // cs21dxxx or cs21sxxx for scholar
  return "user";
};

const handleUserCreationOrUpdate = async (
  user: UserProfile
): Promise<DbUser> => {
  let dbUser = await User.findOne({ email: user.email });

  const role = getRole(user.email || "");

  if (!dbUser) {
    dbUser = await User.create({
      name: user.name,
      email: user.email,
      image: user.image,
      role,
      googleId: user.id,
    });
    console.log("New user created:", user.email);
  } else {
    if (dbUser.role !== role) {
      dbUser.role = role;
      await dbUser.save();
    }
  }
  return dbUser;
};

const logUserActivity = async (
  user: UserProfile,
  dbUser: DbUser
): Promise<void> => {
  await UserLog.create({
    userId: dbUser._id.toString(),
    name: user.name || "Unknown",
    email: user.email || "Unknown",
    loginMethod: "google",
    loginTimestamp: new Date(),
    ipAddress: undefined, // Capture from the request if needed
    userAgent: undefined, // Capture from the request if needed
  });
};

export const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "select_account",
          hd: "iittp.ac.in",
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
          image: profile.picture,
          role: getRole(profile.email),
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "user"; // Add role to the token
        token.email = user.email;
        // Ensure image is passed to the token
        if (user.image) {
          token.picture = user.image;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string; // Add role to the session
        session.user.email = token.email as string;
        // Ensure image is passed to the session
        if (token.picture) {
          session.user.image = token.picture as string;
        }
      }
      return session;
    },
    async signIn({ user }) {
      try {
        if (!user.email?.endsWith("@iittp.ac.in")) {
          console.error("Access denied: Invalid email domain");
          return false;
        }

        await connectMongoDB();

        const userProfile: UserProfile = {
          id: user.id,
          name: user.name || undefined, // Ensure name is string | undefined
          email: user.email || undefined, // Ensure email is string | undefined
          image: user.image || undefined, // Ensure image is string | undefined
          role: "user", // Default role, will be updated later
        };
        const dbUser = await handleUserCreationOrUpdate(userProfile);
        await logUserActivity(userProfile, dbUser);
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      const basePath = "";

      // Handle absolute URLs
      if (url.startsWith("http")) {
        return url;
      }

      // Handle callback URLs - redirect to home
      if (url.includes("/api/auth/callback")) {
        // Make sure we return to the base path
        return baseUrl;
      }

      // Handle relative URLs with proper basePath
      if (url.startsWith("/")) {
        // If URL already has basePath, don't duplicate it
        if (url.startsWith(basePath)) {
          return url;
        }

        // Otherwise add the basePath
        return `${basePath}${url}`;
      }

      // Default to home page with basePath
      return baseUrl;
    },
  },
  pages: {
    signIn: "/signin",
    error: "/auth/error",
  },
};
