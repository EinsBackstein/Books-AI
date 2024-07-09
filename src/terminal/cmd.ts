import renderAscii from './ascii.ts';
import userInput from './input.ts';
import userInput_ from '../showcase.ts';
import fs from 'fs';
import reader, { callReader } from '../vector-embedding/pdfReader.ts';
import embedding from '../vector-embedding/embedding.ts';
import main from '../main.ts';
import call from '../callLLM.ts';

let userSelection;

const run = async () => {
  await renderAscii();
  await userInput_().then(() => {
    userSelection = JSON.parse(fs.readFileSync('json/selector.json', 'utf8'));
  });
  if (userSelection.usage_selection === 'PDF-Reader') {
    await callReader();
  } else if (userSelection.usage_selection === 'Embedding') {
    await embedding();
  } else {
    call();
  }
};


export default run;