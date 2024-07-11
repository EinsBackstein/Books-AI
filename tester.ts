import {
  ChromaVectorStore,
  CompactAndRefine,
  Ollama,
  OllamaEmbedding,
  ResponseSynthesizer,
  Settings,
  storageContextFromDefaults,
} from 'llamaindex';
import { newTextQaPrompt } from './src/vector-embedding/llamaindex_settings.ts';
import { Document, VectorStoreIndex } from 'llamaindex';

import dataset from './src/vector-embedding/site+metadata.ts';

const collectionName = 'testCollection';

const chromaVS = new ChromaVectorStore({
  collectionName,
});

const ctx = await storageContextFromDefaults({
  vectorStore: chromaVS,
});

Settings.embedModel = new OllamaEmbedding({ model: 'nomic-embed-text' });

const ollama = new Ollama({
  model: 'llama3',
});

// Use Ollama LLM and Embed Model
Settings.llm = ollama;

const responseSynthesizer = new ResponseSynthesizer({
  responseBuilder: new CompactAndRefine(undefined, newTextQaPrompt),
});

const documents = [];

for (let i = 0; i < dataset.dataset.length; i++) {
  documents.push(
    new Document({
      text: dataset.dataset[i][0].text,
      metadata: dataset.dataset[i][0].metadata.pdf.info,
    })
  );
}

// console.log(documents[0].metadata);

const index = await VectorStoreIndex.fromDocuments(documents, {
  storageContext: ctx,
});

const queryEngine = index.asQueryEngine({ responseSynthesizer });

const query = 'Grundstückspreis in Glanegg?';

const results = await queryEngine.query({
  query,
});

console.log(results.toString());
