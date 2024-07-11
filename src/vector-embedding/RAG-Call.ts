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
import { Readline } from 'readline/promises';

let RAG;

export default RAG = async (llm, embedder, prompt: string) => {
  if (llm === 1) {
    llm = 'llama3';
  } else if (llm === 2) {
    llm = 'gemma2';
  }

  if (embedder === 1) {
    embedder = 'nomic-embed-text';
  } else if (embedder === 2) {
    embedder = 'llama3';
  }

  Settings.embedModel = new OllamaEmbedding({ model: embedder });

  const ollama = new Ollama({
    model: llm,
  });

  // Use Ollama LLM and Embed Model
  Settings.llm = ollama;

  const twirlTimer = (function () {
    const P = ['\\', '|', '/', '-'];
    let x = 0;
    return setInterval(function () {
      process.stdout.write(chalk.magentaBright('\r' + P[x++]));
      x &= 3;
    }, 250);
  })();

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
  // console.log(documents[0].text);

  const index = await VectorStoreIndex.fromDocuments([...documents]);

  const queryEngine = index.asQueryEngine({ responseSynthesizer });

  const query = prompt;

  const results = await queryEngine.query({
    query,
  });

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
