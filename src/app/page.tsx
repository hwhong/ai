"use client";
import styles from "./page.module.css";
import React, { useState } from "react";
import dynamic from "next/dynamic";

const PDFViewer = dynamic(() => import("@/components/pdf-viewer"), {
  ssr: false,
});

export default function Home() {
  const [file, setFile] = useState<string | ArrayBuffer | null>(null);

  return (
    <div className={styles.root}>
      <div className={styles.pdfSection}>
        <PDFViewer file={file} onUpload={(newFile) => setFile(newFile)} />
      </div>
      <div className={styles.section}></div>
    </div>
  );
}
