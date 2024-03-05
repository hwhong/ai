import { ChatOpenAI } from "langchain/chat_models/openai";

export enum MODEL {
  GPT_35_TURBO_1106 = "gpt-3.5-turbo-1106",
  GPT_35_TURBO = "gpt-3.5-turbo",
}

export const model = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: MODEL.GPT_35_TURBO,
});
