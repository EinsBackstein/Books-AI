import openai_API from './OpenAI-API.ts';

//load the client interface
const openai = openai_API;

//main query
export default async function main() {
  //main query to the llm
  const stream = await openai.chat.completions.create({
    model: 'llama3',
    messages: [{ role: 'user', content: 'Which llm are you? Who programmed you?' }],
    stream: true,
  });

  //llm response
  let response = '';
  for await (const chunk of stream) {
    response += chunk.choices[0]?.delta?.content || '';
  }

  await console.log(response);
}
