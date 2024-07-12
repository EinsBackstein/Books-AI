import renderAscii from './ascii.ts';
import fs from 'fs';
import embedding from '../vector-embedding/embedding.ts';
import { callLLM, userInput_, callReader, callRAG } from '../lib/helpers.ts';

let userSelection;

//program execution function
const run = async () => {
  await renderAscii();
  await userInput_().then(() => {
    userSelection = JSON.parse(fs.readFileSync('json/selector.json', 'utf8'));
  });
  if (userSelection.usage_selection === 'PDF-Reader') {
    await callReader();
  } else if (userSelection.usage_selection === 'Embedding') {
    await embedding();
  } else if (userSelection.usage_selection === 'RAG') {
    await callRAG();
  } else {
    await callLLM();
  }
};

export default run;
