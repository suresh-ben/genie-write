"use client";
import { formatDate } from "@/utils/dateFormatter";
import { getProfileColor } from "@/utils/profileColorPicker";
import React from "react";
import Link from "next/link";

export default function Articles({ articles, isLoading }) {
    return <div className="flex flex-col gap-4">
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
                            className="h-[4rem] sm:h-[8rem aspect-[16/9]"
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
            articles.length == 0 && !isLoading && <div className="h-[15rem] flex justify-center items-center">
                <p>No articles found</p>
            </div>
        }
    </div>
}
