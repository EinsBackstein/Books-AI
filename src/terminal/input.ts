// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck

import chalk from 'chalk';
import inquirer from 'inquirer';
import seperator from 'inquirer';
import fs from 'fs';
import { models } from '../constants/models.ts';

const userInput = async () => {
  await inquirer
    .prompt([
      {
        name: 'user_input',
        type: 'input',
        message: chalk.cyan('Please enter your message'),
      },
      {
        name: 'model_type',
        type: 'select',
        message: chalk.blue('Please select the model type'),
        choices: models,
      },
    ])
    .then((answers) => {
      const json = JSON.stringify(answers);
      fs.writeFileSync('json/input.json', JSON.stringify(answers), (err) => {
        if (err) throw err;
      });
    });
};

export default userInput;