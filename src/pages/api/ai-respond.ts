import { CONVERSATION_SYSTEM_PROMPT } from "@/utils/conversation/prompt";
import { chatModel } from "@/utils/model";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
} from "@langchain/core/prompts";
import type { NextApiRequest, NextApiResponse } from "next";
import { BufferMemory } from "langchain/memory";
import { RunnableSequence } from "@langchain/core/runnables";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const msgs = req.body.messages;
  const message = msgs[msgs.length - 1].content;

  const prompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(CONVERSATION_SYSTEM_PROMPT),
    new MessagesPlaceholder("history"),
    HumanMessagePromptTemplate.fromTemplate("{input}"),
  ]);

  const memory = new BufferMemory({
    returnMessages: true,
    inputKey: "input",
    outputKey: "output",
    memoryKey: "history",
  });

  const chain = RunnableSequence.from([
    {
      input: (initialInput) => initialInput?.input ?? "",
      memory: () => memory.loadMemoryVariables({}),
    },
    {
      input: (previousOutput) => previousOutput.input,
      history: (previousOutput) => previousOutput.memory.history,
    },
    prompt,
    chatModel,
  ]);

  const inputs1 = { input: message };
  const s1 = await chain.invoke(inputs1);

  await memory.saveContext(inputs1, {
    output: s1.content,
  });

  const inputs2 = { input: "quel est mon nom?" };
  const s2 = await chain.invoke(inputs2);

  res.status(200).json({ output: s2 });
}
