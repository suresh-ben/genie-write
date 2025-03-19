"use client";
import React, { useState, useEffect } from "react";

import { followUser, unFollowUser } from "@/actions/user";
import { getProfileColor } from "@/utils/profileColorPicker";
import Link from "next/link";

export default function UserDetails({ userId, user, currentUserId, isFollowingUser }) {

    const [isLoading, setIsLoading] = useState(false);
    const [isFollowing, setIsFollowing] = useState(isFollowingUser);

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

    return (
        <div
            id="side-manager"
            className="border-l border-gray-200 w-[30%] min-h-[calc(100vh-4rem)] p-[2rem] overflow-auto hidden sm:block"
        >
            {
                user?.image ? <img 
                    src={user?.image}
                    className="object-cover h-20 w-20 rounded-full"
                    referrerPolicy="no-referrer"
                /> : <div 
                    className="h-20 w-20 rounded-full flex justify-center items-center"
                    style={{ backgroundColor: getProfileColor(user?.name) }}
                >
                    <p className="text-4xl font-semibold text-white">{user?.name? user?.name[0] : ""}</p>
                </div>
            }

            <p className="text-lg font-semibold mt-4">{user?.name || "User Name"}</p>

            <div className="flex">
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
                currentUserId != userId && <div className="flex gap-4 mb-6">
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

            {
                user?.following && user?.following?.length > 0 && <div className="">
                    <p className="text-sm font-medium mb-2">Following</p>

                    <div className="flex flex-col">
                        {
                            user?.following?.slice(0,5).map(following => (
                                <Link 
                                    className="flex gap-2 items-center mb-2" key={following._id}
                                    href={`/profile/${following._id}`}
                                >
                                    {
                                        following?.image ? <img 
                                            src={following?.image}
                                            className="object-cover w-[1.5rem] h-[1.5rem] rounded-full"
                                            referrerPolicy="no-referrer"
                                        /> : <div className="w-[1.5rem] h-[1.5rem] rounded-full flex justify-center items-center cursor-pointer"
                                            style={{
                                                backgroundColor: getProfileColor(following.name)
                                            }}
                                        >
                                            <p className="text-sm font-medium text-white">{following.name? following.name[0] : ""}</p>
                                        </div>
                                    }

                                    <p className="text-sm hover:underline cursor-pointer">{following.name}</p>
                                </Link>
                            ))
                        }

                        { user?.following?.length > 5 && <p className="text-sm text-gray-700 cursor-pointer">See all ({user?.following?.length})</p> }
                    </div>
                </div>
            }
        </div>
    );
}
