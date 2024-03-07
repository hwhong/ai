import { VALIDATE_SYSTEM_PROMPT as template } from "@/utils/conversation/prompt";
import { openAiModel } from "@/utils/model";
import type { NextApiRequest, NextApiResponse } from "next";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import { PromptTemplate } from "@langchain/core/prompts";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const messages = JSON.parse(req.body).messages;

  const parser = StructuredOutputParser.fromZodSchema(
    z.object({
      info1: z.boolean().describe("Is Info1 answered in the conversation?"),
      info2: z.boolean().describe("Is Info2 answered in the conversation?"),
      info3: z.boolean().describe("Is Info3 answered in the conversation?"),
    })
  );

  const prompt = PromptTemplate.fromTemplate(template);
  const result = await prompt.pipe(openAiModel).invoke({
    history: messages,
    instructinos: parser.getFormatInstructions(),
  });

  res.status(200).json(result);
}
