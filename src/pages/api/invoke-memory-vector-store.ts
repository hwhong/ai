import type { NextApiRequest, NextApiResponse } from "next";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RunnableSequence } from "@langchain/core/runnables";
import {
  convertDocsToString,
  loadAndSplitDocs,
} from "@/utils/memory-vector-store/helper";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { MessagesPlaceholder } from "@langchain/core/prompts";
import { RunnablePassthrough } from "@langchain/core/runnables";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { ChatMessageHistory } from "@langchain/community/stores/message/in_memory";
import {
  ANSWER_CHAIN_SYSTEM_TEMPLATE,
  REPHRASE_QUESTION_SYSTEM_TEMPLATE,
  REPHRASE_QUESTION_HUMAN_MESSAGE,
  ANSWER_GENERATION_HUMAN_MESSAGE,
} from "@/utils/memory-vector-store/prompts";
import { MODEL } from "@/utils/model";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const loader = new PDFLoader("src/document/cs.pdf");
  const splitDocs = await loadAndSplitDocs(loader);
  const embedding = new OpenAIEmbeddings();
  const vectorstore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    embedding
  );
  const retriever = vectorstore.asRetriever();

  /** ---------- Chat Prompts ---------- */

  const rephraseQuestionChainPrompt = ChatPromptTemplate.fromMessages([
    ["system", REPHRASE_QUESTION_SYSTEM_TEMPLATE],
    new MessagesPlaceholder("history"),
    ["human", REPHRASE_QUESTION_HUMAN_MESSAGE],
  ]);

  const answerGenerationChainPrompt = ChatPromptTemplate.fromMessages([
    ["system", ANSWER_CHAIN_SYSTEM_TEMPLATE],
    new MessagesPlaceholder("history"),
    ["human", ANSWER_GENERATION_HUMAN_MESSAGE],
  ]);

  /** ---------- Chains ---------- */

  const rephraseQuestionChain = RunnableSequence.from([
    rephraseQuestionChainPrompt,
    new ChatOpenAI({ temperature: 0.1, modelName: MODEL.GPT_35_TURBO_1106 }),
    new StringOutputParser(),
  ]);

  const documentRetrievalChain = RunnableSequence.from([
    (input) => input.question,
    (query) => retriever.getRelevantDocuments(query),
    convertDocsToString,
  ]);

  /** RunnablePassthrough allows to pass inputs unchanged or with the addition of extra keys.  */
  const conversationalRetrievalChain = RunnableSequence.from([
    RunnablePassthrough.assign({
      standalone_question: rephraseQuestionChain,
    }),
    RunnablePassthrough.assign({
      context: documentRetrievalChain,
    }),
    answerGenerationChainPrompt,
    new ChatOpenAI({ modelName: MODEL.GPT_35_TURBO }),
    new StringOutputParser(),
  ]);

  /** ---------- Chains ---------- */

  const messageHistory = new ChatMessageHistory();

  // RunnableWithMessageHistory
  // wraps LCEL chain
  // save part of the input to the chain (user defined question field) as the new human message
  // also saves output of the chain as new AI messsage
  // adds current history messages to input of wrapped chain under history messages key

  // has inputMessagesKey, outputMessagesKey, historyMessagesKey

  const finalRetrievalChain = new RunnableWithMessageHistory({
    runnable: conversationalRetrievalChain,
    getMessageHistory: (_sessionId) => messageHistory,
    historyMessagesKey: "history",
    inputMessagesKey: "question",
  });

  /** Running */
  const configurable = { configurable: { sessionId: "test" } };
  const msgs = req.body.messages;

  const response = await finalRetrievalChain.invoke(
    { question: msgs[msgs.length - 1].content },
    configurable
  );

  res.status(200).json(response);
}
