"use client";
import React, { useState, useEffect } from "react";
import Articles from "./Articles";
import Users from "./Users";

import dynamic from "next/dynamic";
import loading from '../../../../../public/loading.json'

import { searchArticles } from "@/actions/article";
import { SERACH_TYPES } from "../utils/options";
import { searchUsers } from "@/actions/user";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function Manager({ searchTerm, currentUser }) {
    
    const [articles, setArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [selectedCato, setSelectedCato] = useState(Object.values(SERACH_TYPES)[0]);

    const getArticles = async () => {
        try {
            const _articles = await searchArticles(searchTerm);
            setArticles(_articles);
        } catch (error) {
            console.log(error);
        } 
    }

    const getUsers = async () => {
        try {
            const _users = await searchUsers(searchTerm);
            setUsers(_users);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if(!searchTerm) return;

        (async () => {
            try {
                setIsLoading(true);

                await getArticles();
                await getUsers();
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        })();
    }, [searchTerm])

    return <div className="w-full px-6 sm:px-0 sm:w-[60%] sm:mx-[20%]">
        <h1 className="mt-6 font-semibold text-2xl">Search Results for: {searchTerm}</h1>

        <div className="border-b border-gray-300 text-sm flex mt-2">
            {Object.values(SERACH_TYPES).map((cato, ind) => {
                return (
                    <button
                        key={ind}
                        className={`cursor-pointer py-3 px-3 ${
                            cato == selectedCato
                                ? "text-black border-b border-black"
                                : "text-gray-600"
                        } hover:text-black`}
                        onClick={() => setSelectedCato(cato)}
                    >
                        {cato}
                    </button>
                );
            })}
        </div>

        {
            isLoading && <div className="h-[15rem] w-full flex justify-center items-center">
                <Lottie 
                    animationData={loading}
                    loop={true}
                    autoPlay={true}
                    className="w-[5rem] h-[5rem]"
                />
            </div>
        }

        {
            selectedCato == SERACH_TYPES.ARTICLES && <Articles 
                articles={articles}
                isLoading={isLoading}
            />
        } 
        {
            selectedCato == SERACH_TYPES.USERS && <Users 
                users={users}
                isLoading={isLoading}
                currentUserFollowers={JSON.parse(currentUser).following}
            />
        }
    </div>;
}
