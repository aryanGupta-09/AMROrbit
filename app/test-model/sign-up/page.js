"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
    });
    const [message, setMessage] = useState(null);

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Replace with your actual signup API endpoint
            const res = await fetch(`/api/test-model/sign-up`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (data.success) {
                toast.success(data.message || "Account created successfully!");
                router.push("/test-model/login");
            } else {
                toast.error(data.message || "Account creation failed.");
            }
        } catch (err) {
            toast.error("Something went wrong.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#1E1E1E] text-white">
            <div className="flex flex-1">
                {/* Left Half */}
                <div className="w-1/2 bg-[#22252B] flex justify-center items-center p-10">
                    <section className="w-full max-w-md">
                        <div className="text-3xl font-bold text-center mb-8">Create Account</div>

                        {message && (
                            <div
                                className={`relative p-4 mb-6 rounded ${message.type === "error"
                                    ? "bg-red-100 text-red-800 border border-red-300"
                                    : "bg-green-100 text-green-800 border border-green-300"
                                    }`}
                            >
                                {message.text}
                                <button
                                    onClick={() => setMessage(null)}
                                    className="absolute top-0 right-0 px-4 py-2 text-xl"
                                >
                                    &times;
                                </button>
                            </div>
                        )}

                        <h1 className="mb-6 text-lg font-normal">Sign Up</h1>
                        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="first_name"
                                placeholder="First Name"
                                className="px-4 py-3 rounded bg-gray-200 text-black"
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="text"
                                name="last_name"
                                placeholder="Last Name"
                                className="px-4 py-3 rounded bg-gray-200 text-black"
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                className="px-4 py-3 rounded bg-gray-200 text-black"
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                className="px-4 py-3 rounded bg-gray-200 text-black"
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                className="px-4 py-3 rounded bg-gray-200 text-black"
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="submit"
                                className="bg-[#1a2133] text-white rounded-full py-3 text-base hover:opacity-90"
                            >
                                Create Account
                            </button>
                        </form>
                    </section>
                </div>

                {/* Right Half */}
                <div className="w-1/2 bg-[#191D23] flex justify-center items-center p-10">
                    <section className="w-full max-w-md text-center">
                        <h2 className="text-2xl mb-6">Already have an account?</h2>
                        <p className="text-[#9ba1b0] text-lg mb-12 leading-relaxed">
                            Sign in to continue your work!
                        </p>
                        <a
                            href="/test-model/login"
                            className="inline-block bg-[#464F62] text-white rounded-full px-10 py-3 text-lg hover:opacity-90"
                        >
                            Login
                        </a>
                    </section>
                </div>
            </div>
        </div>
    );
}
