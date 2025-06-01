"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { parseCookies } from 'nookies';

export default function CreatePage() {
    const [datasetChoice, setDatasetChoice] = useState('upload');
    const [existingDatasets, setExistingDatasets] = useState([
        'Data',
    ]);
    const [previousDatasets, setPreviousDatasets] = useState([]);
    const [selectedDataset, setSelectedDataset] = useState('');
    const [selectedPreviousDataset, setSelectedPreviousDataset] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const [consent, setConsent] = useState(false);

    useEffect(() => {
        const fetchPreviousDatasets = async () => {
            const user = JSON.parse(parseCookies().user);
            if (!user || !user.id) return;
            try {
                const res = await fetch(`/api/test-model/previous?id=${user.id}`);
                const data = await res.json();
                if (data.success) {
                    setPreviousDatasets(data.data);
                } else {
                    console.error('Failed to fetch previous datasets:', data.message);
                }
            }
            catch (error) {
                console.error('Error fetching previous datasets:', error);
                toast.error('Failed to fetch previous datasets. Please try again later.');
            }
        };
        fetchPreviousDatasets();
    }, []);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const user = JSON.parse(parseCookies().user);

        if (!user || !user.id) {
            toast.error('You must be logged in to upload a dataset.');
            router.push('/test-model/login');
            return;
        }
        if (datasetChoice === 'existing' && !selectedDataset) {
            alert('Please select an existing dataset');
            return;
        }

        if (datasetChoice === 'upload' && !selectedFile) {
            alert('Please select a file to upload');
            return;
        }

        const formData = new FormData();
        formData.append('dataset_choice', datasetChoice);
        formData.append('user', user.id);
        formData.append('consent', consent);
        if (datasetChoice === 'upload') {
            formData.append('csv_file', selectedFile);
        } else if (datasetChoice === 'previous') {
            formData.append('id', selectedPreviousDataset);
        } else {
            formData.append('existing_dataset', selectedDataset + '.csv');
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dataset-upload`, {
            method: 'POST',
            body: formData,
        }).then((res) => res.json());
        if (res.success) {
            toast.success('Dataset uploaded successfully!');
            // const ress = await fetch("/api/test-model/mapping", {
            //     method: 'POST',
            //     body: JSON.stringify({
            //         id: user.id,
            //         dataset: res.dataset,
            //         columns: res.columns,
            //     }),
            // }).then((ress) => ress.json());
            // if (!ress.success) {
            //     toast.error(ress.message);
            //     return;
            // }
            router.push('/test-model/dashboard/mapping?id=' + res.id);
        } else {
            console.error('Failed to upload dataset:', res);
            toast.error('Failed to upload dataset: ' + res.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#1E1E1E] text-white flex flex-col">
            <div className="flex flex-col items-center justify-center flex-grow w-full max-w-6xl mx-auto p-4">
                <h1 className="text-2xl mb-10">Upload your Dataset</h1>

                <form onSubmit={handleFormSubmit} className="w-full">
                    <div className="flex gap-8 mb-6">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="dataset_choice"
                                value="upload"
                                checked={datasetChoice === 'upload'}
                                onChange={() => setDatasetChoice('upload')}
                            />
                            Upload a new CSV
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="dataset_choice"
                                value="existing"
                                checked={datasetChoice === 'existing'}
                                onChange={() => setDatasetChoice('existing')}
                            />
                            Use existing dataset
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="dataset_choice"
                                value="previous"
                                checked={datasetChoice === 'previous'}
                                onChange={() => setDatasetChoice('previous')}
                            />
                            Use previous dataset
                        </label>
                    </div>

                    {datasetChoice === 'existing' && (
                        <div className="mb-6">
                            <label htmlFor="existing_dataset" className="block mb-2">Select dataset:</label>
                            <select
                                id="existing_dataset"
                                value={selectedDataset}
                                onChange={(e) => setSelectedDataset(e.target.value)}
                                className="text-black p-2 rounded"
                            >
                                <option value="">— choose —</option>
                                {existingDatasets.map((name, i) => (
                                    <option key={i} value={name}>{name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {datasetChoice === 'previous' && (
                        <div className="mb-6">
                            <label htmlFor="previous_dataset" className="block mb-2">Select dataset:</label>
                            <select
                                id="previous_dataset"
                                value={selectedPreviousDataset}
                                onChange={(e) => setSelectedPreviousDataset(e.target.value)}
                                className="text-black p-2 rounded"
                            >
                                <option value="">— choose —</option>
                                {previousDatasets.map((item, i) => (
                                    <option key={i} value={item._id}>{item.file_name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {datasetChoice === 'upload' && (
                        <div
                            className="bg-[#2a2f3b] border-2 border-dashed border-[#3a4155] rounded p-12 text-center mb-6 flex flex-col items-center justify-center"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                if (e.dataTransfer.files.length > 0) {
                                    setSelectedFile(e.dataTransfer.files[0]);
                                }
                            }}
                        >
                            <h3 className="text-2xl mb-4">Drag and drop file here</h3>
                            <p className="text-[#9ba1b0] mb-4">Or browse your file to get started</p>
                            <button
                                type="button"
                                className="bg-[#1a2133] text-white py-2 px-8 rounded hover:bg-[#2a3143]"
                                onClick={() => fileInputRef.current.click()}
                            >
                                Browse
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept=".csv"
                                onChange={(e) => setSelectedFile(e.target.files[0])}
                            />
                            {selectedFile && (
                                <p className="mt-4">Selected file: <span className="font-semibold">{selectedFile.name}</span></p>
                            )}
                        </div>
                    )}

                    <div>
                        <label className="flex items-center gap-2 mb-4">
                            <input
                                type="checkbox"
                                name="consent"
                                checked={consent}
                                onChange={(e) => setConsent(e.target.checked)}
                            />
                            I consent to store my data to update the models.
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="bg-[#1a2133] hover:bg-[#2a3143] text-white py-3 px-6 rounded w-full max-w-xs mx-auto block"
                    >
                        {loading ? 'Uploading...' : 'Upload Dataset'}
                    </button>
                </form>
            </div>
        </div>
    );
}
