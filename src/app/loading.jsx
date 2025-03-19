"use client";

import React from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import loading from '../../public/ai_loading.json'

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function Loading({ componental=false, isInView=false, sizePer="20%" }) {
    return <>
        {
            isInView && <div className={`${componental? "h-full w-full" : "fixed z-[1000] top-0 bottom-0 right-0 left-0 backdrop-blur-xs bg-white/30"} flex justify-center items-center`}>
                <motion.div
                    className="flex justify-center items-center"
                    initial={{
                        width: "50%",
                        height: "50%"
                    }}
                    animate={{
                        height: "100%",
                        width: "100%",
                    }}
                    exit={{
                        width: "50%",
                        height: "50%"
                    }}
                >
                    <Lottie 
                        animationData={loading}
                        loop
                        style={{
                            height: sizePer,
                            width: sizePer,
                        }}
                    />
                </motion.div>
            </div>
        }
    </>;
}
