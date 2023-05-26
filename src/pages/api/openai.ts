import { openai } from "@/utils/openai";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const loader = new PDFLoader("src/document/front-end.pdf");
  const docs = await loader.load();
  const documents = docs.reduce(
    (acc: string[], curr: Record<string, any>) => [...acc, curr.pageContent],
    []
  );

  try {
    for (const document of documents) {
      // OpenAI recommends replacing newlines with spaces for best results
      const input = document.replace(/\n/g, " ");

      const embeddingResponse = await openai.createEmbedding({
        model: "text-embedding-ada-002",
        input,
      });

      const [{ embedding }] = embeddingResponse.data.data;

      await supabase.from("posts").insert({
        content: input,
        embedding,
      });
    }
  } catch (e) {
    res.status(500).json({ result: e });
  }

  res.status(200).json({ result: "success" });
}
