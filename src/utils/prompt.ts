export const ANSWER_CHAIN_SYSTEM_TEMPLATE = `You are an experienced researcher, 
expert at interpreting and answering questions based on provided sources.
Using the below provided context and chat history, 
answer the user's question to the best of 
your ability 
using only the resources provided. Be verbose!

<context>
{context}
</context>`;

export const REPHRASE_QUESTION_SYSTEM_TEMPLATE = `Given the following conversation and a follow up question, 
rephrase the follow up question to be a standalone question.`;

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
