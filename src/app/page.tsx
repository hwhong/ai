"use client";
import styles from "./page.module.css";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Chat } from "@/components/p2/chat";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { PrototypeComponent } from "./prototype";

const PDFViewer = dynamic(() => import("@/components/p2/pdf-viewer"), {
  ssr: false,
});

enum Prototype {
  ONE,
  TWO,
}

export default function Home() {
  const [selection, setSelection] = useState<Prototype>(Prototype.ONE);
  const [file, setFile] = useState<string | ArrayBuffer | null>(null);

  useEffect(() => {
    const createEmbedding = async () => {
      if (file) {
        const formData = new FormData();
        formData.append("file", new Blob([file]));
        const response = await fetch("/api/create-embedding", {
          method: "POST",
          body: formData,
        });
        return response;
      }
    };

    createEmbedding();
  }, [file]);

  return (
    <div className={styles.root}>
      <div className={styles.toolbar}>
        <ButtonGroup
          variant="contained"
          aria-label="outlined primary button group"
        >
          <Button onClick={() => setSelection(Prototype.ONE)}>P1</Button>
          <Button onClick={() => setSelection(Prototype.TWO)}>P2</Button>
        </ButtonGroup>
      </div>
      {selection === Prototype.ONE ? (
        <PrototypeComponent />
      ) : (
        <div className={styles.p2Wrapper}>
          <div className={styles.section}>
            <PDFViewer file={file} onUpload={(newFile) => setFile(newFile)} />
          </div>
          <div className={styles.section}>
            <Chat />
          </div>
        </div>
      )}
    </div>
  );
}

// https://supabase.com/docs/guides/database/functions
// https://supabase.com/blog/openai-embeddings-postgres-vector
// https://www.youtube.com/watch?v=Yhtjd7yGGGA&ab_channel=RabbitHoleSyndrome
