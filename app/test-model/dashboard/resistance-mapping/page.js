"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const SUS_PATTERNS = ["susceptible", "sus", "s", "sensitive"];
const INT_PATTERNS = ["intermediate", "int", "i"];
const RES_PATTERNS = ["resistant", "res", "r"];

export default function ResistanceMapping() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    const router = useRouter();

    const [mapping, setMapping] = useState({});
    const [dataset, setDataset] = useState([]);
    const [antibioticColumns, setAntibioticColumns] = useState([]);

    const [uniqueValues, setUniqueValues] = useState([]);
    const [susceptible, setSusceptible] = useState([]);
    const [intermediate, setIntermediate] = useState([]);
    const [resistant, setResistant] = useState([]);

    useEffect(() => {
        fetch(`/api/test-model/mapping?id=${id}`)
            .then((res) => res.json())
            .then((res) => {
                if (res.success) {
                    setMapping(res.data.mapping_data || {});
                    setDataset(res.data.dataset || []);
                    setAntibioticColumns(res.data.antibiotic_columns || []);
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
        if (!mapping || !dataset || !antibioticColumns.length) return;
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/resistance-mapping`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                dataset,
                mapping_data: mapping,
                antibiotic_columns: antibioticColumns,
            }),
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.success) {
                    setUniqueValues(res.unique_values || []);
                } else {
                    toast.error("Failed to fetch resistance mapping data.");
                    router.push("/test-model/dashboard/mapping?id=" + id);
                }
            })
    }, [mapping, dataset, antibioticColumns, router]);

    useEffect(() => {
        if (!uniqueValues.length) return;
        const lowerCaseVals = uniqueValues.map((v) => v.toLowerCase());
        if (mapping.succeptible_values) {
            setSusceptible(mapping.susceptible_values || []);
        } else {
            const sus = uniqueValues.filter((val, idx) =>
                SUS_PATTERNS.some((pattern) => lowerCaseVals[idx].includes(pattern))
            );
            setSusceptible(sus);
        }
        if (mapping.intermediate_values) {
            setIntermediate(mapping.intermediate_values || []);
        } else {
            const int = uniqueValues.filter((val, idx) =>
                INT_PATTERNS.some((pattern) => lowerCaseVals[idx].includes(pattern))
            );
            setIntermediate(int);
        }
        if (mapping.resistant_values) {
            setResistant(mapping.resistant_values || []);
        } else {
            const res = uniqueValues.filter((val, idx) =>
                RES_PATTERNS.some((pattern) => lowerCaseVals[idx].includes(pattern))
            );
            setResistant(res);
        }
    }, [uniqueValues]);

    // Multi-select logic for resistance mapping
    function handleMultiSelect(type, value) {
        const setter =
            type === "susceptible"
                ? setSusceptible
                : type === "intermediate"
                    ? setIntermediate
                    : setResistant;
        const arr =
            type === "susceptible"
                ? susceptible
                : type === "intermediate"
                    ? intermediate
                    : resistant;
        if (arr.includes(value)) {
            setter(arr.filter((v) => v !== value));
        } else {
            setter([...arr, value]);
        }
    }

    // Form submit handler (demo only)
    async function handleSubmit(e) {
        e.preventDefault();
        const payload = {
            mapping_data: mapping,
            susceptible_values: susceptible,
            intermediate_values: intermediate,
            resistant_values: resistant,
        };

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/process-resistance`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        }).then((res) => res.json());
        if (res.success) {
            toast.success("Mapping processed successfully!");
            const ress = await fetch("/api/test-model/resistance-mapping", {
                method: 'POST',
                body: JSON.stringify({
                    id: id,
                    mapping: res.mapping_data,
                }),
            }).then((ress) => ress.json());
            if (!ress.success) {
                toast.error(ress.message);
                return;
            }
            router.push(`/test-model/dashboard/result?id=${ress.data._id}&proc=1`);
        } else {
            toast.error(res.error || "Failed to process mapping.");
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center py-8">
            <div className="container mx-auto bg-gray-800 rounded-xl shadow-lg p-8">
                <form onSubmit={handleSubmit}>
                    <h1 className="text-2xl font-bold text-center mb-8 text-white">Resistance Mapping</h1>

                    {/* Resistance mapping multi-selects */}
                    <div className="mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <div className="font-semibold text-blue-400 mb-1">Susceptible</div>
                                <div className="border rounded bg-white min-h-[60px] max-h-40 overflow-y-auto p-2">
                                    {uniqueValues.map((val) => (
                                        <label key={"sus-" + val} className="flex items-center cursor-pointer mb-1">
                                            <input
                                                type="checkbox"
                                                className="mr-2 accent-green-600"
                                                checked={susceptible.includes(val)}
                                                onChange={() => handleMultiSelect("susceptible", val)}
                                            />
                                            <span className="truncate text-gray-800">{val}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="font-semibold text-yellow-500 mb-1">Intermediate</div>
                                <div className="border rounded bg-white min-h-[60px] max-h-40 overflow-y-auto p-2">
                                    {uniqueValues.map((val) => (
                                        <label key={"int-" + val} className="flex items-center cursor-pointer mb-1">
                                            <input
                                                type="checkbox"
                                                className="mr-2 accent-yellow-500"
                                                checked={intermediate.includes(val)}
                                                onChange={() => handleMultiSelect("intermediate", val)}
                                            />
                                            <span className="truncate text-gray-800">{val}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="font-semibold text-red-500 mb-1">Resistant</div>
                                <div className="border rounded bg-white min-h-[60px] max-h-40 overflow-y-auto p-2">
                                    {uniqueValues.map((val) => (
                                        <label key={"res-" + val} className="flex items-center cursor-pointer mb-1">
                                            <input
                                                type="checkbox"
                                                className="mr-2 accent-red-600"
                                                checked={resistant.includes(val)}
                                                onChange={() => handleMultiSelect("resistant", val)}
                                            />
                                            <span className="truncate text-gray-800">{val}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="block mx-auto mt-8 px-8 py-3 rounded bg-blue-700 text-white font-semibold text-lg hover:bg-blue-800 transition"
                    >
                        Next
                    </button>
                </form>
            </div>
        </div>
    );
}
