"use client"; // Make this a client component

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function SearchBar() {

    const router = useRouter();
    const [recentSearches, setRecentSearches] = useState([]);

    useEffect(() => {
        const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
        setRecentSearches(searchHistory);
    }, [])

    const handleSearch = async (e) => {
        e.preventDefault();
        const searchTerm = e.target.search.value.trim();

        if (!searchTerm) return;

        try {
            const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
            searchHistory.unshift(searchTerm);
            localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        } catch (error) {
            console.error("Error storing search term:", error);
        }

        router.push(`/search/${searchTerm}`);
    };

    return (
        <div className="p-6">
            <form 
                className='rounded-full bg-gray-100 items-center w-full p-2 py-1 border flex sm:hidden'
                onSubmit={handleSearch}
            >
                <div className='h-[1.35rem] aspect-square relative'>
                    <Image 
                        src='/search.svg'
                        alt='Search'
                        fill
                    />
                </div>
                <input 
                    className='w-[15rem] text-sm p-2 focus-visible:w-[25rem] outline-none bg-transparent'
                    style={{ transition: 'all 0.25s' }}
                    placeholder='Search'
                    name='search'
                />
            </form>

            <div className="w-full mt-6">
                <h1 className="font-semibold text-2xl">Search History</h1>
                <div className="mt-2">
                    {
                        recentSearches.length > 0 && <ul className="flex flex-col gap-2">
                            {recentSearches?.map((item, index) => (
                                <li key={index}>
                                    <button className="flex items-center gap-2" onClick={() => router.push(`/search/${item}`)}>
                                        <div className="h-[1.35rem] aspect-square relative">
                                            <Image 
                                                src='/search.svg'
                                                alt='Search'
                                                fill
                                            />
                                        </div>
                                        <p>{item}</p>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    }
                    {
                        recentSearches.length === 0 && <p className="text-sm text-gray-500">No recent searches</p>
                    }
                </div>
            </div>
        </div>
    );
}
