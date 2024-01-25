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

  const documentRetrievalChain = RunnableSequence.from([
    (input) => input.question,
    (query) => retriever.getRelevantDocuments(query),
    convertDocsToString,
  ]);

  /** ---------- PART II ------------ */

  // const TEMPLATE_STRING = `You are an experienced researcher,
  // expert at interpreting and answering questions based on provided sources.
  // Using the provided context, answer the user's question
  // to the best of your ability using only the resources provided.
  // Be verbose!

  // <context>

  // {context}

  // </context>

  // Now, answer this question using the above context:

  // {question}`;

  // const answerGenerationPrompt =
  //   ChatPromptTemplate.fromTemplate(TEMPLATE_STRING);

  // const model = new ChatOpenAI({
  //   modelName: "gpt-3.5-turbo-1106",
  // });

  // const retrievalChain = RunnableSequence.from([
  //   {
  //     context: documentRetrievalChain,
  //     question: (input) => input.question,
  //   },
  //   answerGenerationPrompt,
  //   model,
  //   new StringOutputParser(),
  // ]);

  // const answer = await retrievalChain.invoke({
  //   question: "What is the assignment late policy?",
  // });

  /** ---------- PART II ------------ */

  const REPHRASE_QUESTION_SYSTEM_TEMPLATE = `Given the following conversation and a follow up question, 
rephrase the follow up question to be a standalone question.`;

  const rephraseQuestionChainPrompt = ChatPromptTemplate.fromMessages([
    ["system", REPHRASE_QUESTION_SYSTEM_TEMPLATE],
    new MessagesPlaceholder("history"),
    [
      "human",
      "Rephrase the following question as a standalone question:\n{question}",
    ],
  ]);

  const ANSWER_CHAIN_SYSTEM_TEMPLATE = `You are an experienced researcher, 
expert at interpreting and answering questions based on provided sources.
Using the below provided context and chat history, 
answer the user's question to the best of 
your ability 
using only the resources provided. Be verbose!

<context>
{context}
</context>`;

  const answerGenerationChainPrompt = ChatPromptTemplate.fromMessages([
    ["system", ANSWER_CHAIN_SYSTEM_TEMPLATE],
    new MessagesPlaceholder("history"),
    [
      "human",
      "Now, answer this question using the previous context and chat history:\n{standalone_question}",
    ],
  ]);

  const rephraseQuestionChain = RunnableSequence.from([
    rephraseQuestionChainPrompt,
    new ChatOpenAI({ temperature: 0.1, modelName: "gpt-3.5-turbo-1106" }),
    new StringOutputParser(),
  ]);

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

  const messageHistory = new ChatMessageHistory();

  const finalRetrievalChain = new RunnableWithMessageHistory({
    runnable: conversationalRetrievalChain,
    getMessageHistory: (_sessionId) => messageHistory,
    historyMessagesKey: "history",
    inputMessagesKey: "question",
  });

  const originalQuestion = "What is the assignment late policy?";

  // const originalAnswer = await finalRetrievalChain.invoke(
  //   {
  //     question: originalQuestion,
  //   },
  //   {
  //     configurable: { sessionId: "test" },
  //   }
  // );

  const finalResult = await finalRetrievalChain.invoke(
    {
      question: "Can you list them in bullet point form?",
    },
    {
      configurable: { sessionId: "test" },
    }
  );

  console.log(finalResult);

  res.status(200).json({ finalResult });
}
