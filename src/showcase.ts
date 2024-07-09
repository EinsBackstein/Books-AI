// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck

import chalk from 'chalk';
import inquirer from 'inquirer';
import seperator from 'inquirer';
import fs from 'fs';

const userInput_ = async () => {
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

export default userInput_;