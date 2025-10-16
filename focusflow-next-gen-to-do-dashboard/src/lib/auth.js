import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectToDatabase from "./mongodb";
export default NextAuth({
  providers: [GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
  })],
  callbacks: {
    async session({
      session,
      token
    }) {
      if (token && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({
      token,
      user
    }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
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
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // If url is external, redirect to dashboard
      if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/dashboard`;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  debug: process.env.NODE_ENV === 'development'
});