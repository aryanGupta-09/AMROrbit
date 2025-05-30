"use client"

import Image from 'next/image'
import Head from 'next/head'
import toast from 'react-hot-toast';
import { setCookie } from 'nookies';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Replace with your actual signup API endpoint
            const res = await fetch(`/api/test-model/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success) {
                toast.success(data.message || "Login successful!");
                setCookie(null, 'user', JSON.stringify(data.data), {
                    maxAge: 30 * 24 * 60 * 60, // 30 days
                });
                router.push("/test-model/dashboard");
            } else {
                toast.error(data.message || "Login failed.");
            }
        } catch (err) {
            console.error("Login error:", err);
            toast.error("Something went wrong.");
        }
    };

    return (
        <>
            <Head>
                <title>Welcome to AMRSuite</title>
            </Head>

            <main className="flex justify-center items-center flex-1 min-h-[calc(100vh-107px)] bg-[#1E1E1E] px-10">
                <div className="w-full max-w-[450px] bg-[#22252B] p-12 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
                    <section className="w-full">
                        <div className="text-center text-2xl font-bold text-white mb-10">Welcome to AMRSuite</div>

                        <h1 className="text-white text-lg font-semibold mb-6 text-left">Login</h1>
                        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="username"
                                required
                                placeholder="Username"
                                className="w-full p-4 rounded-lg bg-[#E8E8E8] text-black text-base placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:translate-y-[-2px] transition-all"
                                onChange={handleChange}
                            />
                            <input
                                type="password"
                                name="password"
                                required
                                placeholder="Password"
                                className="w-full p-4 rounded-lg bg-[#E8E8E8] text-black text-base placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:translate-y-[-2px] transition-all"
                                onChange={handleChange}
                            />
                            <button
                                type="submit"
                                className="bg-[#1a2133] text-white border-none py-4 px-5 rounded-full text-base font-semibold cursor-pointer transition-all mt-2 hover:bg-[#2a3143] hover:-translate-y-1 hover:shadow-lg"
                            >
                                Sign in
                            </button>
                        </form>
                        <div className='text-center mt-6'>
                            <p className="text-white text-sm mt-4">
                                Don&apos;t have an account?{' '}
                                <a href="/test-model/sign-up" className="text-blue-500 hover:underline">
                                    Sign Up
                                </a>
                            </p>
                        </div>
                    </section>
                </div>
            </main>
        </>
    )
}
