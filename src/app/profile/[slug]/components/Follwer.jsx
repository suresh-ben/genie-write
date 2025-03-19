"use client";
import React, { useState } from "react";
import { followUser, unFollowUser } from "@/actions/user";
import { getProfileColor } from "@/utils/profileColorPicker";

export default function Follwer({ following, currentUserFollowers }) {

    const [isLoading, setIsLoading] = useState(false);
    const [isFollowing, setIsFollowing] = useState(currentUserFollowers?.includes(following._id));

    const handleFollowOrUnFollow = async () => {
        try {
            setIsLoading(true);

            if(isFollowing) {
                await unFollowUser(following._id);
            } else {
                await followUser(following._id);
            } 

            setIsFollowing(val => !val);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full flex gap-2 items-center sm:pr-[2rem]">
            <div
                className="w-[2rem] h-[2rem] rounded-full flex justify-center items-center cursor-pointer"
                style={{
                    backgroundColor: getProfileColor(following.name),
                }}
            >
                {following.image ? (
                    <img
                        src={following.image}
                        className="object-cover h-full w-full rounded-full"
                        referrerPolicy="no-referrer"
                    />
                ) : (
                    <p className="font-medium text-white text-xl">
                        {following.name[0]}
                    </p>
                )}
            </div>

            <div className="flex-1">
                <p className="font-medium cursor-pointer w-fit">
                    {following.name}
                </p>

                <div className="flex gap-6">
                    <div className="flex items-center gap-1">
                        <img
                            src="https://img.icons8.com/?size=100&id=11168&format=png&color=000000"
                            className="object-contain h-4 w-4"
                        />
                        <p className="text-sm">
                            {following.followersCount || 0}
                        </p>
                    </div>

                    <div className="flex items-center gap-1">
                        <img
                            src="https://img.icons8.com/?size=100&id=42271&format=png&color=000000"
                            className="object-contain h-4 w-4"
                        />
                        <p className="text-sm">{following.articlesCount || 0}</p>
                    </div>
                </div>
            </div>

            <button 
                className={`text-sm rounded-full border border-green-700 px-3 py-1 cursor-pointer ${isFollowing? "bg-white text-black" : "bg-green-700 text-white"}`}
                onClick={handleFollowOrUnFollow}
            >
                {isLoading? "..." : (isFollowing ? "Following" : "Follow")}
            </button>
        </div>
    );
}
