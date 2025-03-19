"use client";
import Follwer from "@/app/profile/[slug]/components/Follwer";
import React from "react";

export default function Users({ users, isLoading, currentUserFollowers }) {
    return <div className="flex flex-col gap-4">
        {
            users.map((user, ind) => {
                return <Follwer 
                    key={ind}
                    following={user}
                    currentUserFollowers={currentUserFollowers}
                />
            })
        }
        {
            users.length == 0 && !isLoading && <div className="h-[15rem] flex justify-center items-center">
                <p>No users found</p>
            </div>
        }
    </div>
}
