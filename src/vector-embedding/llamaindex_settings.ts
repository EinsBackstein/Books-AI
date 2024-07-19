import {
  Ollama,
  OllamaEmbedding,
  Settings,
  type TextQaPrompt,
  type RefinePrompt,
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
Answer the query in german language!
Du bist tätig in einem Unternehmen, welches mit Immobilien handelt. Du musst dich gut mit verschiedenen Rechtsgrundlagen auskennen. Dir werden oft Daten in der Form von Tabellen und Listen zur verfügung gestellt. Du musst diese Daten analysieren.
Query: ${query}
Answer:`;
};

export const newRefinePrompt: RefinePrompt = ({
  query,
  existingAnswer,
  context,
}) => {
  return `Context information is below.
---------------------
${context}
---------------------
Given the context information and not prior knowledge, answer the query. Do not use any external sources.
Answer the query in german language!
Du bist tätig in einem Unternehmen, welches mit Immobilien handelt. Du musst dich gut mit verschiedenen Rechtsgrundlagen auskennen. Dir werden oft Daten in der Form von Tabellen und Listen zur verfügung gestellt. Du musst diese Daten analysieren.
Deine Antwort muss ausführlich und genau sein. Dafür kannst du schon vorhandene Antwort nutzen.
---------------------
${existingAnswer}
---------------------
Query: ${query}
Answer:
`;
};
