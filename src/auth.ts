import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"

// NextAuth v5 兼容：同时支持 v4 的环境变量名
const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET
const url = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret,
  trustHost: true,
  ...(url ? { basePath: '/api/auth' } : {}),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    session({ session, token }) {
      if (token.sub) {
        (session.user as any).id = token.sub
      }
      return session
    },
  },
})
