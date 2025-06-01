"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { parseCookies } from "nookies";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";

const IsolationBurdenAnalysis = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    const router = useRouter();

    const [mapping, setMapping] = useState({});

    const [user, setUser] = useState({});

    const [bacteriaSpecies, setBacteriaSpecies] = useState([]);
    const [sourceColumns, setSourceColumns] = useState([]);
    const [clusterAttributes, setClusterAttributes] = useState([]);
    const [countryColumns, setCountryColumns] = useState([]);
    const [genderColumns, setGenderColumns] = useState([]);

    // State for form fields
    const [bacteria, setBacteria] = useState("");
    const [source, setSource] = useState("");
    const [clusterAttribute, setClusterAttribute] = useState("");
    const [country, setCountry] = useState("");
    const [genderColumn, setGenderColumn] = useState("");
    const [genderFilter, setGenderFilter] = useState(false);

    // State for UI
    const [loading, setLoading] = useState(false);
    const [graphUrl, setGraphUrl] = useState("");
    const [error, setError] = useState("");
    const downloadBtnRef = useRef(null);

    useEffect(() => {
        const u = parseCookies().user;
        if (!u) {
            router.push('/test-model/login');
        } else {
            setUser(JSON.parse(u));
        }
    }, []);

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
        if (user && Object.keys(mapping).length > 0) {
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/isolation-burden-analysis`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user: user.id,
                    id: id,
                }),
            })
                .then((res) => res.json())
                .then((res) => {
                    if (res.success) {
                        setBacteriaSpecies(res.bacteria_species || []);
                        setSourceColumns(res.source_columns || []);
                        setClusterAttributes(res.cluster_attributes || []);
                        setCountryColumns(res.country_columns || []);
                        setGenderColumns(res.gender_columns || []);
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
    }, [user, mapping]);

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setGraphUrl("");

        const formData = new FormData();
        formData.append("bacteria", bacteria);
        formData.append("source", source);
        formData.append("cluster_attribute", clusterAttribute);
        formData.append("country", country);
        formData.append("gender_column", genderColumn);
        formData.append("gender_filter", genderFilter.toString());
        formData.append("id", id);
        formData.append("user", user.id);

        try {
            // Replace this URL with your backend endpoint
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/generate-isolation-graph`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const imageBlob = await response.blob();
                const imageUrl = URL.createObjectURL(imageBlob);
                setGraphUrl(imageUrl);
            } else {
                setError("Error generating graph. Please try again.");
            }
        } catch {
            setError("Error generating graph. Please try again.");
        }
        setLoading(false);
    };

    // Download handler
    const handleDownload = () => {
        if (!graphUrl) return;
        const link = document.createElement("a");
        link.download = "isolation_burden_analysis.png";
        link.href = graphUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen bg-[#1a1a1a] text-white">
            <div className="main-content px-10 py-10 max-w-6xl mx-auto">
                <div className="flex items-center mb-10">
                    <button
                        className="bg-none border-none text-white text-2xl cursor-pointer mr-5"
                        onClick={() => router.push(`/test-model/dashboard/result?id=${id}&proc=0`)}
                    >
                        ←
                    </button>
                    <h1 className="text-2xl font-semibold">Isolation Burden Analysis</h1>
                </div>

                {/* Controls Section */}
                <div className="bg-[#2a2f3b] p-5 rounded-xl">
                    <form onSubmit={handleSubmit} className="flex flex-wrap items-center space-x-2">
                        <div>
                            <label className="block mb-2 text-sm text-gray-300">
                                Choose Bacteria:
                            </label>
                            <div className="relative bg-gray-200 rounded">
                                <select
                                    className="w-[250px] p-3 rounded bg-gray-200 text-black text-base appearance-none cursor-pointer"
                                    value={bacteria}
                                    onChange={(e) => setBacteria(e.target.value)}
                                    required
                                >
                                    <option value="">Choose Bacteria</option>
                                    {bacteriaSpecies.map((species) => (
                                        <option key={species} value={species}>
                                            {species}
                                        </option>
                                    ))}
                                </select>
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none">
                                    ▼
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="block mb-2 text-sm text-gray-300">
                                Choose Source:
                            </label>
                            <div className="relative bg-gray-200 rounded">
                                <select
                                    className="w-[250px] p-3 rounded bg-gray-200 text-black text-base appearance-none cursor-pointer"
                                    value={source}
                                    onChange={(e) => setSource(e.target.value)}
                                    required
                                >
                                    <option value="">Choose Source</option>
                                    {sourceColumns.map((src) => (
                                        <option key={src} value={src}>
                                            {src}
                                        </option>
                                    ))}
                                </select>
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none">
                                    ▼
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="block mb-2 text-sm text-gray-300">
                                Choose Cluster Attribute:
                            </label>
                            <div className="relative bg-gray-200 rounded">
                                <select
                                    className="w-[250px] p-3 rounded bg-gray-200 text-black text-base appearance-none cursor-pointer"
                                    value={clusterAttribute}
                                    onChange={(e) => setClusterAttribute(e.target.value)}
                                    required
                                >
                                    <option value="">Choose Cluster Attribute</option>
                                    {clusterAttributes.map((attr) => (
                                        <option key={attr} value={attr}>
                                            {attr}
                                        </option>
                                    ))}
                                </select>
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none">
                                    ▼
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="block mb-2 text-sm text-gray-300">
                                Choose Country:
                            </label>
                            <div className="relative bg-gray-200 rounded">
                                <select
                                    className="w-[250px] p-3 rounded bg-gray-200 text-black text-base appearance-none cursor-pointer"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    required
                                >
                                    <option value="">Choose Country</option>
                                    {countryColumns.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none">
                                    ▼
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="block my-2 text-sm text-gray-300">
                                Choose Gender Column:
                            </label>
                            <div className="relative bg-gray-200 rounded">
                                <select
                                    className="w-[250px] p-3 rounded bg-gray-200 text-black text-base appearance-none cursor-pointer"
                                    value={genderColumn}
                                    onChange={(e) => setGenderColumn(e.target.value)}
                                    required
                                >
                                    <option value="">Choose Gender Column</option>
                                    {genderColumns.map((col) => (
                                        <option key={col} value={col}>
                                            {col}
                                        </option>
                                    ))}
                                </select>
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none">
                                    ▼
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="block my-2 text-sm text-gray-300">
                                Gender Filter:
                            </label>
                            <div className="relative inline-block w-[60px] h-[34px]">
                                <input
                                    type="checkbox"
                                    id="gender-filter"
                                    checked={genderFilter}
                                    onChange={() => setGenderFilter((v) => !v)}
                                    className="opacity-0 w-0 h-0"
                                />
                                <label
                                    htmlFor="gender-filter"
                                    className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-[#464F62] rounded-full transition-colors duration-300 ${genderFilter ? "bg-[#1a2133]" : ""
                                        }`}
                                >
                                    <span
                                        className={`absolute left-1 bottom-1 bg-white rounded-full transition-transform duration-300 w-[26px] h-[26px] ${genderFilter ? "translate-x-7" : ""
                                            }`}
                                    ></span>
                                </label>
                            </div>
                        </div>

                        <div className="ml-5 mt-5 flex justify-end items-end">
                            <button
                                type="submit"
                                className="w-full p-3 bg-[#1a2133] text-white rounded cursor-pointer text-base transition-colors duration-300 hover:bg-[#2a3143]"
                                disabled={loading}
                            >
                                {loading ? "Generating..." : "Generate"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Graph Section */}
                <div className="bg-[#2a2f3b] p-5 rounded-xl min-h-[400px] flex items-center justify-center relative">
                    {graphUrl ? (
                        <>
                            <button
                                ref={downloadBtnRef}
                                className="absolute top-2.5 right-2.5 bg-[#1a2133] rounded w-10 h-10 flex items-center justify-center z-10 transition-colors duration-300 hover:bg-[#2a3143]"
                                onClick={handleDownload}
                                title="Download Graph"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    className="w-5 h-5 fill-white"
                                >
                                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                                </svg>
                            </button>
                            <img
                                src={graphUrl}
                                alt="Isolation Burden Graph"
                                className="max-w-full h-auto block"
                            />
                        </>
                    ) : (
                        <div className="w-full h-[400px] bg-[#1a1a1a] rounded flex items-center justify-center text-gray-400 text-lg">
                            {loading
                                ? "Generating graph..."
                                : error
                                    ? error
                                    : "Select attributes and generate to view the graph"}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default IsolationBurdenAnalysis;