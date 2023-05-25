import { openai } from "@/utils/openai";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: "What is your name?",
  });

  res.status(200).json({ result: completion.data.choices[0].text });
}
