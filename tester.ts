// import fs from 'fs/promises';
// import { Document, VectorStoreIndex } from 'llamaindex';
// import reader from './src/vector-embedding/pdfReader.ts';
// import { Ollama, Settings } from 'llamaindex';

// const ollama = new Ollama({
//   model: 'llama3',
//   options: {
//     temperature: 0.5,
//   },
// });

// // Use Ollama LLM and Embed Model
// Settings.llm = ollama;
// Settings.embedModel = ollama;

// async function main() {
//   // Load essay from abramov.txt in Node
//   const essay = await reader();

//   const arr = [];
//   essay[0].docs.map((doc) => arr.push(doc.pageContent));

//   const string = arr.join(' ');

//   // Create Document object with essay
//   const document = new Document({ text: string });

//   // Split text and create embeddings. Store them in a VectorStoreIndex
//   const index = await VectorStoreIndex.fromDocuments([document]);

//   const retriever = index.asRetriever();
//   retriever.similarityTopK = 3;

//   // Fetch nodes!
//   const nodesWithScore = await retriever.retrieve({
//     query: '§14 Bausparkassengesetz',
//   });
//   fs.writeFile('nodesWithScore.json', JSON.stringify(nodesWithScore, null, 2));
//   // Query the index
//   const queryEngine = index.asQueryEngine();
//   console.log('QUERY: ', queryEngine);
//   const response = await queryEngine.query({
//     query: 'Recite §14 of the "Bausparkassengesetz". Explain in simple terms.',
//   });

//   // Output response
//   console.log(response.toString());
// }

// main();

import { Ollama, OllamaEmbedding, Settings } from 'llamaindex';
import reader from './src/vector-embedding/pdfReader.ts';
import { Document, VectorStoreIndex } from 'llamaindex';

Settings.embedModel = new OllamaEmbedding({ model: 'nomic-embed-text' });


const ollama = new Ollama({
  model: 'llama3',
});

// Use Ollama LLM and Embed Model
Settings.llm = ollama;

const essay = await reader();
const arr = [];
essay[0].docs.map((doc) => arr.push(doc.pageContent));

const string = arr.join(' ');

const metadata = [];

essay[0].docs.map((doc) => {
  metadata.push(doc.metadata);
});

const document = new Document({ text: string, metadata: metadata});

const index = await VectorStoreIndex.fromDocuments([document]);

const queryEngine = index.asQueryEngine();

const query = 'Which sources are mentioned in NWTK Static Routing?';

const results = await queryEngine.query({
  query,
});

console.log(results.toString());