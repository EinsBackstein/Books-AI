import { models } from '../constants/models.ts';
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

const checkModel = (model: number) => {
  const model_type = {
    remote: false,
    name: '',
  };

  if (model >= 100) {
    model_type.remote = true;
  }

  if (models.find((m) => m.value === model) === undefined) {
    throw new Error('Model not found');
  }

  model_type.name = models.find((m) => m.value === model).name;
  return model_type;
};
