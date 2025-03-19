"use server";
import { signIn, signOut } from "@/lib/auth";

export const signInWithCredentials = async (formData) => {
    await signIn("credentials", formData);
}

export const signInWithGoogle = async () => {
    await signIn("google", { redirectTo: "/" });
}

export const signOutUser = async () => {
    await signOut();
}