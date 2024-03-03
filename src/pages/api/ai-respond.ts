import { CONVERSATION_SYSTEM_PROMPT } from "@/utils/conversation/prompt";
import { mode } from "@/utils/model";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
} from "langchain/prompts";
import type { NextApiRequest, NextApiResponse } from "next";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const messages = req.body.messages;
  const userMessage = messages[messages.length - 1].content;

  const prompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(CONVERSATION_SYSTEM_PROMPT),
    new MessagesPlaceholder("history"),
    HumanMessagePromptTemplate.fromTemplate("{input}"),
  ]);

  const conversation_chain = new ConversationChain({
    memory: new BufferMemory({ returnMessages: true, memoryKey: "history" }),
    prompt: prompt,
    llm: mode,
  });

  const inputs1 = { input: userMessage };
  const { response } = await conversation_chain.call(inputs1);

  res.status(200).json(response);
}
