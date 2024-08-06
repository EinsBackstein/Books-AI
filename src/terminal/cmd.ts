import renderAscii from './ascii.ts';
import fs from 'fs';
import embedding from '../vector-embedding/embedding.ts';
import { callLLM, userInput_, callReader, callRAG } from '../lib/helpers.ts';
import chalk from 'chalk';

let userSelection;

//program execution function
const run = async () => {
  await renderAscii();
  console.log(chalk.red('Warnung: Dieses Programm befindet sich noch in der Beta'));
  console.log('');
  await userInput_().then(() => {
    userSelection = JSON.parse(fs.readFileSync('json/selector.json', 'utf8'));
  });
  if (userSelection.usage_selection === 1) {
    await callReader();
  } else if (userSelection.usage_selection === 2) {
    await embedding();
  } else if (userSelection.usage_selection === 3) {
    await callRAG();
  } else {
    await callLLM();
  }
};

export default run;
