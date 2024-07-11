import {
  CompactAndRefine,
  Ollama,
  OllamaEmbedding,
  ResponseSynthesizer,
  Settings,
} from 'llamaindex';
import { newTextQaPrompt } from './llamaindex_settings.ts';
import { Document, VectorStoreIndex,} from 'llamaindex';



import dataset from './site+metadata.ts';

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
      metadata: dataset.dataset[i][0].metadata,
    })
  );
}
console.log(documents.length);

const index = await VectorStoreIndex.fromDocuments([...documents]);

const queryEngine = index.asQueryEngine({ responseSynthesizer });

const query = 'Grundstückspreis Glanegg?';

const results = await queryEngine.query({
  query,
});

console.log(results.toString());
