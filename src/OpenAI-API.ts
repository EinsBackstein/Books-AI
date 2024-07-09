import OpenAI from 'openai';
import dotenv from 'dotenv';

//loads API-key and creates the client interface for the OpenAI API
dotenv.config();

export const local = new OpenAI({
  baseURL: 'http://localhost:11434/v1/',
  apiKey: process.env.OLLAMA_API_KEY,
});

export const cloud = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
