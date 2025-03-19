import React from "react";
import Article from "./components/Article";
import getUserData from "@/utils/getUserData";

export default async function page({ params }) {
    const { slug: articleSlug } = await params;
    const currentUser = await getUserData();

    return (
        <Article
            slug={articleSlug}
            currentUserId={currentUser?._id.toString()}
        />
    );
}
