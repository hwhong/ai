import { VALIDATE_II_SYSTEM_PROMPT } from "@/utils/conversation/prompt";
import { openAi } from "@/utils/model";
import type { NextApiRequest, NextApiResponse } from "next";
import { PromptTemplate } from "@langchain/core/prompts";
import { stringifyConversation } from "@/utils/conversation/helper";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const body = JSON.parse(req.body);
  const questions: string[] = body.questions;
  const messages = body.messages.map(({ content, role }: any) => ({
    content,
    role,
  }));

  // const parser = StructuredOutputParser.fromZodSchema(
  //   z.object({
  //     info1: z
  //       .boolean()
  //       .describe(
  //         "Whether the customer mentioned how many people are joining the table."
  //       ),
  //     info2: z
  //       .boolean()
  //       .describe(`Whether the customer mentioned what he wants to eat.`),
  //     info3: z
  //       .boolean()
  //       .describe("Whether the customer mentioned how he wants to pay"),
  //   })
  // );

  const validate = await PromptTemplate.fromTemplate(
    VALIDATE_II_SYSTEM_PROMPT
  ).format({
    history: stringifyConversation(messages, {
      user: "Customer",
      assistant: "Waiter",
    }),
    questions: questions,
  });

  let result = await openAi.call(validate);
  try {
    result = JSON.parse(result);
  } catch (error) {
    res.status(400).json(error);
  }

  res.status(200).json(result);
}
