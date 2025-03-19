import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import {
    getUserById,
    signInOrUpByEmailOrSubAfterAuthentication,
    signInorUpWithPassword,
} from "@/actions/account";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google,
        Credentials({
            credentials: {
                name: { label: "Name", type: "text" },
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                const { name, email, password: rawPassword } = credentials;
                if (!email || !rawPassword)
                    throw new Error("Missing required fields");

                const user = await signInorUpWithPassword(
                    name,
                    email,
                    rawPassword
                );
                if (!user) throw new Error("Invalid credentials.");

                return user;
            },
        }),
    ],
    callbacks: {
        async signIn({ user, profile }) {
            // create user or retract the user
            const appUser = await signInOrUpByEmailOrSubAfterAuthentication(
                user.name,
                user.email,
                profile?.sub || "",
                user.image
            );
            if (!appUser) throw new Error("Invalid credentials.");

            return true;
        },
        async jwt({ token, user, profile }) {
            // create user or retract the user
            if (!token?._id) {
                const appUser = await signInOrUpByEmailOrSubAfterAuthentication(
                    user.name,
                    user.email,
                    profile?.sub || "",
                    user.image
                );
                if (!appUser) throw new Error("Invalid credentials.");

                token._id = appUser._id; // Ensuring consistent sub
            }

            return token;
        },
        async session({ session, token }) {
            session.user._id = token._id;
            return session;
        },
    },
});
