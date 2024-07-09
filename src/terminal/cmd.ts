import renderAscii from './ascii.ts';
import userInput from './input.ts';

export const run_terminal = async () => {
  await renderAscii();
  await userInput();
};