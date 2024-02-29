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

export const REPHRASE_QUESTION_HUMAN_MESSAGE =
  "Rephrase the following question as a standalone question:\n{question}";

export const ANSWER_GENERATION_HUMAN_MESSAGE =
  "Now, answer this question using the previous context and chat history:\n{standalone_question}";
