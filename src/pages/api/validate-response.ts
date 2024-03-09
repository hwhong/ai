import {
  SUMMARIZE_SYSTEM_PROMPT,
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
        .boolean()
        .describe(
          "Whether the user mentioned how many people are joining the table."
        ),
      info2: z
        .boolean()
        .describe(`Whether the user mentioned what he wants to eat.`),
      info3: z
        .boolean()
        .describe("Whether the user mentioned how he wants to pay"),
    })
  );

  //   const prompt = PromptTemplate.fromTemplate(template);
  //   const result = await prompt.pipe(openAiModel).invoke({
  //     history: messages,
  //     instructions: parser.getFormatInstructions(),
  //   });

  const input = await PromptTemplate.fromTemplate(
    SUMMARIZE_SYSTEM_PROMPT
  ).format({
    history: JSON.stringify(messages),
  });
  const summary = await openAi.call(input);

  const validate = await PromptTemplate.fromTemplate(
    VALIDATE_SYSTEM_PROMPT
  ).format({
    summary,
    question:
      "Did the user say how he wants to pay? If yes, return true, else false.",
  });
  const result = await openAi.call(validate);
  //   const chain = RunnableSequence.from([
  //     PromptTemplate.fromTemplate(VALIDATE_SYSTEM_PROMPT),
  //     openAi,
  //   ]);

  //   const result = await chain.invoke({
  //     history: JSON.stringify(messages),
  //     instructions: parser.getFormatInstructions(),
  //   });
  //   let result;
  //   try {
  //     result = await openAi.call(input);
  //     // const blah = await parser.parse(result);
  //     console.log(result);
  //   } catch (e) {
  //     console.error(e);
  //   }

  res.status(200).json(result);
}
