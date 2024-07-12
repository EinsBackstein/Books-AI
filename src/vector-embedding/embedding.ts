import { OllamaEmbeddings } from '@langchain/community/embeddings/ollama';
import reader from './pdfReader.ts';

export default async function embedding() {
  const embeddings = new OllamaEmbeddings({
    model: 'nomic-embed-text',
    baseUrl: 'http://localhost:11434', // default value
  });

  const documents = [];
  const data = await reader();

  data[0].docs.forEach((Document) => {
    documents.push(Document.pageContent);
  });

  const documentEmbeddings = await embeddings.embedDocuments(documents);
  console.log(documentEmbeddings);
}
