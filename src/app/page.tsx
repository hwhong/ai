"use client";
import styles from "./page.module.css";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Chat } from "@/components/chat";

const PDFViewer = dynamic(() => import("@/components/pdf-viewer"), {
  ssr: false,
});

export default function Home() {
  const [file, setFile] = useState<string | ArrayBuffer | null>(null);

  useEffect(() => {
    const createEmbedding = async () => {
      const response = await fetch("/api/create-embedding", {
        method: "POST",
        body: JSON.stringify({ file }),
      });
      return response;
    };
    console.log(createEmbedding());
  }, [file]);

  return (
    <div className={styles.root}>
      <div className={styles.section}>
        <PDFViewer file={file} onUpload={(newFile) => setFile(newFile)} />
      </div>
      <div className={styles.section}>
        <Chat />
      </div>
    </div>
  );
}
