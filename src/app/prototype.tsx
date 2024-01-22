"use client";

import React, { useEffect, useState } from "react";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";

// Peer dependency
// import * as parse from "pdf-parse";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export function PrototypeComponent() {
  const [vectorStore, setVectorStore] = useState(null);

  const initialize = async () => {
    // const embeddings = new OpenAIEmbeddings();
    // await embeddings.embedQuery("This is some sample text");
    // const loader = new PDFLoader("src/document/front-end.pdf");
    // const rawCS229Docs = await loader.load();
    // const splitter = new RecursiveCharacterTextSplitter({
    //   chunkSize: 128,
    //   chunkOverlap: 0,
    // });
    // const splitDocs = await splitter.splitDocuments(rawCS229Docs);
    // const vectorStore = MemoryVectorStore.fromDocuments(
    //   splitDocs,
    //   new OpenAIEmbeddings()
    // );
  };

  return <></>;
}
