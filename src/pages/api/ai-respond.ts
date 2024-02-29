import { CONVERSATION_SYSTEM_PROMPT } from "@/utils/conversation/prompt";
import { chatModel } from "@/utils/model";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const msgs = req.body.messages;
  const message = msgs[msgs.length - 1].content;

  const outputParser = new StringOutputParser();
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", CONVERSATION_SYSTEM_PROMPT],
    ["user", "{input}"],
  ]);

  const chain = prompt.pipe(chatModel).pipe(outputParser);
  const utterance = await chain.invoke({ input: message });

  res.status(200).json(utterance);
}
