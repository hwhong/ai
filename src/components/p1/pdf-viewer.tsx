import { useState } from "react";
// import { Document, Page, pdfjs } from "react-pdf";
import styles from "./pdf-view.module.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
// https://stackoverflow.com/questions/71669274/having-trouble-rendering-a-local-pdf-within-a-nextjs-app
//pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  file: string | ArrayBuffer | null;
  onUpload: (file: string | ArrayBuffer | null) => void;
}

export default function PDFViewer({ file, onUpload }: PDFViewerProps) {
  return <div></div>;
}
