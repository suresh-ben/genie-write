"use client";
import React, { useEffect, useState } from "react";
import { getRecomendedUsers } from "@/actions/user";
import { getProfileColor } from "@/utils/profileColorPicker";
import { getRecomendedArticels } from "@/actions/article";
import { formatDate } from "@/utils/dateFormatter";
import SidebarUser from "./SidebarUser";
import Link from "next/link";

export default function Sidebar() {
    const [recomendedUsers, setRecomemdedUsers] = useState([]);
    const [recomendedArticles, setRecomendedArticles] = useState([]);

    const getRecommendedUsers = async () => {
        try {
            const users = await getRecomendedUsers();
            setRecomemdedUsers(users);
        } catch (error) {
            console.log(error);
        }
    };

    const getRecommendedArticles = async () => {
        try {
            const { articles } = await getRecomendedArticels();
            setRecomendedArticles(articles);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        (async () => {
            getRecommendedUsers();
            getRecommendedArticles();
        })();
    }, []);

    useEffect(() => {
        const sideMenu = document.getElementById("side-manager");

        window.addEventListener("scroll", () => {
            const distanceFromTop = sideMenu.getBoundingClientRect().top;

            if (distanceFromTop <= 0) {
                sideMenu.classList.add("fixed");
                sideMenu.classList.add("bottom-0");
                sideMenu.classList.add("right-0");
                sideMenu.classList.add("top-0");
            }
            if (window.scrollY <= 4 * 16) {
                sideMenu.classList.remove("fixed");
                sideMenu.classList.remove("bottom-0");
                sideMenu.classList.remove("right-0");
                sideMenu.classList.remove("top-0");
            }
        });
    }, []);

    return (
        <div
            id="side-manager"
            className="border-l border-gray-200 w-[30%] min-h-[calc(100vh-4rem)] p-[2rem] overflow-auto hidden sm:block"
        >
            <div>
                <p className="font-medium mb-4">Recomended Articles</p>

                <div className="flex flex-wrap gap-6">
                    {recomendedArticles.map((artcle, ind) => {
                        return (
                            <div key={ind} className="w-full flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <Link
                                        href={`/profile/${artcle?.createdBy}`}
                                        className="w-[1.4rem] h-[1.4rem] rounded-full flex justify-center items-center cursor-pointer"
                                        style={{
                                            backgroundColor: getProfileColor(artcle.authorName)
                                        }}
                                    >
                                        {artcle.authorImage ? (
                                            <img 
                                                src={artcle.authorImage}
                                                className="object-cover h-full w-full rounded-full"
                                                referrerPolicy="no-referrer"
                                            />
                                        ) : (
                                            <p className="font-medium text-white">
                                                {artcle.authorName[0]}
                                            </p>
                                        )}
                                    </Link>

                                    <Link
                                        className="text-sm hover:underline cursor-pointer"
                                        href={`/profile/${artcle?.createdBy}`}
                                    >
                                        {artcle?.authorName}
                                    </Link>
                                </div>

                                <Link
                                    href={`/article/${artcle?.slug}`}
                                >
                                    <p className="font-medium cursor-pointer mb-1">{artcle.heading}</p>
                                    <p className="text-xs">{formatDate(new Date(artcle.createdAt))}</p>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-8">
                <p className="font-medium mb-4">Who to follow</p>

                <div className="flex flex-col gap-6">
                    {recomendedUsers.map((user, ind) => {
                        return (
                            <SidebarUser 
                                key={ind}
                                user={user}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}