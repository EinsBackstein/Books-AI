import main from './main.ts';
import userInput from './terminal/input.ts';
import fs from 'fs';

export default function call() {
  userInput().then(() => {
    const input = JSON.parse(fs.readFileSync('json/input.json', 'utf8'));
    // console.log(input);
    main(input.user_input, input.model_type);
  });
}
