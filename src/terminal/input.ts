// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck

import chalk from 'chalk';
import inquirer from 'inquirer';
import seperator from 'inquirer';
import fs from 'fs';
import exp from 'constants';

const userInput = async () => {
  await inquirer
    .prompt([
      {
        name: 'user_input',
        type: 'input',
        message: chalk.cyan('Please enter your message'),
        id: 1,
      },
      {
        name: 'model_type',
        type: 'select',
        message: chalk.blue('Please select the model type'),
        id: 2,
        choices: [
          new inquirer.Separator(' '),
          'llama3',
          'gemma2',
          {
            name: 'mixtral',
            disabled: chalk.red('Aktuell nicht verfügbar'),
          },
        ],
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