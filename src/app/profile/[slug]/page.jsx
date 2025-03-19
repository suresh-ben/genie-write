import React from "react";
import getUserData from "@/utils/getUserData";
import Manager from "./components/Manager";

export default async function page({ params }) {
    const currentUser = await getUserData();
    const { slug: userId } = await params;

    const isFollowingUser = currentUser?.following?.includes(userId);

    return (
        <Manager
            userId={userId}
            currentUserId={currentUser?._id.toString()}
            isFollowingUser={isFollowingUser}
            currentUser={JSON.stringify(currentUser)}
        />
    );
}
