"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const DashboardPage = () => {
    const router = useRouter();

    const [user, setUser] = useState(null);

    const [tests, setTests] = useState([]);

    useEffect(() => {
        const u = parseCookies().user;
        if (!u) {
            router.push('/test-model/login');
        } else {
            setUser(JSON.parse(u));
        }
    }, []);

    useEffect(() => {
        fetch(`/api/test-model`)
            .then((res) => res.json())
            .then((res) => {
                if (res.success) {
                    setTests(res.data);
                } else {
                    toast.error(
                        "Failed to fetch data. Reason: " + res.message
                    );
                }
            })
            .catch((err) => {
                console.error("Error fetching data:", err);
                toast.error("Error fetching data. Please try again later.");
            });
    }, []);

    const readableDate = (date) => {
        date = new Date(date);
        return date.toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
            timeZone: 'UTC' // Optional: remove or change if you want local time
        });
    }

    return (
        <>
            <div className="container mx-auto p-5">
                <div>
                    <Link href="/test-model/dashboard/create" className="bg-blue-500 text-white py-2 px-7 rounded">
                        Create New Test
                    </Link>
                </div>
                <div className="mt-5 text-white">
                    <h2 className="text-2xl font-bold mb-4">Your Run History</h2>
                    {tests.length > 0 ? (
                        <ul className="space-y-4">
                            {tests.map((test) => (
                                <li key={test.id} className="border p-4 rounded">
                                    <h3 className="text-xl font-semibold">{readableDate(test.created_at)}</h3>
                                    
                                    <Link href={`/test-model/dashboard/result?id=${test._id}`} className="text-blue-500 hover:underline">
                                        View
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No tests found. Create a new test to get started.</p>
                    )}
                </div>
            </div>
        </>
    )
}

export default DashboardPage;