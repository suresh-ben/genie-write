"use client";
import React, { useState, useEffect } from "react";
import { getUserDetailsById } from "@/actions/user";
import { PROFILE_CONTENT_TYPES } from "../utils/options";
import { getUserArticles } from "@/actions/article";
import { getProfileColor } from "@/utils/profileColorPicker";
import { formatDate } from "@/utils/dateFormatter";
import Follwer from "./Follwer";
import Link from "next/link";

export default function Profile({ userId, currentUserId, user, isFollowingUser, currentUserFollowers }) {

    const [isLoading, setIsLoading] = useState(false);
    const [isFollowing, setIsFollowing] = useState(isFollowingUser);
    const [selectedCato, setSelectedCato] = useState(PROFILE_CONTENT_TYPES.ARTICLES);
    const [articles, setArticles] = useState([]);

    const getArticles = async (_id) => {
        try {
            const { articles: _articles } = await getUserArticles(_id);
            setArticles(_articles);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if(!userId) return;

        (async () => {
            getArticles(userId);
        })();
    }, [userId])

    const handleFollowOrUnFollow = async () => {
        try {
            setIsLoading(true);

            if(isFollowing) {
                await unFollowUser(userId);
            } else {
                await followUser(userId);
            } 

            setIsFollowing(val => !val);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    return <div className="w-full px-6 sm:w-[70%] sm:pl-[10vw] sm:pr-[10rem]">
        <p className="text-4xl pt-6 pb-2 sm:py-6 font-bold">{user?.name || "User Name"}</p>

        <div className="flex sm:hidden">
            <div className="flex gap-1 items-center text-gray-600 mb-4">
                <p className="text-sm">{user?.followersCount}</p>
                <p>{user?.followersCount != 1 ? "Followers" : "Follower"}</p>
            </div>

            {/* <p className="mx-2">|</p>

            <div className="flex gap-1 items-center text-gray-600 mb-4">
                <p className="text-sm">{user?.followersCount}</p>
                <p>{user?.followersCount != 1 ? "Articles" : "Article"}</p>
            </div> */}
        </div>

        {
            currentUserId != userId && <div className="gap-4 mb-6 flex sm:hidden">
                <button 
                    className={`cursor-pointer rounded-full px-4 py-2 flex justify-center items-center text-sm border border-green-700 ${isFollowing? "bg-white text-black" : "bg-green-700 text-white"}`}
                    onClick={handleFollowOrUnFollow}
                >
                    <p>{isLoading? "..." : (isFollowing? "Following" : "Follow")}</p>
                </button>

                {
                    user?.email && <Link
                        className="cursor-pointer rounded-full flex justify-center items-center bg-green-700 text-white text-sm h-[2.15rem] aspect-square object-contain"
                        href={`mailto:${user?.email}`}
                    >
                        <img 
                            className="p-2 w-full h-full"
                            src="https://img.icons8.com/?size=100&id=gLWGLA2BHDBi&format=png&color=ffffff"
                        />
                    </Link>
                }
            </div>
        }

        <div className="border-b border-gray-300 text-sm flex mt-2">
            {Object.values(PROFILE_CONTENT_TYPES).map((cato, ind) => {
                return (
                    <button
                        key={ind}
                        className={`cursor-pointer py-3 px-3 ${
                            cato == selectedCato
                                ? "text-black border-b border-black"
                                : "text-gray-600"
                        } hover:text-black`}
                        onClick={() => setSelectedCato(cato)}
                    >
                        {cato}
                    </button>
                );
            })}
        </div>

        {
            selectedCato == PROFILE_CONTENT_TYPES.ARTICLES && <div className="flex flex-col gap-4 pb-6">
                {
                    articles?.map((article, ind) => {
                        return <div key={ind} className="flex flex-col w-full py-8 border-b border-gray-400">
                            <Link
                                className="flex w-full gap-2"
                                href={`/article/${article.slug}`}
                            >
                                <div className="flex-1 flex flex-col gap-2">
                                    <div className="flex flex-col gap-2 cursor-pointer">
                                        <p className="font-semibold text-xl">{article.heading}</p>

                                        <div className="article-article -my-2"
                                            dangerouslySetInnerHTML={{ __html: article?.article?.slice(0, 250) + '...' }}
                                        >
                                        </div>

                                        <div className="flex gap-4">
                                            <div className="flex items-center gap-1">
                                                <img 
                                                    src="https://img.icons8.com/?size=100&id=LlgB5a8aAr0G&format=png&color=000000"
                                                    className="h-4 w-4 object-contain"
                                                />

                                                <p className="text-sm">{formatDate(new Date(article.createdAt))}</p>
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <img 
                                                    src="https://img.icons8.com/?size=100&id=24816&format=png&color=000000"
                                                    className="h-4 w-4 object-contain"
                                                />

                                                <p className="text-sm">{article?.likeCount || 0}</p>
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <img 
                                                    src="https://img.icons8.com/?size=100&id=24816&format=png&color=000000"
                                                    className="h-4 w-4 object-contain -rotate-180"
                                                />

                                                <p className="text-sm">{article?.dislikeCount || 0}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-[4rem] sm:h-[8rem] aspect-[16/9]">
                                    <img 
                                        className="w-full h-full"
                                        src={article.thumbnail}
                                    />
                                </div>
                            </Link>
                        </div>
                    })
                }
            </div>
        }

        {
            selectedCato == PROFILE_CONTENT_TYPES.FOLLOWING && <div>
                <div className="flex flex-col gap-6 py-4">
                    {user?.following?.map((following, ind) => {
                        return (
                            <Follwer 
                                currentUserFollowers={currentUserFollowers}
                                following={following}
                                key={ind}
                            />
                        );
                    })}

                    {
                        user?.following.length == 0 && <div className="h-[15rem] flex justify-center items-center">
                            <p>No followings</p>
                        </div>
                    }
                </div>
            </div>
        }
    </div>;
}
