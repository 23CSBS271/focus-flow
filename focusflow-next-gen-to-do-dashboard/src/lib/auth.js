import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./mongodb";
export default NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
  })],
  callbacks: {
    async session({
      session,
      user
    }) {
      if (user && session.user) {
        session.user.id = user.id;
      }
      return session;
    },
    async signIn({
      user,
      account,
      profile
    }) {
      // Allow OAuth sign in
      return true;
    },
    async redirect({
      url,
      baseUrl
    }) {
      // Redirect to dashboard after successful sign in
      return baseUrl;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  debug: process.env.NODE_ENV === 'development'
});