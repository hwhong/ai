import {
  VALIDATE_SYSTEM_PROMPT,
  VALIDATE_SYSTEM_PROMPT as template,
} from "@/utils/conversation/prompt";
import { openAi } from "@/utils/model";
import type { NextApiRequest, NextApiResponse } from "next";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const messages = JSON.parse(req.body).messages.map(
    ({ content, role }: any) => ({
      content,
      role,
    })
  );

  const parser = StructuredOutputParser.fromZodSchema(
    z.object({
      info1: z
        .string()
        .describe(
          'How many people are joining the table". Return null if answer unclear.'
        ),
      info2: z
        .string()
        .describe(
          `What does the user want to eat. Return null if answer unclear.`
        ),
      info3: z
        .string()
        .describe(
          "How does the user want to pay. Return null if answer unclear."
        ),
    })
  );

  //   const prompt = PromptTemplate.fromTemplate(template);
  //   const result = await prompt.pipe(openAiModel).invoke({
  //     history: messages,
  //     instructions: parser.getFormatInstructions(),
  //   });

  const chain = RunnableSequence.from([
    PromptTemplate.fromTemplate(VALIDATE_SYSTEM_PROMPT),
    openAi,
  ]);

  const result = await chain.invoke({
    history: JSON.stringify(messages),
    instructions: parser.getFormatInstructions(),
  });

  res.status(200).json(result);
}
