import { run_terminal } from './terminal/cmd.ts';
import main from './main.ts';
import fs from 'fs';

run_terminal().then(() => {
  const input = JSON.parse(fs.readFileSync('json/input.json', 'utf8'));
  // console.log(input);
  main(input.user_input, input.model_type);
});
