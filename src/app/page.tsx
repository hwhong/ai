"use client";
import styles from "./page.module.css";
import React, { useState } from "react";
import { MemoryVectorStore } from "./memory-vector-store/memory-vector-store";

enum PROJECT {
  MEMORY_VECTOR_STORE = "Memory Vector Store",
}

export default function Home() {
  const [index, setIndex] = useState<number>(0);

  const projects = [
    {
      component: <MemoryVectorStore />,
      selection: PROJECT.MEMORY_VECTOR_STORE,
    },
  ];

  return (
    <div className={styles.root}>
      <div className={styles.toolbar}>
        {projects.map(({ selection }, i) => (
          <div
            key={selection}
            className={styles.item}
            onClick={() => setIndex(i)}
          >
            {projects[i].selection}
          </div>
        ))}
      </div>
      <div className={styles.content}>{projects[index].component}</div>
    </div>
  );
}

// https://supabase.com/docs/guides/database/functions
// https://supabase.com/blog/openai-embeddings-postgres-vector
// https://www.youtube.com/watch?v=Yhtjd7yGGGA&ab_channel=RabbitHoleSyndrome
