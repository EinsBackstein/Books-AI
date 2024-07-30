// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck

import chalk from 'chalk';
import inquirer from 'inquirer';
import seperator from 'inquirer';
import fs from 'fs';
import { models } from '../constants/models.ts';

//user input for rag-usecase | rag-llm-model, rag-embedder & "message"
const userInput__ = async () => {
  await inquirer
    .prompt([
      {
        name: 'model_type',
        type: 'select',
        message: chalk.blue('Please select the model type'),
        choices: [
          {
            name: 'llama3',
            value: 1,
            disabled: false,
          },
          {
            name: 'gemma2',
            value: 2,
            disabled: false,
          },
        ],
      },
      {
        name: 'embedder_type',
        type: 'select',
        message: chalk.blue('Please select the embedder type'),
        choices: [
          {
            name: 'nomic-embed-text',
            value: 1,
            disabled: false,
          },
          {
            name: 'llama3',
            value: 2,
            disabled: false,
          },
        ],
        default: 1,
      },
      {
        name: 'user_input',
        type: 'input',
        message: chalk.cyan('Please enter your message'),
        default: 'Wie hoch sind die Grundstückspreise in Wien Favoriten?',
      },
    ])
    .then((answers) => {
      const json = JSON.stringify(answers);
      fs.writeFileSync('temp/RAG.json', JSON.stringify(answers), (err) => {
        if (err) throw err;
      });
    });
};

export default userInput__;
