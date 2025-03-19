"use client";
import React, { useState } from "react";
import { getProfileColor } from "@/utils/profileColorPicker";
import { followUser, unFollowUser } from "@/actions/user";
import Link from "next/link";

export default function SidebarUser({ user }) {

    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleFollowOrUnFollow = async () => {
        try {
            setIsLoading(true);

            if(isFollowing) {
                await unFollowUser(user?._id);
            } else {
                await followUser(user?._id);
            } 

            setIsFollowing(val => !val);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full flex gap-2 items-center pr-[2rem]">
            <Link
                href={`/profile/${user._id}`}
                className="w-[2rem] h-[2rem] rounded-full flex justify-center items-center cursor-pointer"
                style={{
                    backgroundColor: getProfileColor(user.name),
                }}
            >
                {user.image ? (
                    <img
                        src={user.image}
                        className="object-cover h-full w-full rounded-full"
                        referrerPolicy="no-referrer"
                    />
                ) : (
                    <p className="font-medium text-white text-xl">
                        {user.name[0]}
                    </p>
                )}
            </Link>

            <div className="flex-1">
                <Link
                    href={`/profile/${user._id}`}
                    className="font-medium cursor-pointer w-fit"
                >
                    {user.name}
                </Link>

                <div className="flex gap-6">
                    <div className="flex items-center gap-1">
                        <img
                            src="https://img.icons8.com/?size=100&id=11168&format=png&color=000000"
                            className="object-contain h-4 w-4"
                        />
                        <p className="text-sm">{user.followerCount}</p>
                    </div>

                    <div className="flex items-center gap-1">
                        <img
                            src="https://img.icons8.com/?size=100&id=42271&format=png&color=000000"
                            className="object-contain h-4 w-4"
                        />
                        <p className="text-sm">{user.articleCount}</p>
                    </div>
                </div>
            </div>

            <button 
                className="text-sm rounded-full border border-black px-3 py-1 cursor-pointer"
                onClick={handleFollowOrUnFollow}
            >
                {isLoading ? "..." : (isFollowing ? "Following" : "Follow")}
            </button>
        </div>
    );
}
