import { model } from "@/utils/langchain";
import type { NextApiRequest, NextApiResponse } from "next";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { supabase } from "@/lib/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const embeddings = new OpenAIEmbeddings();
  const loader = new PDFLoader("src/document/front-end.pdf");
  const docs = await loader.load();
  const document = docs.reduce(
    (acc: string[], curr: Record<string, any>) => [...acc, curr.pageContent],
    []
  );
  const embedding = await embeddings.embedDocuments(document);

  try {
    for (let i = 0; i < document.length; i++) {
      const { data, error } = await supabase.from("posts").insert({
        content: document[i].replace(/\n/g, " "),
        embedding: embedding[i],
      });
    }
  } catch (e) {
    res.status(200).json({ result: e });
  }

  res.status(200).json({ result: "success" });
}
