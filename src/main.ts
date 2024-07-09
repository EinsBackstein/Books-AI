import openai_API from './OpenAI-API.ts';

//load the client interface
const openai = openai_API;

//main query
export default async function main(user_input: string, model_type: string) {
  //main query to the llm
  const stream = await openai.chat.completions.create({
    model: model_type,
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
