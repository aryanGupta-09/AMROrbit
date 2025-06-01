"use client";

import { useRouter } from "next/navigation";
import { parseCookies } from "nookies";
import { useEffect } from "react";
import { AiOutlineLoading } from "react-icons/ai";

const TestModelPage = () => {
    const router = useRouter();

    useEffect(() => {
        router.push('/test-model/dashboard');
        // const user = parseCookies().user;
        // if (!user) {
        //     router.push('/test-model/login');
        // } else {
        //     router.push('/test-model/dashboard');
        // }
    }, []);

    return (
        <>
            <div className="min-h-screen flex justify-center items-center">
                <AiOutlineLoading className="animate-spin text-7xl text-white" />
            </div>
        </>
    )
}

export default TestModelPage;