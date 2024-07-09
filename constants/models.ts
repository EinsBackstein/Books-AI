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
    name: 'gpt-4o',
    value: 100,
    disabled: false,
  },
  {
    name: 'gpt-3.5-turbo',
    value: 101,
    disabled: false,
  },
  {
    name: 'mixtral',
    value: 3,
    disabled: chalk.red('Aktuell nicht verfügbar'),
  },
];
