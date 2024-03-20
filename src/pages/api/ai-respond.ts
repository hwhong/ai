import { CONVERSATION_SYSTEM_PROMPT } from "@/utils/conversation/prompt";
import { realOpenAI } from "@/utils/model";
import type { NextApiRequest, NextApiResponse } from "next";
import { ChatCompletionMessageParam } from "openai/resources";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const messages: ChatCompletionMessageParam[] = req.body.messages.map(
    ({ role, content }: any) => ({
      role,
      content,
    })
  );

  const completion = await realOpenAI.chat.completions.create({
    messages: [
      { role: "system", content: CONVERSATION_SYSTEM_PROMPT },
      ...messages,
    ],
    model: "gpt-3.5-turbo",
  });

  const response = completion.choices[0].message.content;

  res.status(200).json(response);
}
