// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck

import chalk from 'chalk';
import inquirer from 'inquirer';
import seperator from 'inquirer';
import main from '../main.ts';
import userInput from '../terminal/input.ts';
import fs from 'fs';
import { models } from '../constants/models.ts';
import reader from '../vector-embedding/pdfReader.ts';

export const call = () => {
  userInput().then(() => {
    const input = JSON.parse(fs.readFileSync('json/input.json', 'utf8'));
    // console.log(input);
    main(input.user_input, input.model_type);
  });
};

export const userInput_ = async () => {
  await inquirer
    .prompt([
      {
        name: 'usage_selection',
        type: 'select',
        message: chalk.yellow('Bitte Verwendungszweck auswählen'),
        choices: [
          'PDF-Reader',
          'Embedding',
          'LLM-Connection',
        ],
      },
    ])
    .then((answers) => {
      const json = JSON.stringify(answers);
      fs.writeFileSync('json/selector.json', JSON.stringify(answers), (err) => {
        if (err) throw err;
      });
    });
};

export const callReader = () => {
  reader().then(([docs, splitDocs]) => {
    docs.docs.forEach((doc) => {
      console.log(doc.pageContent);
    });
  });
};

export const checkModel = (model: number) => {
  const model_type = {
    remote: false,
    name: '',
  };

  if (model >= 100) {
    model_type.remote = true;
  }

  if (models.find((m) => m.value === model) === undefined) {
    throw new Error('Model not found');
  }

  model_type.name = models.find((m) => m.value === model).name;
  return model_type;
};