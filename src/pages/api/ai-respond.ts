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
import {
  StructuredOutputParser,
  OutputFixingParser,
} from "langchain/output_parsers";
import { z } from "zod";
import { RunnableSequence } from "@langchain/core/runnables";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const messages = req.body.messages;
  const userMessage = messages[messages.length - 1].content;

  const zodSchema = z.object({
    words: z
      .array(
        z.object({
          word: z.string().describe("The word"),
          isUsed: z
            .boolean()
            .describe("Whether the word is mentioned in the conversation"),
        })
      )
      .describe("An array of words that are required to be used."),
    requirements: z
      .array(
        z.object({
          requirement: z.string().describe("The requirement"),
          isFulfilled: z
            .boolean()
            .describe(
              "Whether the requirement is fulfilled in the conversation"
            ),
        })
      )
      .describe(
        "An array of requirements that are required to be fulfilled in the conversation."
      ),
    llmResponse: z.string().describe("The llm's response to the user's input"),
  });

  const parser = StructuredOutputParser.fromZodSchema(zodSchema);
  //  const outputFixingParser = OutputFixingParser.fromLLM(model, parser);

  const prompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(CONVERSATION_SYSTEM_PROMPT),
    new MessagesPlaceholder("history"),
    HumanMessagePromptTemplate.fromTemplate("{input}"),
    HumanMessagePromptTemplate.fromTemplate("{format_instruction}"),
  ]);

  const conversation_chain = new ConversationChain({
    memory: new BufferMemory({
      returnMessages: true,
      memoryKey: "history",
      // input key is used to differentiate the actual input to the conversation
      // to other key params. e.g the format_instruction
      inputKey: "input",
    }),
    prompt: prompt,
    llm: model,
  });

  const { response } = await conversation_chain.call({
    input: userMessage,
    format_instruction: parser.getFormatInstructions(),
  });

  res.status(200).json(response);
}
