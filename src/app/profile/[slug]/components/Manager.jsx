"use client";
import React, { useEffect, useState } from "react";
import Profile from "./Profile";
import UserDetails from "./UserDetails";
import { getUserDetailsById } from "@/actions/user";

export default function Manager({ userId, currentUserId, isFollowingUser, currentUser }) {

    const [user, setUser] = useState({});

    const getUser = async (_id) => {
        try {
            const _user = await getUserDetailsById(_id);
            console.log({ _user })

            setUser(_user);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if(!userId) return;

        (async () => {
            await getUser(userId);
        })();
    }, [userId])


    return (
        <div className="flex relative">
            <Profile
                userId={userId}
                currentUserId={currentUserId}
                user={user}
                currentUserFollowers={JSON.parse(currentUser).following}
                isFollowingUser={isFollowingUser}
            />

            <UserDetails
                user={user}
                userId={userId}
                currentUserId={currentUserId}
                isFollowingUser={isFollowingUser}
            />
        </div>
    );
}
