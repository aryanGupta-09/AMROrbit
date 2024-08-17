import { useSelector } from "react-redux";
import { leadLagOptionsSelector } from "@/redux/reducers/leadLagOptionsReducer";
import { useState, useEffect } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

import VisualizationBox from "@/components/common/VisualizationBox";

export default function LeadLagPlots() {
    const options = useSelector(leadLagOptionsSelector);

    const [fileUrl, setFileUrl] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [firstRender, setFirstRender] = useState(true);

    useEffect(() => {
        const fetchFile = async () => {
            try {
                const response = await fetch(`/api/searchLeadLags?organism=${encodeURIComponent(options.organism)}&sampleType=${encodeURIComponent(options.sampleType)}`);
                console.log('Response:', response); // Log the response
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const contentType = response.headers.get("content-type");
                console.log('Content-Type:', contentType); // Log the content type
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const data = await response.json();
                    console.log('Data:', data); // Log the data
                    if (data.fileUrl) {
                        setFileUrl(data.fileUrl);
                        setFirstRender(false);
                    } else {
                        throw new Error("File URL not found in response");
                    }
                } else {
                    throw new Error("Response is not JSON");
                }
            } catch (error) {
                console.error('Error fetching files:', error);
            }
        };
        fetchFile();
    }, [options]);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    if (firstRender) {
        return <VisualizationBox heading='Start Visualization' text='Select "Organism" and "Sample Type" to begin analysis.' />;
    }
    else if (!fileUrl) {
        return <VisualizationBox heading='Continue Visualization' text='Sorry, no data was found. Please try another combination.' />;
    }

    return (
        <div className="flex flex-wrap justify-around">
            <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
                {Array.from(new Array(numPages), (el, index) => (
                    <div key={`page_${index + 1}`} style={{ marginBottom: '20px', padding: '10px' }}>
                        <div className="rounded-xl shadow-lg overflow-hidden">
                            <Page
                                pageNumber={index + 1}
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                                scale={1.5}
                            />
                        </div>
                    </div>
                ))}
            </Document>
        </div>
    );
}