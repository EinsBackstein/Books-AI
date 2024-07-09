import chalk from 'chalk';

export const models = [
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
  {
    name: 'GPT-4o',
    value: 99,
    disabled: false,
  },
  {
    name: 'GPT-3.5 Turbo',
    value: 100,
    disabled: false,
  },
  {
    name: 'mixtral',
    value: 3,
    disabled: chalk.red('Aktuell nicht verfügbar'),
  },
];
