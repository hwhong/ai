import { Document } from "@langchain/core/documents";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export const convertDocsToString = (documents: Document[]): string => {
  return documents
    .map((document) => {
      return `<doc>\n${document.pageContent}\n</doc>`;
    })
    .join("\n");
};

export const loadAndSplitDocs = async (loader: PDFLoader) => {
  const rawCS229Docs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 128,
    chunkOverlap: 0,
  });

  return await splitter.splitDocuments(rawCS229Docs);
};
