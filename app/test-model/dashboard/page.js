"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const dataReq = [
    {
        title: "🗓️ Temporal Data",
        points: ['Collection date/time', 'Reporting period', 'Year/Month/Quarter']
    },
    {
        title: "📍 Spatial Data",
        points: ['Country/Region', 'Healthcare facility', 'Geographic coordinates (optional)']
    },
    {
        title: "🦠 Pathogen Information",
        points: ['Organism name/code', 'Specimen type', 'Isolation source']
    },
    {
        title: "💊 Antimicrobial Data",
        points: ['Drug name/code', 'Susceptibility result (S/I/R)', 'MIC values (optional)']
    },
    {
        title: "🏥 Clinical Context",
        points: ['Patient demographics', 'Hospital ward/department', 'Infection type']
    },
    {
        title: "📊 Quality Metrics",
        points: ['Total isolates tested', 'QC/QA indicators', 'Data completeness']
    },
]


const DashboardPage = () => {
    const router = useRouter();

    const [user, setUser] = useState(null);

    const [tests, setTests] = useState([]);

    const [view, setView] = useState(false);

    useEffect(() => {
        const u = parseCookies().user;
        if (!u) {
            // do nothing
        } else {
            setUser(JSON.parse(u));
        }
    }, []);

    useEffect(() => {
        if (user && user.id) {
            fetch(`/api/test-model?id=${user.id}`)
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
        }
    }, [user]);

    const readableDate = (date) => {
        date = new Date(date);
        return date.toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
            timeZone: 'UTC' // Optional: remove or change if you want local time
        });
    }

    useEffect(() => {
        function handleEsc(e) {
            if (e.key === "Escape") {
                setView(false);
            }
        }
        window.addEventListener("keydown", handleEsc);
        return () => {
            window.removeEventListener("keydown", handleEsc);
        };
    }, []);

    return (
        <>
            <div className="container mx-auto p-5 space-y-5">
                <div className="bg-white shadow-xl rounded-xl px-5 py-10 text-center text-black space-y-5">
                    <h1 className="text-xl md:text-4xl font-bold">
                        🧪 Test Our AMR Models
                    </h1>
                    <p className="w-full md:w-2/3 mx-auto">
                        Upload your antimicrobial resistance data and generate custom scorecards, isolation burden analysis, and resistance pattern insights using our validated models. Perfect for researchers, healthcare institutions, and policy makers.
                    </p>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start space-x-3">
                    <div className="bg-white rounded-xl px-5 py-3 flex flex-col space-y-5">
                        <div className="bg-indigo-600 text-white rounded-full p-2 w-12 h-12 flex justify-center items-center text-xl">
                            1
                        </div>
                        <div className="space-y-5">
                            <h1 className="text-xl font-bold">
                                📊 Upload Your Data
                            </h1>
                            <p>
                                Upload your antimicrobial resistance surveillance data in CSV format.
                            </p>
                            <div>
                                {user ? (
                                    <Link href="/test-model/dashboard/create" className="bg-indigo-600 text-white py-2 px-7 rounded-xl">
                                        Start
                                    </Link>
                                ) : (
                                    <Link href="/test-model/login" className="bg-indigo-600 text-white py-2 px-7 rounded-xl">
                                        Get Started Now
                                    </Link>
                                )}
                            </div>
                            <button className="text-blue-500" onClick={() => setView(true)}>
                                View Data Requirements
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl px-5 py-3 flex flex-col space-y-5">
                        <div className="bg-indigo-600 text-white rounded-full p-2 w-12 h-12 flex justify-center items-center text-xl">
                            2
                        </div>
                        <div className="space-y-5">
                            <h1 className="text-xl font-bold">
                                🗺️ Map Your Variables
                            </h1>
                            <p>
                                Map your data columns to our model variables for accurate analysis.
                            </p>
                            <div>
                                {/* upload goes here */}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl px-5 py-3 flex flex-col space-y-5">
                        <div className="bg-indigo-600 text-white rounded-full p-2 w-12 h-12 flex justify-center items-center text-xl">
                            3
                        </div>
                        <div className="space-y-5">
                            <h1 className="text-xl font-bold">
                                ⚙️ Configure Analysis
                            </h1>
                            <p>
                                Set your spatial and temporal granularity preferences for the analysis.
                            </p>
                            <div>
                                {/* upload goes here */}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl px-5 py-3 flex flex-col space-y-5">
                        <div className="bg-indigo-600 text-white rounded-full p-2 w-12 h-12 flex justify-center items-center text-xl">
                            4
                        </div>
                        <div className="space-y-5">
                            <h1 className="text-xl font-bold">
                                🚀 Generate Results
                            </h1>
                            <p>
                                Run our models and generate comprehensive AMR insights and scorecards.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow-xl rounded-xl p-5 text-center text-black space-y-5">
                    <h1 className="text-2xl font-bold">
                        📋 Data Requirements & Guidelines
                    </h1>
                    <p>
                        To ensure accurate model predictions, your data should include the following fields:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {dataReq.map((item, i) => (
                            <div key={i} className="border rounded-xl shadow-xl p-5 text-left space-y-2 hover:border-indigo-500 duration-500 tranform">
                                <h1 className="text-lg font-medium">
                                    {item.title}
                                </h1>
                                <ul className="space-y-2">
                                    {item.points.map((t, j) => (
                                        <li key={j}>+ {t}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {user && (
                    <>
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

                                            <Link href={`/test-model/dashboard/result?id=${test._id}&proc=0`} className="text-blue-500 hover:underline">
                                                View
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No tests found. Create a new test to get started.</p>
                            )}
                        </div>
                    </>
                )}
            </div>

            {view && (
                <div className="min-h-screen fixed top-0 right-0 w-full flex justify-center items-center bg-black/20">
                    <div className="bg-white shadow-xl p-10 rounded-xl flex flex-col space-y-5">
                        <div className="flex justify-end">
                            <button onClick={() => setView(false)}>
                                X
                            </button>
                        </div>
                        <h1 className="text-2xl font-bold">
                            📋 Detailed Data Requirements
                        </h1>
                        <p>
                            For optimal model performance, ensure your data includes:
                        </p>
                        <h3 className="text-lg font-medium">
                            Minimum Required Fields:
                        </h3>
                        <ul className="list-inside space-y-2">
                            <li>- Date/Time stamp</li>
                            <li>- Geographic identifier (country/region)</li>
                            <li>- Pathogen identification</li>
                            <li>- Antimicrobial agent</li>
                            <li>- Susceptibility result</li>
                        </ul>

                        <h3 className="text-lg font-medium">
                            Recommended Fields:
                        </h3>
                        <ul className="list-inside space-y-2">
                            <li>- Patient demographics (age, gender)</li>
                            <li>- Clinical setting (ICU, ward)</li>
                        </ul>
                    </div>
                </div>
            )}
        </>
    )
}

export default DashboardPage;