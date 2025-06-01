"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResultsPage() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const proc = searchParams.get("proc");

    const router = useRouter();
    
    const [mapping, setMapping] = useState({});
    
    const [steps, setSteps] = useState({
        format: null,
        structure: null,
        missing_data: null,
        duplicates: null,
    });
    const [alerts, setAlerts] = useState([]);
    const [duplicates, setDuplicates] = useState(0);
    const [showDuplicatePrompt, setShowDuplicatePrompt] = useState(false);

    useEffect(() => {
        fetch(`/api/test-model/mapping?id=${id}`)
            .then((res) => res.json())
            .then((res) => {
                if (res.success) {
                    setMapping(res.data.mapping_data || {});
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
    }, [id]);

    useEffect(() => {
        if (proc == "1") {
            if (Object.keys(mapping).length > 0) {
                validateDataset();
            }
        } else {
            setSteps({
                format: true,
                structure: true,
                missing_data: true,
                duplicates: true,
            });
            setAlerts([]);
            setDuplicates(0);
            setShowDuplicatePrompt(false);
        }
    }, [mapping]);

    async function validateDataset() {
        setAlerts([]);
        setSteps({
            format: null,
            structure: null,
            missing_data: null,
            duplicates: null,
        });
        setDuplicates(0);
        setShowDuplicatePrompt(false);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/validate-dataset`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: id,
                    mapping_data: mapping,
                }),
            }).then((res) => res.json());
            if (res.success) {
                setSteps({
                    format: res.steps.format,
                    structure: res.steps.structure,
                    missing_data: res.steps.missing_data,
                    duplicates: res.steps.duplicates,
                });
                let newAlerts = [];
                Object.entries(res.steps).forEach(([step, passed]) => {
                    if (!passed) {
                        let message = "";
                        switch (step) {
                            case "format":
                                message = "File format validation failed";
                                break;
                            case "structure":
                                message = "Dataset structure validation failed";
                                break;
                            case "missing_data":
                                message = "Critical missing data detected";
                                break;
                            case "duplicates":
                                message = `${res.duplicates} duplicate records found`;
                                break;
                            default:
                                break;
                        }
                        newAlerts.push({ type: "error", message });
                    }
                });
                if (res.warnings && res.warnings.length > 0) {
                    res.warnings.forEach((warning) =>
                        newAlerts.push({ type: "warning", message: warning })
                    );
                }
                if (res.errors && res.errors.length > 0) {
                    res.errors.forEach((error) =>
                        newAlerts.push({ type: "error", message: error })
                    );
                }
                setAlerts(newAlerts);
                if (res.duplicates > 0) {
                    setDuplicates(res.duplicates);
                    setShowDuplicatePrompt(true);
                }
            } else {
                setAlerts([{ type: "error", message: "Validation failed: " + res.message }]);
            }
        } catch (error) {
            setAlerts([{ type: "error", message: "Error during validation: " + error.message }]);
        }
    }

    function handleDuplicatePrompt(continueProcess) {
        setShowDuplicatePrompt(false);
        if (!continueProcess) {
            router.push(`/test-model/dashboard/create`);
        }
    }

    const statusItems = [
        { id: "format", label: "File Format" },
        { id: "structure", label: "Dataset Structure" },
        { id: "missing_data", label: "Missing Data Analysis" },
        { id: "duplicates", label: "Duplicate Records" },
    ];

    return (
        <div className="min-h-screen bg-[#121316] text-white flex flex-col">
            <div className="flex flex-1 p-10 gap-10 bg-[#121316]">
                <div className="flex-1 p-5">
                    <h1 className="text-3xl mb-8 font-semibold">Processing your Dataset</h1>
                    <div className="mb-8 w-full">
                        {statusItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center mb-5 text-white text-lg relative bg-transparent"
                            >
                                {steps[item.id] === null ? (
                                    <span className="inline-block w-6 h-6 border-4 border-white/30 border-t-[#3498db] rounded-full animate-spin mr-4"></span>
                                ) : steps[item.id] ? (
                                    <span className="text-green-500 text-2xl mr-4">✓</span>
                                ) : (
                                    <span className="text-red-500 text-2xl mr-4">✗</span>
                                )}
                                <span className="flex-1 text-lg">{item.label}</span>
                                <span className="ml-auto text-base text-white/80">
                                    {steps[item.id] === null
                                        ? ""
                                        : steps[item.id]
                                            ? "Passed"
                                            : "Failed"}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-5">
                        {alerts.map((alert, idx) => (
                            <div
                                key={idx}
                                className={`p-3 mb-2 text-white border-l-4 bg-black/20 ${alert.type === "error"
                                        ? "border-red-500"
                                        : alert.type === "warning"
                                            ? "border-yellow-500"
                                            : ""
                                    }`}
                            >
                                {alert.message}
                            </div>
                        ))}
                    </div>
                    {showDuplicatePrompt && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
                            <div className="bg-[#181a1f] p-8 rounded-lg shadow-lg max-w-sm w-full">
                                <div className="mb-4 text-lg font-semibold">
                                    Found {duplicates} duplicate records. Do you want to continue?
                                </div>
                                <div className="flex gap-4 justify-end">
                                    <button
                                        className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
                                        onClick={() => handleDuplicatePrompt(true)}
                                    >
                                        Continue
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
                                        onClick={() => handleDuplicatePrompt(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex-1 p-5">
                    <h2 className="text-2xl mb-6 font-semibold">View Results</h2>
                    <div className="flex flex-col gap-4">
                        <Link href={`/test-model/dashboard/result/isolation_burden_analysis?id=${id}`}>
                            <button className="w-full py-4 bg-[#2c3e50] text-white rounded-lg text-base hover:bg-[#34495e] transition-colors mb-2">
                                Isolation Burden Analysis
                            </button>
                        </Link>
                        <Link href={`/test-model/dashboard/result/resistance_analysis?id=${id}`}>
                            <button className="w-full py-4 bg-[#2c3e50] text-white rounded-lg text-base hover:bg-[#34495e] transition-colors mb-2">
                                Resistance Analysis
                            </button>
                        </Link>
                        <Link href={`/test-model/dashboard/result/scorecards?id=${id}`}>
                            <button className="w-full py-4 bg-[#2c3e50] text-white rounded-lg text-base hover:bg-[#34495e] transition-colors mb-2">
                                Scorecards
                            </button>
                        </Link>
                        <Link href={`/test-model/dashboard/result/synthetic_dataset_creation?id=${id}`}>
                            <button className="w-full py-4 bg-[#2c3e50] text-white rounded-lg text-base hover:bg-[#34495e] transition-colors mb-2">
                                Synthetic Dataset Creation
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
