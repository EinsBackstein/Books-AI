import OpenAI from 'openai';
import dotenv from 'dotenv';

let openai_API;

//loads API-key and creates the client interface for the OpenAI API
dotenv.config();

export default openai_API = new OpenAI({
  baseURL: 'http://localhost:11434/v1/',
  apiKey: process.env.OPENAI_API_KEY,
});
