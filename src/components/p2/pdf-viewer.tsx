import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import styles from "./pdf-view.module.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
// https://stackoverflow.com/questions/71669274/having-trouble-rendering-a-local-pdf-within-a-nextjs-app
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  file: string | ArrayBuffer | null;
  onUpload: (file: string | ArrayBuffer | null) => void;
}

export default function PDFViewer({ file, onUpload }: PDFViewerProps) {
  const [numPages, setNumPages] = useState(0);

  function onFileChange(event: any) {
    onUpload(event.target.files[0]);
  }

  function onDocumentLoadSuccess({ numPages }: any) {
    setNumPages(numPages);
  }

  return (
    <div>
      <div className={styles.uploadSection}>
        <label htmlFor="file" id="file" className={inter.className}>
          <input onChange={onFileChange} type="file" />
        </label>
      </div>
      <div className={styles.root}>
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          error={<div></div>}
        >
          {Array.from({ length: numPages }, (_, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          ))}
        </Document>
      </div>
    </div>
  );
}
