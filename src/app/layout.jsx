import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

import Header from "@/components/layout/Header";
import getUserData from "@/utils/getUserData";
import { redirect } from "next/navigation";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "Genie Write",
    description: "An AI application to write articles for you on any topic.",
};

export default async function RootLayout({ children }) {
    const currentPath = (await headers()).get("x-current-path");
    const user = await getUserData();

    if (
        !user &&
        !(currentPath.includes("auth") || currentPath.includes("about"))
    ) {
        console.log("redirecting, Need authentication");
        redirect("/auth");
    }

    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                {user && (
                    <main>
                        <Header
                            userName={user.name}
                            userImageUrl={user.image}
                            email={user.email}
                            userId={user._id.toString()}
                        />

                        <div className="">{children}</div>
                    </main>
                )}
                {!user && <>{children}</>}
            </body>
        </html>
    );
}
