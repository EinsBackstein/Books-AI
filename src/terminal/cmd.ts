import renderAscii from './ascii.ts';
import userInput from './input.ts';
// import input from '../../json/input.json';
import fs from 'fs';

export const run_terminal = async () => {
  await renderAscii();
  await userInput();
};
