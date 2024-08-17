"use client";
import { pdfjs, Document, Page } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function BayesianNetworkPlots() {
    return (
        <div className="flex flex-wrap justify-around gap-y-6">
            <div className="bg-white rounded-xl shadow-lg">
                <Document file={'/bayesian-networks/ecoli_uti.pdf'} className="p-2">
                    <Page pageNumber={1} renderTextLayer={false} renderAnnotationLayer={false} scale={1} />
                </Document>
            </div>
            <div className="bg-white rounded-xl shadow-lg">
                <Document file={'/bayesian-networks/kleb_uti.pdf'} className="p-2">
                    <Page pageNumber={1} renderTextLayer={false} renderAnnotationLayer={false} scale={1} />
                </Document>
            </div>
        </div>
    );
}