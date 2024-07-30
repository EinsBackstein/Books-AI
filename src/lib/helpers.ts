// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
//test

import chalk from 'chalk';
import inquirer from 'inquirer';
import seperator from 'inquirer';
import main from '../main.ts';
import userInput from '../terminal/input.ts';
import fs from 'fs';
import { models } from '../constants/models.ts';
import reader from '../vector-embedding/pdfReader.ts';
import userInput__ from '../terminal/rag.ts';
import RAG from '../vector-embedding/RAG-Call.ts';

//function for user-input-handling and llm-call
export const callLLM = () => {
  userInput().then(() => {
    const input = JSON.parse(fs.readFileSync('temp/input.json', 'utf8'));
    main(input.user_input, input.model_type);
  });
};

//function for user-input-handling and rag-call
export const callRAG = () => {
  userInput__().then(() => {
    const input = JSON.parse(fs.readFileSync('temp/RAG.json', 'utf8'));
    RAG(input.model_type, input.embedder_type, input.user_input);
  });
};

//"main menu" for CLI-Tool
export const userInput_ = async () => {
  await inquirer
    .prompt([
      {
        name: 'usage_selection',
        type: 'select',
        message: chalk.yellow(
          'Bitte Verwendungszweck des Programmes auswählen:'
        ),
        choices: ['PDF-Reader', 'Embedding', 'LLM-Connection', 'RAG'],
      },
    ])
    .then((answers) => {
      const json = JSON.stringify(answers);
      fs.writeFileSync('temp/selector.json', JSON.stringify(answers), (err) => {
        if (err) throw err;
      });
    });
};

//function for reading pdf-files and outputting the content
export const callReader = () => {
  reader().then(([docs, splitDocs]) => {
    docs.docs.forEach((doc) => {
      console.log(doc.pageContent);
    });
  });
};

//function for checking the model-type and -host used in main() function
export const checkModel = (model: number) => {
  const model_type = {
    remote: false,
    name: '',
  };

  if (model >= 100) {
    model_type.remote = true;
  }

  if (models.find((m) => m.value === model) === undefined) {
    throw new Error('Model konnte nicht gefunden werden');
  }

  model_type.name = models.find((m) => m.value === model).name;
  return model_type;
};
