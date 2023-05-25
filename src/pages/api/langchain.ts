import { model } from "@/utils/langchain";
import type { NextApiRequest, NextApiResponse } from "next";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  // const result = await model.call("How many people live in New York City?");

  const loader = new PDFLoader("src/document/front-end.pdf");
  const docs = await loader.load();

  const content = docs[0].pageContent;

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });
  const result = embeddings.embedDocuments([content]);
  res.status(200).json({ result });
}
