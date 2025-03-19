"use client";
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic';
import { Playfair_Display } from 'next/font/google';
import { signOutUser } from '@/actions/auth';
import Image from 'next/image';
import Link from 'next/link';
import { getProfileColor } from '@/utils/profileColorPicker';
import { useRouter } from "next/navigation";

import loading from '../../../public/loading.json'
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const playfairDisplay = Playfair_Display({
    variable: "--font-playfair-display",
    subsets: ["latin"],
});

export default function Header({ userName, userImageUrl, email, userId }) {
    
    const router = useRouter();
    const [isSigningOut, setIsSigningOut] = useState(false);
    const [isHoveringOnProfile, setIsHoveringOnProfile] = useState(false);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest(".profile-manager")) {
                setIsHoveringOnProfile(false);
            }
        };
    
        document.addEventListener("click", handleClickOutside);
        
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        const searchTerm = e.target.search.value;
        if(searchTerm) {
            router.push(`/search/${searchTerm}`);
        }
    }

    const handleSignOut = async () => {
        try {
            setIsSigningOut(true);
            await signOutUser();
        } catch (error) {
            console.log(error);
        } finally {
            setIsSigningOut(false);
        }
    }

    return (
        <header className='h-[4rem] border-b border-gray-300 flex justify-between items-center px-[5%] sm:px-[2%]'>
            {
                // If siningout make a loading, covering whole pahe
                isSigningOut && <div className='fixed z-[1000] top-0 left-0 w-screen h-screen flex justify-center items-center bg-[rgba(255,255,255,0.5)] backdrop-blur-sm'>
                    <Lottie 
                        animationData={loading}
                        loop={true}
                        autoPlay={true}
                        className="w-[5rem] h-[5rem]"
                    />
                </div>
            }
            <div className='flex gap-4 items-center'>
                <Link 
                    href='/'
                >
                    <p className={`text-2xl font-bold cursor-pointer ${playfairDisplay.className}`}>GeineWrite</p>
                </Link>

                <form 
                    className='rounded-full bg-gray-100 items-center px-2 hidden sm:flex'
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
                        className='w-[15rem] text-sm p-2 focus-visible:w-[25rem]'
                        style={{ transition: 'all', transitionDuration: '0.25s' }}
                        placeholder='Search'
                        name='search'
                    />
                </form>
            </div>
            
            <div className='flex gap-4 sm:gap-8 text-sm h-full justify-center items-center'>
                <Link 
                    className='cursor-pointer block sm:hidden'
                    href='/search'
                >
                    <div className='h-full flex items-center gap-1 group'>
                        <div className='h-[1.5rem] aspect-square relative'>
                            <div 
                                className={`h-full w-full bg-gray-500 group-hover:bg-black`} 
                                style={{
                                    maskImage: `url('/search.svg')`,
                                    maskRepeat: 'no-repeat',
                                    maskPosition: 'center',
                                    maskSize: '100% 100%',
                                }}
                            />
                        </div>
                    </div>
                </Link>

                <Link 
                    className='cursor-pointer'
                    href='/write'
                >
                    <div className='h-full flex items-center gap-1 group'>
                        <div className='h-[1.5rem] aspect-square relative'>
                            <div 
                                className={`h-full w-full bg-gray-500 group-hover:bg-black`} 
                                style={{
                                    maskImage: `url('/write.svg')`,
                                    maskRepeat: 'no-repeat',
                                    maskPosition: 'center',
                                    maskSize: '100% 100%',
                                }}
                            />
                        </div>
                        <p className='text-gray-500 group-hover:text-black'>Write</p>
                    </div>
                </Link>

                {/* <button 
                    className='cursor-pointer h-[1.5rem] aspect-square relative group'
                >
                    <div 
                        className={`h-full w-full bg-gray-500 group-hover:bg-black`} 
                        style={{
                            maskImage: `url('/bell.svg')`,
                            maskRepeat: 'no-repeat',
                            maskPosition: 'center',
                            maskSize: '100% 100%',
                        }}
                    />
                </button> */}

                <div className='h-full flex justify-center items-center relative profile-manager'>
                    <button 
                        className='cursor-pointer overflow-hidden text-white h-[50%] text-xl aspect-square rounded-full border border-black hover:brightness-80 transition'
                        onClick={() => setIsHoveringOnProfile(val => !val)}
                        style={{
                            backgroundColor: getProfileColor(userName || '')
                        }}
                    >
                        {
                            userImageUrl && <img 
                                src={userImageUrl}
                                className='h-full w-full object-fill'
                                alt='Profile'
                                referrerPolicy="no-referrer"
                            />
                        }
                        {!userImageUrl && <p>{userName[0]}</p>}
                    </button>

                    {
                        isHoveringOnProfile && <div className='absolute z-10 top-[110%] right-0 bg-white shadow border border-gray-200 rounded-xs profile-manager flex flex-col'>
                            <Link
                                className='p-3 px-16 cursor-pointer profile-manager w-full border-b'
                                href={`/profile/${userId}`}
                            >
                                <div className='flex gap-2 items-center'>
                                    <img 
                                        src='https://img.icons8.com/?size=100&id=uOoIUTYvxnso&format=png&color=000000'
                                        className='h-5 w-5'
                                    />
                                    <p className='text-start mb-1'>Profile</p>
                                </div>
                            </Link>
                            
                            <button 
                                className='p-2 px-16 cursor-pointer profile-manager w-full'
                                onClick={handleSignOut}  
                            >
                                <div className='flex flex-col'>
                                    <p className='text-start mb-1'>Sign out</p>

                                    <p className='text-xs'>{email}</p>
                                </div>
                            </button>
                        </div>
                    }
                </div>
            </div>
        </header>
    )
}
