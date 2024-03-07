import { CONVERSATION_SYSTEM_PROMPT } from "@/utils/conversation/prompt";
import { model } from "@/utils/model";
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
    memory: new BufferMemory({
      returnMessages: true,
      memoryKey: "history",
      // input key is used to differentiate the actual input to the conversation
      // to other key params. e.g was using format_instruction
      inputKey: "input",
    }),
    prompt: prompt,
    llm: model,
  });

  const { response } = await conversation_chain.call({
    input: userMessage,
  });

  res.status(200).json(response);
}
