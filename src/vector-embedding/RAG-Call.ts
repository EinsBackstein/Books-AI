import {
  CompactAndRefine,
  Ollama,
  OllamaEmbedding,
  ResponseSynthesizer,
  Settings,
} from 'llamaindex';
import { newTextQaPrompt } from './llamaindex_settings.ts';
import { Document, VectorStoreIndex } from 'llamaindex';
import * as readline from 'node:readline';
import dataset from './site+metadata.ts';
import chalk from 'chalk';

let RAG;

export default RAG = async (llm: number, embedder:number, prompt: string) => {
  //* Settings
  let model;
  if (llm === 1) {
    model = 'llama3';
  } else if (llm === 2) {
    model = 'gemma2';
  }

  let embedderModel;
  if (embedder === 1) {
    embedderModel = 'nomic-embed-text';
  } else if (embedder === 2) {
    embedderModel = 'llama3';
  }

  const ollama = new Ollama({
    model: model,
  });
  
  // Use Ollama LLM and Embed Model
  Settings.llm = ollama;
  Settings.embedModel = new OllamaEmbedding({ model: embedderModel });


  //* Cosmetic
  const twirlTimer = (function () {
    const P = ['\\', '|', '/', '-'];
    let x = 0;
    return setInterval(function () {
      process.stdout.write(chalk.magentaBright('\r' + P[x++]));
      x &= 3;
    }, 250);
  })();

  //* Custom Prompt
  const responseSynthesizer = new ResponseSynthesizer({
    responseBuilder: new CompactAndRefine(undefined, newTextQaPrompt),
  });

  //* Dataset creation
  const documents = [];

  for (let i = 0; i < dataset.dataset.length; i++) {
    documents.push(
      new Document({
        text: dataset.dataset[i][0].text,
        metadata: dataset.dataset[i][0].metadata,
      })
    );
  }

  //* RAG-Process
  const index = await VectorStoreIndex.fromDocuments([...documents]);

  const queryEngine = index.asQueryEngine({ responseSynthesizer });

  const query = prompt;

  const results = await queryEngine.query({
    query,
  });

  //* Cosmetics + Result
  clearInterval(twirlTimer);
  readline.clearLine(process.stdout, 0);
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  sleep(99).then(() => {
    console.log('');
    console.log(chalk.green(results.toString()));
    console.log('');
  });
};
