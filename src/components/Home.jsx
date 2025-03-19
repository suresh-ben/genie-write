"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { getFollowingArticles, getLatestArticels, getPopularArticles } from "@/actions/article";

import { FEED_CATOGORIES } from "@/config/constants";
import { getProfileColor } from "@/utils/profileColorPicker";
import { formatDate } from "@/utils/dateFormatter";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import loading from '../../public/loading.json'
import Link from "next/link";


export default function Home() {
    
    const [isLoading, setIsLoading] = useState(true);
    const [articles, setArticles] = useState([]);
    const [selectedCato, setSelectedCato] = useState(Object.values(FEED_CATOGORIES)[0]);

    const getLatest = async () => {
        try {
            const { articles : latestArticles } = await getLatestArticels();
            setArticles(latestArticles);
        } catch (error) {
            console.log(error);
        }
    }

    const getPopular = async () => {
        try {
            const { articles : popularArticles } = await getPopularArticles();
            setArticles(popularArticles);
        } catch (error) {
            console.log(error);
        }
    }

    const getFollowing = async () => {
        try {
            const { articles : followingArticles } = await getFollowingArticles();
            setArticles(followingArticles);
        } catch (error) {
            console.log(error);
        }
    }
    
    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);

                if(selectedCato == FEED_CATOGORIES.LATEST)
                    await getLatest();
                else if(selectedCato == FEED_CATOGORIES.POPULAR)
                    await getPopular();
                else if(selectedCato == FEED_CATOGORIES.FOLLOWING)
                    await getFollowing();
                else 
                    setArticles([]);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        })();
    }, [selectedCato])

    return (
        <div className="w-full sm:w-[70%] px-6 sm:pl-[10vw] sm:pr-[10rem]">
            <div className="border-b border-gray-300 text-sm flex mt-2">
                {Object.values(FEED_CATOGORIES).map((cato, ind) => {
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

            <div className="flex flex-col gap-4">
                {
                    !isLoading && articles.map((article, ind) => {
                        return <div key={ind} className="flex flex-col w-full py-8 border-b border-gray-400">
                            <div className="flex w-full gap-2">
                                <div className="flex-1 flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/profile/${article?.createdBy}`}
                                            className="w-[1.4rem] h-[1.4rem] rounded-full flex justify-center items-center cursor-pointer"
                                            style={{
                                                backgroundColor: getProfileColor(article.authorName)
                                            }}
                                        >
                                            {article.authorImage ? (
                                                <img 
                                                    src={article.authorImage}
                                                    className="object-cover h-full w-full rounded-full"
                                                    referrerPolicy="no-referrer"
                                                />
                                            ) : (
                                                <p className="font-medium text-white">
                                                    {article.authorName[0]}
                                                </p>
                                            )}
                                        </Link>
    
                                        <Link
                                            className="text-sm hover:underline cursor-pointer"
                                            href={`/profile/${article?.createdBy}`}
                                        >
                                            {article?.authorName}
                                        </Link>
                                    </div>

                                    <Link
                                        className="flex flex-col gap-2 cursor-pointer"
                                        href={`/article/${article.slug}`}
                                    >
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
                                    </Link>
                                </div>

                                <Link
                                    className="h-[4rem] sm:h-[8rem] aspect-[16/9]"
                                    href={`/article/${article.slug}`}
                                >
                                    <img 
                                        className="w-full h-full"
                                        src={article.thumbnail}
                                    />
                                </Link>
                            </div>
                        </div>
                    })
                }
                {
                    !isLoading && articles.length == 0 && <div className="h-[15rem] flex justify-center items-center">
                        <p>{selectedCato == FEED_CATOGORIES.FOLLOWING? "Follow people to see their articles" : "No articles"}</p>
                    </div>
                }
                {
                    isLoading && <div className="h-[15rem] flex justify-center items-center">
                        <Lottie 
                            animationData={loading}
                            loop={true}
                            autoPlay={true}
                            className="w-[5rem] h-[5rem]"
                        />
                    </div>
                }
            </div>
        </div>
    );
}
