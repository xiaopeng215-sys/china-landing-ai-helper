import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"
import { hasCompletedOnboarding } from "@/lib/supabase/user-profile"

function buildProviders() {
  const providers = []
  const googleId = process.env.AUTH_GOOGLE_ID ?? process.env.GOOGLE_CLIENT_ID
  const googleSecret = process.env.AUTH_GOOGLE_SECRET ?? process.env.GOOGLE_CLIENT_SECRET
  const fbId = process.env.AUTH_FACEBOOK_ID ?? process.env.FACEBOOK_CLIENT_ID
  const fbSecret = process.env.AUTH_FACEBOOK_SECRET ?? process.env.FACEBOOK_CLIENT_SECRET

  if (googleId && googleSecret) {
    providers.push(Google({
      clientId: googleId,
      clientSecret: googleSecret,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }))
  }

  if (fbId && fbSecret) {
    providers.push(Facebook({
      clientId: fbId,
      clientSecret: fbSecret,
      checks: ['state'],
    }))
  }

  return providers
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  trustHost: true,
  providers: buildProviders(),
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
    async redirect({ url, baseUrl }) {
      // After OAuth sign-in: check if user has completed onboarding
      // We can't easily get userId here without the session, so we use a
      // special marker URL that the onboarding page handles.
      // The actual check happens client-side via the post-login redirect hook.
      if (url === baseUrl || url === `${baseUrl}/`) {
        return `${baseUrl}/auth/post-login`
      }
      // Allow relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`
      // Allow same-origin URLs
      if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
})
