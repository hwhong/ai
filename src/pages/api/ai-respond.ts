import { CONVERSATION_SYSTEM_PROMPT } from "@/utils/conversation/prompt";
import { chatModel } from "@/utils/model";
import { ConversationChain } from "langchain/chains";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
} from "langchain/prompts";
import type { NextApiRequest, NextApiResponse } from "next";
import { BufferMemory } from "langchain/memory";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const msgs = req.body.messages;
  const message = msgs[msgs.length - 1].content;

  // const outputParser = new StringOutputParser();

  const prompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(CONVERSATION_SYSTEM_PROMPT),
    new MessagesPlaceholder("history"),
    HumanMessagePromptTemplate.fromTemplate("{input}"),
  ]);

  const memory = new BufferMemory({
    memoryKey: "history",
    returnMessages: true,
  });

  const chain = new ConversationChain({
    llm: chatModel,
    memory,
    prompt,
  });

  // const chain = prompt.pipe(chatModel).pipe(outputParser);
  const utterance = await chain.call({ input: message });

  res.status(200).json(utterance);
}
