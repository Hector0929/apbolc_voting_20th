import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"
import type { NextAuthConfig } from "next-auth"

// LINE Provider configuration (custom)
const LineProvider = {
    id: "line",
    name: "LINE",
    type: "oauth" as const,
    authorization: {
        url: "https://access.line.me/oauth2/v2.1/authorize",
        params: { scope: "profile openid email" }
    },
    token: "https://api.line.me/oauth2/v2.1/token",
    userinfo: "https://api.line.me/v2/profile",
    profile(profile: any) {
        return {
            id: profile.userId,
            name: profile.displayName,
            email: profile.email,
            image: profile.pictureUrl,
        }
    },
    clientId: process.env.LINE_CLIENT_ID,
    clientSecret: process.env.LINE_CLIENT_SECRET,
}

export const authConfig: NextAuthConfig = {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        Facebook({
            clientId: process.env.FACEBOOK_CLIENT_ID!,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
        }),
        LineProvider as any,
    ],
    pages: {
        signIn: '/',
    },
    callbacks: {
        async session({ session, token }) {
            if (token) {
                session.user.id = token.sub!
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id
            }
            return token
        },
    },
    session: {
        strategy: "jwt",
    },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
