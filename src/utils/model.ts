import { ChatOpenAI } from "langchain/chat_models/openai";
import { ChatOpenAI as ChatModel } from "@langchain/openai";
import { OpenAI as LCOpenAi } from "langchain/llms/openai";
import OpenAI from "openai";

export enum MODEL {
  GPT_35_TURBO_1106 = "gpt-3.5-turbo-1106",
  GPT_35_TURBO = "gpt-3.5-turbo",
  GPT_4 = "gpt-4",
}

export const model = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: MODEL.GPT_35_TURBO_1106,
});

export const openAiChatModel = new ChatModel({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: MODEL.GPT_35_TURBO_1106,
});

export const openAi = new LCOpenAi({
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: MODEL.GPT_35_TURBO_1106,
});

export const realOpenAI = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
