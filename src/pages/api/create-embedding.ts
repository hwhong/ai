import type { NextApiRequest, NextApiResponse } from "next";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { supabase } from "@/lib/supabaseClient";
import formidable from "formidable";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    const file = files.file;

    if (file) {
      try {
        const embeddings = new OpenAIEmbeddings();
        const loader = new PDFLoader(file as any);
        const docs = await loader.load();
        const document = docs.reduce(
          (acc: string[], curr: Record<string, any>) => [
            ...acc,
            curr.pageContent,
          ],
          []
        );
        const embedding = await embeddings.embedDocuments(document);

        for (let i = 0; i < document.length; i++) {
          await supabase.from("posts").insert({
            content: document[i].replace(/\n/g, " "),
            embedding: embedding[i],
          });
        }
      } catch (e) {
        res.status(500).json({ result: e });
      }
      res.status(200).json({ result: "success" });
    }

    return res.status(201).send("");
  });

  res.status(500).json({ result: "failed" });
}
