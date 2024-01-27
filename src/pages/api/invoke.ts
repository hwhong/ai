import type { NextApiRequest, NextApiResponse } from "next";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RunnableSequence } from "@langchain/core/runnables";
import { convertDocsToString, loadAndSplitDocs } from "@/utils/helper";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableMap } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { MessagesPlaceholder } from "@langchain/core/prompts";
import { RunnablePassthrough } from "@langchain/core/runnables";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { ChatMessageHistory } from "@langchain/community/stores/message/in_memory";
import {
  ANSWER_CHAIN_SYSTEM_TEMPLATE,
  REPHRASE_QUESTION_SYSTEM_TEMPLATE,
} from "@/utils/prompt";
import { OpenAIStream, StreamingTextResponse } from "ai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const loader = new PDFLoader("src/document/cs.pdf");
  const splitDocs = await loadAndSplitDocs(loader);
  const vectorstore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    new OpenAIEmbeddings()
  );
  const retriever = vectorstore.asRetriever();

  /** Testing to get the relevant documents */
  // const retrievedDocs = await vectorstore.similaritySearch(
  //   "What is the course about?",
  //   4
  // );
  // const pageContents = retrievedDocs.map((doc) => doc.pageContent);

  /** ---------- Chat Prompts ---------- */

  const rephraseQuestionChainPrompt = ChatPromptTemplate.fromMessages([
    ["system", REPHRASE_QUESTION_SYSTEM_TEMPLATE],
    new MessagesPlaceholder("history"),
    [
      "human",
      "Rephrase the following question as a standalone question:\n{question}",
    ],
  ]);

  const answerGenerationChainPrompt = ChatPromptTemplate.fromMessages([
    ["system", ANSWER_CHAIN_SYSTEM_TEMPLATE],
    new MessagesPlaceholder("history"),
    [
      "human",
      "Now, answer this question using the previous context and chat history:\n{standalone_question}",
    ],
  ]);

  /** ---------- Chat Prompts ---------- */

  /** ---------- Chains ---------- */

  const rephraseQuestionChain = RunnableSequence.from([
    rephraseQuestionChainPrompt,
    new ChatOpenAI({ temperature: 0.1, modelName: "gpt-3.5-turbo-1106" }),
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
    new ChatOpenAI({ modelName: "gpt-3.5-turbo" }),
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

  // let question = {
  //   question: "What is the assignment late policy?",
  // };
  const configurable = { configurable: { sessionId: "test" } };

  // const originalAnswer = await finalRetrievalChain.invoke(
  //   question,
  //   configurable
  // );

  // question = {
  //   question: "Can you list them in bullet point form?",
  // };

  const messages = req.body.messages;

  const response = await finalRetrievalChain.invoke(
    { question: messages[messages.length - 1].content },
    configurable
  );

  // const stream = OpenAIStream(response);

  res.status(200).json({ response });
}
