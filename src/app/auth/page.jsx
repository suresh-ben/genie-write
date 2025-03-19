import { Playfair_Display } from "next/font/google";
import React from "react";
import Auth from "./components/Auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import getUserData from "@/utils/getUserData";
import Link from "next/link";

const playfairDisplay = Playfair_Display({
    variable: "--font-playfair-display",
    subsets: ["latin"],
});

export default async function page() {
    const user = await getUserData();
    if (user) redirect("/");

    return (
        <main className="h-screen w-screen flex flex-col">
            <Auth />
            <header className="h-[4.5rem] border-b flex justify-between items-center px-[10%]">
                <div>
                    <p
                        className={`text-2xl font-bold cursor-pointer ${playfairDisplay.className}`}
                    >
                        GeineWrite
                    </p>
                </div>

                <div className="flex gap-8 text-sm">
                    <button className="auth cursor-pointer hidden sm:block">
                        <p>Write</p>
                    </button>

                    <button className="auth cursor-pointer hidden sm:block">
                        <p>Sign In</p>
                    </button>

                    <button className="auth cursor-pointer bg-black text-white py-2 px-4 rounded-full">
                        Get Started
                    </button>
                </div>
            </header>

            <div className="h-[calc(100%-8.5rem)] flex">
                <div
                    className={`flex flex-col justify-center items-start h-full pl-[10%] text-4xl sm:text-8xl`}
                >
                    <p className={`${playfairDisplay.className}`}>
                        Artificial Intelligence
                    </p>
                    <p className={`${playfairDisplay.className}`}>
                        stories & ideas
                    </p>

                    <p className="text-lg sm:text-xl mt-6">
                        A place to read, write, and deepen your understanding
                    </p>

                    <button className="auth text-white bg-black rounded-full py-2 px-10 text-xl mt-10 cursor-pointer">
                        Start reading
                    </button>
                </div>

                <div className="h-full flex-1 hidden xl:block relative">
                    <Image
                        className="object-cover h-full w-full"
                        src="/intro.png"
                        alt="AI"
                        fill
                    />
                </div>
            </div>

            <footer className="h-[4rem] border-t flex justify-center items-center text-sm">
                <Link className="cursor-pointer" href={"/about"}>
                    <p>About</p>
                </Link>
            </footer>
        </main>
    );
}
