import {
  Ollama,
  OllamaEmbedding,
  Settings,
  type TextQaPrompt,
} from 'llamaindex';

//! Under construction
// const settings = Settings;
// const model = 'llama3';
// const embeddingModel = 'nomic-embed-text';

// Define a custom prompt
export const newTextQaPrompt: TextQaPrompt = ({ context, query }) => {
  return `Context information is below.
---------------------
${context}
---------------------
Given the context information and not prior knowledge, answer the query. Do not use any external sources.
Answer the query in german language.
Query: ${query}
Answer:`;
};