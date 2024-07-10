import renderAscii from './ascii.ts';
import fs from 'fs';
import embedding from '../vector-embedding/embedding.ts';
import { call, userInput_, callReader } from '../lib/helpers.ts';

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
    await call();
    
  }
};


export default run;