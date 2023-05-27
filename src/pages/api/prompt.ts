import { openai } from "@/utils/openai";
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  // Search query is passed in request payload
  const { query } = JSON.parse(req.body);

  // OpenAI recommends replacing newlines with spaces for best results
  const input = query.replace(/\n/g, " ");

  // Generate a one-time embedding for the query itself
  const embeddingResponse = await openai.createEmbedding({
    model: "text-embedding-ada-002",
    input,
  });

  const [{ embedding }] = embeddingResponse.data.data;

  // In production we should handle possible errors
  const { data: documents } = await supabase.rpc("match_documents", {
    query_embedding: embedding,
    similarity_threshold: 0.78, // Choose an appropriate threshold for your data
    match_count: 1, // Choose the number of matches
  });

  const result = documents.map((d: { content: string }) => d.content);

  res.status(200).json({ result });
}
