// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck

import chalk from 'chalk';
import inquirer from 'inquirer';
import seperator from 'inquirer';
import fs from 'fs';
import { models } from '../constants/models.ts';

//user input for llm-usecase | llm-model & "message"
const userInput = async () => {
  await inquirer
    .prompt([
      {
        name: 'model_type',
        type: 'select',
        message: chalk.blue('Bitte Sprachmodell auswählen:'),
        choices: models,
      },
      {
        name: 'user_input',
        type: 'input',
        message: chalk.cyan('Bitte Prompt eingeben:'),
      },
    ])
    .then((answers) => {
      const json = JSON.stringify(answers);
      fs.writeFileSync('temp/input.json', JSON.stringify(answers), (err) => {
        if (err) throw err;
      });
    });
};

export default userInput;
