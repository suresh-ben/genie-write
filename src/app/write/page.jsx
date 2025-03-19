"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

import { useFormik } from "formik";
import * as YUP from "yup";
import { generateArticle, uploadArticle } from "../../actions/article";
import Loading from "../loading";
import { Ideas, Topics } from "@/utils/suggestions";

import loading from '../../../public/loading.json'
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

function randomElements(arr, numberOfElements) {
    if (numberOfElements > arr.length) {
        throw new Error("Requested more elements than available in the array");
    }

    const copy = [...arr]; // Clone array to avoid modifying the original
    const result = [];

    for (let i = 0; i < numberOfElements; i++) {
        const randomIndex = Math.floor(Math.random() * copy.length);
        result.push(copy.splice(randomIndex, 1)[0]); // Remove and store element
    }

    return result;
}

export default function page() {
    
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [articleImgUrl, setArticleImgUrl] = useState(null);
    const [article, setArticle] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    
    //ranodm topics and ides suggestion
    const [randomTopics, setRandomTopics] = useState([]);
    const [rendomIdeas, setRandomIdeas] = useState([]);
    useEffect(() => {
        setRandomTopics(randomElements(Topics, 2));
        setRandomIdeas(randomElements(Ideas, 5))
    }, [])

    const handleGenerate = async (values) => {
        try {
            setIsLoading(true);

            if (values?.prompt.length > 100)
                alert("Maximum 100 characters are allowed in prompt");
    
            const { article, imageUrl } = await generateArticle(values.prompt);
            setArticle(article);
            setArticleImgUrl(imageUrl);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false)
        }
    };

    const formik = useFormik({
        initialValues: {
            prompt: "",
        },
        validationSchema: YUP.object({
            prompt: YUP.string().required("Please provide a prompt"),
        }),
        onSubmit: handleGenerate,

        validateOnBlur: true,
        validateOnChange: true,
    });

    const [redableArtle, setReadableArticle] = useState("");
    const [isWriting, setIsWriting] = useState(true);
    useEffect(() => {
        if (!article) return;

        let index = 0;
        setReadableArticle(""); // Reset on new article

        const interval = setInterval(() => {
            setReadableArticle((prev) => prev + article[index]);
            index++;

            if (index === article.length) {
                clearInterval(interval);
                setIsWriting(false);
            }
        }, 0.25); // Adjust the speed here (milliseconds per character)

        return () => clearInterval(interval);
    }, [article]);

    const handlePublish = async () => {
        const heading = document.querySelectorAll(".article h1");

        const article_heading = heading[0]?.innerHTML;
        const article_body = formatArticleToHTML(article);
        const article_image = articleImgUrl;

        try {
            setIsUploading(true);
            const { article } = await uploadArticle(article_heading, article_body, article_image);

            //navigate to artcile
            router.push(`/article/${article.slug}`);
        } catch (error) {
            console.log(error);
        } finally {
            setIsUploading(false);
        }
    }

    return (
        <div className="w-full h-[calc(100vh-4rem)] flex flex-col justify-center items-center relative">
            {
                isUploading && <div 
                    className="absolute z-[1000] top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-[rgba(255,255,255,0.5)] backdrop-blur-sm" //blur
                >
                    <Lottie 
                        animationData={loading}
                        loop={true}
                        autoPlay={true}
                        className="w-[5rem] h-[5rem]"
                    />
                </div>
            }
            
            <div className="flex flex-col justify-center items-center">
                <div className={`w-[80vw] sm:w-[50vw] ${isLoading && "h-[50vh]"}`}>
                    <Loading 
                        componental={true}
                        isInView={isLoading}
                        sizePer={"30%"}
                    />
                </div>

                
                {isLoading && <p className="text-center">AI is writing your article for you</p>}
            </div>

            {article && !isLoading && (
                <div className="min-h-full w-full py-4 mb-4">
                    {/* An Image here */}
                    {
                        articleImgUrl && <img 
                            src={articleImgUrl}
                            className="w-full px-6 sm:px-0 sm:w-[60%] sm:mx-[20%] mb-4 aspect-[16/9] object-cover"
                        />
                    }

                    <div className="px-6 md:px-0 md:mx-[20%] pb-4 article" dangerouslySetInnerHTML={{ __html: formatArticleToHTML(redableArtle) }} />
                
                    <div className="px-6 md:px-0 md:mx-[20%] mb-4 flex justify-end items-center pb-4">
                        <button 
                            className={`shadow border border-gray-200 p-3 px-6 flex justify-center items-center gap-6 rounded-full disabled:bg-gray-400 cursor-pointer`}
                            disabled={isWriting}
                            onClick={handlePublish}
                        >
                            <p className="text-xl font-medium">Publish</p>

                            <img
                                src="https://img.icons8.com/?size=100&id=IISmtYu065Oa&format=png&color=000000"
                                className="h-4 w-4"
                            />
                        </button>
                    </div>
                </div>
            )}

            {!article && !isLoading && (
                <>
                    <p className="text-2xl font-semibold mb-4">
                        What would you like to write about?
                    </p>

                    <form
                        onSubmit={formik.handleSubmit}
                        className="shadow bg-white p-4 rounded-xl border border-gray-100 w-[90%] sm:w-[50%] sm:min-w-[35rem]"
                    >
                        <input
                            name="prompt"
                            className="w-full p-1"
                            placeholder="Type something"
                            value={formik.values.prompt}
                            onChange={formik.handleChange}
                        />

                        <div className="flex justify-between items-center w-full mt-4">
                            <div className="flex gap-4">
                                {randomTopics.map((topic, ind) => {
                                    return (
                                        <button
                                            type="button"
                                            key={ind}
                                            className={`cursor-pointer hover:scale-[0.99] ${ind > 0 && "hidden sm:block"}`}
                                            onClick={() =>
                                                formik.setFieldValue(
                                                    "prompt",
                                                    topic
                                                )
                                            }
                                        >
                                            <p className="p-1 px-4 border rounded-full hover:bg-gray-100">
                                                {topic}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                className="rounded-full bg-black p-2 cursor-pointer"
                                type="submit"
                            >
                                <img
                                    src="https://img.icons8.com/?size=100&id=IISmtYu065Oa&format=png&color=ffffff"
                                    className="h-4 w-4"
                                />
                            </button>
                        </div>
                    </form>

                    <div className="flex flex-col items-start justify-start mt-2 w-[90%] sm:w-[50%] sm:min-w-[35rem] px-2 gap-1">
                        {
                            rendomIdeas.map((idea, ind) => {
                                return <React.Fragment key={ind}>
                                    <button 
                                        className="hidden sm:flex items-center gap-1 cursor-pointer border-b p-2 w-full hover:bg-gray-200 hover:rounded-lg hover:border-white"
                                        onClick={() => formik.setFieldValue("prompt", idea)}
                                    >
                                        <img 
                                            className="h-4 aspect-square rotate-180"
                                            src="https://img.icons8.com/?size=100&id=67VPXx2g1stm&format=png&color=000000"
                                        />
                                        <p className="text-gray-700 hover:text-black">{idea}</p>
                                    </button>

                                    <button 
                                        className="flex sm:hidden items-center gap-1 cursor-pointer border-b p-2 w-full hover:bg-gray-200 hover:rounded-lg hover:border-white"
                                        onClick={() => formik.setFieldValue("prompt", idea)}
                                    >
                                        <img 
                                            className="h-4 aspect-square rotate-180"
                                            src="https://img.icons8.com/?size=100&id=67VPXx2g1stm&format=png&color=000000"
                                        />
                                        <p className="text-gray-700 hover:text-black">{idea.length > 40 ? idea.slice(0, 40) + "..." : idea}</p>
                                    </button>
                                </React.Fragment>
                            })
                        }
                    </div>
                </>
            )}
        </div>
    );
}

function formatArticleToHTML(article) {
    console.log(article);

    // Convert headings (#, ##, ### to <h1>, <h2>, <h3>) with Tailwind styles
    article = article.replace(
        /^###### (.*$)/gm,
        '<h6 class="text-lg font-semibold mt-2 mb-1">$1</h6>'
    );
    article = article.replace(
        /^##### (.*$)/gm,
        '<h5 class="text-xl font-semibold mt-2 mb-1">$1</h5>'
    );
    article = article.replace(
        /^#### (.*$)/gm,
        '<h4 class="text-2xl font-semibold mt-2 mb-1">$1</h4>'
    );
    article = article.replace(
        /^### (.*$)/gm,
        '<h3 class="text-3xl font-semibold mt-3 mb-2">$1</h3>'
    );
    article = article.replace(
        /^## (.*$)/gm,
        '<h2 class="text-4xl font-bold mt-4 mb-3">$1</h2>'
    );
    article = article.replace(
        /^# (.*$)/gm,
        '<h1 class="text-5xl font-bold mt-5 mb-4">$1</h1>'
    );

    // Convert bold (**bold** → <strong>) & italics (*italic* → <em>)
    article = article.replace(
        /\*\*(.*?)\*\*/g,
        '<strong class="font-bold">$1</strong>'
    );
    article = article.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

    // Convert inline code (`code` → <code>)
    article = article.replace(
        /`(.*?)`/g,
        '<code class="bg-gray-200 text-red-600 px-1 py-0.5 rounded">$1</code>'
    );

    // Convert blockquotes (> Quote → <blockquote>)
    article = article.replace(
        /^> (.*$)/gm,
        '<blockquote class="border-l-4 border-gray-500 pl-4 italic text-gray-700">$1</blockquote>'
    );

    // Convert horizontal rules (--- → <hr>)
    article = article.replace(
        /^---$/gm,
        '<hr class="border-t-2 border-gray-300 my-4">'
    );

    // Convert unordered lists (* item → <ul><li>item</li></ul>)
    article = article.replace(
        /^\* (.*$)/gm,
        '<li class="ml-4 list-disc">$1</li>'
    );
    article = article.replace(
        /(<li class="ml-4 list-disc">.*<\/li>)/gs,
        '<ul class="list-disc pl-5">$1</ul>'
    );

    // Convert ordered lists (1. item → <ol><li>item</li></ol>)
    article = article.replace(
        /^\d+\. (.*$)/gm,
        '<li class="ml-4 list-decimal">$1</li>'
    );
    article = article.replace(
        /(<li class="ml-4 list-decimal">.*<\/li>)/gs,
        '<ol class="list-decimal pl-5">$1</ol>'
    );

    // Convert links ([text](url) → <a>)
    article = article.replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" class="text-blue-500 underline hover:text-blue-700">$1</a>'
    );

    // Convert multi-line code blocks (```code```)
    article = article.replace(
        /```([\s\S]*?)```/g,
        '<pre class="bg-gray-900 text-white p-3 rounded-md overflow-x-auto"><code>$1</code></pre>'
    );

    // Wrap plain text paragraphs with <p> tags
    article = article.replace(/([^\n]+)(\n|$)/g, '<p class="mb-3">$1</p>');

    return article.replace(/<p[^>]*>undefined<\/p>/g, "");
}
