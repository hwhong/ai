import type { NextApiRequest, NextApiResponse } from "next";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RunnableSequence } from "@langchain/core/runnables";
import { convertDocsToString, loadAndSplitDocs } from "@/utils/helper";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const loader = new PDFLoader("src/document/cs.pdf");
  const splitDocs = await loadAndSplitDocs(loader);
  const vectorstore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    new OpenAIEmbeddings()
  );
  const retriever = vectorstore.asRetriever();

  /** Testing to get the relevant documents */
  // const retrievedDocs = await vectorstore.similaritySearch(
  //   "What is the course about?",
  //   4
  // );
  // const pageContents = retrievedDocs.map((doc) => doc.pageContent);

  const documentRetrievalChain = RunnableSequence.from([
    (input) => input.question,
    (query) => retriever.getRelevantDocuments(query),
    convertDocsToString,
  ]);

  const results = await documentRetrievalChain.invoke({
    question: "What are the prerequisites for this course?",
  });

  res.status(200).json({ result: results });
}
