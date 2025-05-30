"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { parseCookies } from 'nookies';

export default function CreatePage() {
    const [datasetChoice, setDatasetChoice] = useState('upload');
    const [existingDatasets, setExistingDatasets] = useState([
        'Data Copy 2',
        'Data Copy',
        'Data',
    ]);
    const [selectedDataset, setSelectedDataset] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);
    const router = useRouter();

    const handleFormSubmit = async (e) => {
        e.preventDefault();

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
        if (datasetChoice === 'upload') {
            formData.append('csv_file', selectedFile);
        } else {
            formData.append('existing_dataset', selectedDataset);
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dataset-upload`, {
            method: 'POST',
            body: formData,
        }).then((res) => res.json());
        if (res.success) {
            toast.success('Dataset uploaded successfully!');
            const ress = await fetch("/api/test-model/mapping", {
                method: 'POST',
                body: JSON.stringify({
                    id: user.id,
                    dataset: res.dataset,
                    columns: res.columns,
                }),
            }).then((ress) => ress.json());
            if (!ress.success) {
                toast.error(ress.message);
                return;
            }
            router.push('/test-model/dashboard/mapping?id=' + ress.data._id);
        } else {
            console.error('Failed to upload dataset:', res);
            toast.error('Failed to upload dataset: ' + res.message);
        }
    };

    return (
        <div className="min-h-screen bg-[#1E1E1E] text-white flex flex-col">
            <div className="flex flex-col items-center justify-center flex-grow w-full max-w-6xl mx-auto p-4">
                <h1 className="text-2xl mb-10">Uploading your Dataset</h1>

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

                    <button
                        type="submit"
                        className="bg-[#1a2133] hover:bg-[#2a3143] text-white py-3 px-6 rounded w-full max-w-xs mx-auto block"
                    >
                        Upload Dataset
                    </button>
                </form>
            </div>
        </div>
    );
}
