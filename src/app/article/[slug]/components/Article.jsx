"use client";
import React, { useState, useEffect } from "react";
import { dislikeArticle, getArticleData, likeArticle } from "@/actions/article";
import { getProfileColor } from "@/utils/profileColorPicker";
import { formatDate } from "@/utils/dateFormatter";
import Link from "next/link";

export default function Article({ slug, currentUserId }) {

    const [article, setArticle] = useState(null);
    const [likes, setLikes] = useState([]);
    const [dislikes, setDislikes] = useState([]);

    const getArticle = async () => {
        const _article = await getArticleData(slug);

        setArticle(_article);
        setLikes(_article?.likes);
        setDislikes(_article?.disLikes);
    }

    useEffect(() => {
        (async () => {
            await getArticle();
        })();
    }, [])

    const handleLike = async () => {
        try {
            await likeArticle(slug);

            setLikes(prev => {
                if (prev.includes(currentUserId)) {
                    return prev.filter(id => id != currentUserId);
                } else {
                    return [...prev, currentUserId];
                }
            });
            setDislikes(prev => {
                return prev.filter(id => id != currentUserId);
            });
        } catch (error) {
            console.log(error);
        }
    }

    const handleDislike = async () => { 
        try {
            await dislikeArticle(slug);

            setDislikes(prev => {
                if (prev.includes(currentUserId)) {
                    return prev.filter(id => id != currentUserId);
                } else {
                    return [...prev, currentUserId];
                }
            });
            setLikes(prev => {
                return prev.filter(id => id != currentUserId);
            });
        } catch (error) {
            console.log(error);
        }
    }

    return <div
        className="w-full px-6 sm:px-0 sm:w-[60%] sm:mx-[20%] my-6"
    >
        <img 
            src={article?.thumbnail}
            className="w-full aspect-[16/9]"
        />

        {/* ToDo: details */}
        <div className="w-full flex flex-col gap-2 my-4">
            <div className="flex gap-2 items-center">
                <Link 
                    href={`/profile/${article?.createdBy}`}
                    className="w-[2.5rem] h-[2.5rem] rounded-full flex justify-center items-center cursor-pointer"
                    style={{
                        backgroundColor: getProfileColor(article?.authorName)
                    }}
                >
                    {article?.authorImage ? (
                        <img 
                            src={article?.authorImage}
                            className="object-cover h-full w-full rounded-full"
                            referrerPolicy="no-referrer"
                        />
                    ) : (
                        <p className="font-medium text-white">
                            {article?.authorName[0]}
                        </p>
                    )}
                </Link>

                <div className="">
                    <Link
                        className="font-medium hover:underline cursor-pointer"
                        href={`/profile/${article?.createdBy}`}
                    >
                        {article?.authorName}
                    </Link>
                </div>
            </div>
            
            <div className="w-full border-y border-gray-400 py-3">
                <div className="flex justify-between">
                    <div className="flex gap-4">
                        <div className="flex items-center gap-1">
                            <img 
                                src="https://img.icons8.com/?size=100&id=LlgB5a8aAr0G&format=png&color=000000"
                                className="h-4 w-4 object-contain"
                            />

                            <p className="text-sm">{article?.createdAt? formatDate(new Date(article?.createdAt)) : formatDate(new Date())}</p>
                        </div>

                        <button 
                            className={`flex items-center gap-1 cursor-pointer`}
                            onClick={handleLike}
                        >
                            <img 
                                src={likes.includes(currentUserId)? "https://img.icons8.com/?size=100&id=33479&format=png&color=000000" : "https://img.icons8.com/?size=100&id=24816&format=png&color=000000"}
                                className="h-4 w-4 object-contain"
                            />

                            <p className="text-sm">{likes?.length || 0}</p>
                        </button>

                        <button 
                            className={`flex items-center gap-1 cursor-pointer`}
                            onClick={handleDislike}
                        >
                            <img 
                                src={dislikes.includes(currentUserId)? "https://img.icons8.com/?size=100&id=33479&format=png&color=000000" : "https://img.icons8.com/?size=100&id=24816&format=png&color=000000"}
                                className="h-4 w-4 object-contain -rotate-180"
                            />

                            <p className="text-sm">{dislikes?.length || 0}</p>
                        </button>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex items-center gap-1">
                            <img 
                                src="https://img.icons8.com/?size=100&id=bDrb5MdYaEje&format=png&color=000000"
                                className="h-4 w-4 object-contain -rotate-180"
                            />

                            <p className="text-sm">10 min read</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div 
            dangerouslySetInnerHTML={{ __html: article?.article || "" }}
        />
    </div>;
}
