import { useSelector } from "react-redux";
import { optionsSelector } from "@/redux/reducers/optionsReducer";
import { useEffect, useState } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();


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


    const getScale = (width) => {
        // 2 elements per row
        if (width >= 1700) {
            return 1.2;
        } else if (width >= 1485) {
            return 1.1;
        // 1 element per row
        } else if (width >= 1024) {
            return 1.3; // lg
        } else if (width >= 768) {
            return 1.2; // md
        } else if (width >= 640) {
            return 1.1; // sm
        } else {
            return 1; // xs
        }
    };

    const [scale, setScale] = useState(getScale(window.innerWidth));

    useEffect(() => {
        const updateScale = () => {
            setScale(getScale(window.innerWidth));
        };

        window.addEventListener('resize', updateScale);
        return () => {
            window.removeEventListener('resize', updateScale);
        };
    }, []);


    return (
        <div className="flex flex-wrap justify-around gap-y-2">
            {files.map((file, index) => (
                <div key={index}>
                    <Document file={`/${file}`}>
                        <Page pageNumber={1} renderTextLayer={false} renderAnnotationLayer={false} scale={scale} />
                    </Document>
                </div>
            ))}
        </div>
    );
}