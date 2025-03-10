import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Extend the Session type
   */
  interface Session {
    accessToken?: string;
    user: {
      id?: string;
      discordId?: string;
      discordUsername?: string;
      discordVerified?: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /** Extend the JWT type */
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    discordId?: string;
  }
} 