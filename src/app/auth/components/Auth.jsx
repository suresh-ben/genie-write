"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { Playfair_Display } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import { signInWithCredentials, signInWithGoogle } from "@/actions/auth";

import * as YUP from 'yup';
import { useFormik } from "formik";

import loading from '../../../../public/loading.json'
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const playfairDisplay = Playfair_Display({
    variable: "--font-playfair-display",
    subsets: ["latin"],
});

export default function Auth() {

    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    useEffect(() => {
        const authenticatingButtons = document.getElementsByClassName("auth");

        for (let i = 0; i < authenticatingButtons.length; i++) {
            authenticatingButtons[i].addEventListener("click", () => {
                setIsAuthenticating(true);
            });
        }

        return () => {
            for (let i = 0; i < authenticatingButtons.length; i++) {
                authenticatingButtons[i].removeEventListener("click", () => {
                    setIsAuthenticating(true);
                });
            }
        }
    }, []);

    const FORM_TYPES = {
        SIGN_IN: "sign-in",
        SIGN_UP: "sign-up"
    }
    const [apiError, setApiError] = useState(null);
    const formik = useFormik({
        initialValues: {
            formType: FORM_TYPES.SIGN_IN,
            name: "",
            email: "",
            password: ""
        },
        validationSchema: YUP.object({
            name: YUP.string()
                .min(3, "Please provide a valid name")
                .max(100, "Please provide a valid name")
                .when('formType', (value, schema) => {
                    const formType = value[0];

                    if (formType == FORM_TYPES.SIGN_UP) return schema.required('Please provide a valid name');
                    return schema;
                }),
            email: YUP.string()
                .email()
                .max(3000, "Please provide a valid email ID")
                .required("Please provide a valid email ID"),
            password: YUP.string()
                .min(8, "Password must contain at least 8 characters")
                .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least 1 special character")
                .matches(/[a-z]/, "Password must contain at least 1 lowercase letter")
                .matches(/[A-Z]/, "Password must contain at least 1 uppercase letter")
                .required("Please provide password")
        }),

        onSubmit: async ({ name, email, password }) => {
            try {
                setIsLoading(true);

                const formData = new FormData();
                formData.append('name', name);
                formData.append('email', email);
                formData.append('password', password);

                await signInWithCredentials(formData);
            } catch (error) {
                setApiError("Please check credentials and try again!")
            } finally {
                setIsLoading(false);
            }
        },

        validateOnBlur: true,
        validateOnChange: true,
    })

    useEffect(() => {
        setApiError(null);
    }, [formik.values])

    const handleSignInWithGoogle = async () => {
        try {
            setIsLoading(true);
            await signInWithGoogle();
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    return <>
        {   
            // If siningout make a loading, covering whole pahe
            isLoading && <div className='fixed z-[1000] top-0 left-0 w-screen h-screen flex justify-center items-center bg-[rgba(255,255,255,0.5)] backdrop-blur-sm'>
                <Lottie 
                    animationData={loading}
                    loop={true}
                    autoPlay={true}
                    className="w-[5rem] h-[5rem]"
                />
            </div>
        }
        <AnimatePresence>
            
            {
                isAuthenticating && <motion.div 
                    className="w-screen h-screen fixed z-10 bg-[rgba(255,255,255,0.75)] flex justify-center items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}

                    transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                    <motion.div 
                        className="w-[90%] sm:w-[45%] h-[80%] flex flex-col rounded-xl drop-shadow-2xl bg-white p-4 justify-center items-center gap-16 relative"
                        initial={{ scale: 0.75, y: 100 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.5 }}

                        transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                        <button 
                            className="absolute top-4 right-4 h-5 aspect-square cursor-pointer"
                            onClick={() => setIsAuthenticating(false)}            
                        >
                            <img src="https://img.icons8.com/?size=100&id=3AeKu2y6fJeH&format=png&color=000000" alt="Close" />
                        </button>
            
                        <p className={`text-4xl ${playfairDisplay.className}`}>Join GenieWrite</p>
            
                        <div className="flex flex-col">
                            <button 
                                className="text-sm border rounded-full py-2 px-4 w-[20rem] flex justify-center items-center relative cursor-pointer hover:scale-[0.99]"
                                onClick={handleSignInWithGoogle}
                            >
                                <img 
                                    src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000" 
                                    alt="Google"
                                    className="absolute h-[70%] left-2"
                                />
                                <p>Continue with Google</p>
                            </button>

                            <div className="flex items-center justify-center gap-4 my-4">
                                <hr className="w-[40%]"/>
                                    <p className="text-sm">or</p>
                                <hr className="w-[40%]" />
                            </div>

                            <form
                                className="flex flex-col gap-2"
                                onSubmit={formik.handleSubmit}
                            >
                                {
                                    formik.values?.formType === FORM_TYPES.SIGN_UP && <input 
                                        name="name" 
                                        type="text" 
                                        placeholder="Name" 
                                        className="w-[20rem] border rounded-full py-2 px-4 text-sm"
                                        onChange={formik.handleChange}
                                    />
                                }
                                <input 
                                    name="email" 
                                    type="email" 
                                    placeholder="Email" 
                                    className="w-[20rem] border rounded-full py-2 px-4 text-sm"
                                    onChange={formik.handleChange}
                                />
                                <input 
                                    name="password" 
                                    type="password" 
                                    placeholder="Password" 
                                    className="w-[20rem] border rounded-full py-2 px-4 text-sm"
                                    onChange={formik.handleChange}
                                />
                                <p className="text-xs text-red-500 -mt-2">&nbsp; {(formik.touched.name && formik.errors.name? formik.errors.name : (
                                    formik.touched.email && formik.errors.email? formik.errors.email : (
                                    formik.touched.password && formik.errors.password? formik.errors.password : (
                                    apiError? apiError : ""
                                ))))}</p>

                                <button
                                    type="submit"
                                    className="text-sm bg-black text-white border rounded-full py-2 px-4 w-[20rem] flex justify-center items-center relative cursor-pointer hover:scale-[0.99]"
                                >
                                    <p>{formik.values.formType === FORM_TYPES.SIGN_IN? "SignIn" : "SignUp"} with Email</p>
                                </button>
                            </form>

                            {
                                formik.values?.formType == FORM_TYPES.SIGN_UP && <div className="flex justify-center items-center gap-1 text-sm mt-1">
                                    <p className="text-gray-800">Already have an account?</p>
                                    <button 
                                        type="button"
                                        className="font-medium cursor-pointer"
                                        onClick={() => formik.setFieldValue("formType", FORM_TYPES.SIGN_IN)}
                                    >SignIn</button>
                                </div>
                            }
                            {
                                formik.values?.formType == FORM_TYPES.SIGN_IN && <div className="flex justify-center items-center gap-1 text-sm mt-1">
                                    <p className="text-gray-800">New to GenieWrite?</p>
                                    <button 
                                        type="button"
                                        className="font-medium cursor-pointer"
                                        onClick={() => formik.setFieldValue("formType", FORM_TYPES.SIGN_UP)}
                                    >SignUp</button>
                                </div>
                            }
                        </div>
            
                        <p className="text-xs text-center w-[70%]">By clicking “Continue” you agree to GenieWrite’s Terms of Service and acknowledging that Medium’s Privacy Policy applies to you.</p>
                    </motion.div>
                </motion.div>
            }
        </AnimatePresence>
    </>;
}
