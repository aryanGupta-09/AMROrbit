import { useSelector } from "react-redux";
import { optionsSelector } from "@/redux/reducers/optionsReducer";
import { useEffect, useState } from 'react';

export default function Plots() {
    const options = useSelector(optionsSelector);
    const [files, setFiles] = useState([]);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await fetch(`/api/searchFiles?antibiotic=${options.antibiotic}&organism=${options.organism}`);
                console.log('Response:', response); // Log the response
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const contentType = response.headers.get("content-type");
                console.log('Content-Type:', contentType); // Log the content type
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const data = await response.json();
                    console.log('Data:', data); // Log the data
                    setFiles(data.files);
                } else {
                    throw new Error("Response is not JSON");
                }
            } catch (error) {
                console.error('Error fetching files:', error);
            }
        };

        fetchFiles();
    }, [options]);

    return (
        <div>
            <ul>
                {files.map(file => (
                    <li key={file}>
                        <a href={`/${file}`} target="_blank" rel="noopener noreferrer">{file}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
}