import { checkModel } from './lib/helpers.ts';
import { local, cloud } from './OpenAI-API.ts';

//main query
export default async function main(user_input: string, model_type: number) {
  const model = checkModel(model_type);
  let openai;
  if (model.remote === true) {
    openai = cloud;
  } else {
    openai = local;
  }
  // main query to the llm
  const stream = await openai.chat.completions.create({
    model: model.name,
    messages: [{ role: 'user', content: user_input }],
    stream: true,
  });

  //llm response
  let response = '';
  for await (const chunk of stream) {
    response += chunk.choices[0]?.delta?.content || '';
  }

  await console.log(response);
}
