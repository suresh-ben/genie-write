import React from "react";
import Manager from "./components/Manager";
import getUserData from "@/utils/getUserData";

export default async function page({ params }) {
    const { slug: searchTerm } = await params;
    const currentUser = await getUserData();

    return (
        <Manager
            searchTerm={searchTerm}
            currentUser={JSON.stringify(currentUser)}
        />
    );
}
