"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { parseCookies } from 'nookies';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function SyntheticDatasetCreation() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    const router = useRouter();

    const [dataset, setDataset] = useState([]);
    const [mapping, setMapping] = useState({});

    const [user, setUser] = useState({});

    const [nTotal, setNTotal] = useState(10000);
    const [preserveProportions, setPreserveProportions] = useState('country_year');
    const [anonymize, setAnonymize] = useState(true);
    const [generatePlots, setGeneratePlots] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [placeholderText, setPlaceholderText] = useState('Configure parameters and generate your dataset.');

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
                    setDataset(res.data.dataset || []);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setPlaceholderText('Generating synthetic dataset...');

        const payload = {
            n_total: parseInt(nTotal, 10),
            preserve_proportions: preserveProportions,
            anonymize: anonymize,
            generate_plots: generatePlots,
            user: user?.id || "anonymous",
            id: id || "",
        };

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/generate-synthetic-dataset`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("API failed");

            const blob = await res.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = 'synthetic_output_bundle.zip';
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);

            setPlaceholderText('Dataset generated and downloaded!');
        } catch (err) {
            console.error(err);
            setPlaceholderText('Error generating dataset.');
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <div className="min-h-screen bg-[#1E1E1E] text-white flex flex-col">
            <main className="flex-1 max-w-5xl mx-auto p-10">
                <div className="flex items-center mb-10">
                    <button className="text-white text-2xl mr-5" onClick={() => window.history.back()}>&larr;</button>
                    <h1 className="text-2xl font-semibold">Synthetic Dataset Creation</h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-10">
                    <section className="bg-[#2a2f3b] p-6 rounded-xl">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-5">
                                <label htmlFor="n_total" className="block mb-2 text-sm text-gray-300">Total Samples</label>
                                <input
                                    type="number"
                                    id="n_total"
                                    name="n_total"
                                    min={100}
                                    max={50000}
                                    value={nTotal}
                                    onChange={e => setNTotal(Number(e.target.value))}
                                    required
                                    className="w-full p-3 rounded bg-[#1e1e1e] border border-gray-600 text-white"
                                />
                            </div>
                            <div className="mb-5">
                                <label htmlFor="preserve_proportions" className="block mb-2 text-sm text-gray-300">Preserve Proportions</label>
                                <div className="relative">
                                    <select
                                        id="preserve_proportions"
                                        name="preserve_proportions"
                                        value={preserveProportions}
                                        onChange={e => setPreserveProportions(e.target.value)}
                                        className="w-full p-3 rounded bg-gray-200 text-black appearance-none cursor-pointer"
                                    >
                                        <option value="country_year">Country-Year</option>
                                        <option value="species">Species</option>
                                        <option value="none">None</option>
                                    </select>
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none">▼</span>
                                </div>
                            </div>
                            <div className={`flex items-center gap-2 mb-5 transition-opacity ${preserveProportions === 'none' ? 'opacity-50' : ''}`}>
                                <input
                                    type="checkbox"
                                    id="anonymize"
                                    name="anonymize"
                                    checked={anonymize}
                                    onChange={e => setAnonymize(e.target.checked)}
                                    disabled={preserveProportions === 'none'}
                                />
                                <label htmlFor="anonymize" className="text-sm">Anonymize Study, Country, and State</label>
                            </div>
                            <div className="flex items-center gap-2 mb-7">
                                <input
                                    type="checkbox"
                                    id="generate_plots"
                                    name="generate_plots"
                                    checked={generatePlots}
                                    onChange={e => setGeneratePlots(e.target.checked)}
                                />
                                <label htmlFor="generate_plots" className="text-sm">Generate Visualization Plots</label>
                            </div>
                            <button
                                type="submit"
                                className="w-full p-3 bg-[#1a2133] text-white rounded hover:bg-[#2a3143] transition flex items-center justify-center"
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>
                                        Generating...
                                        <span className="ml-2 inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    </>
                                ) : (
                                    'Generate Synthetic Dataset'
                                )}
                            </button>
                        </form>
                    </section>
                    <section className="bg-[#2a2f3b] p-6 rounded-xl min-h-[400px] flex items-center justify-center">
                        <div className="w-full h-[400px] bg-[#1a1a1a] rounded flex items-center justify-center text-gray-400 text-lg">
                            {placeholderText}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
