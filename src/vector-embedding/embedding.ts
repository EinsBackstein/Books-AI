import { OllamaEmbeddings } from '@langchain/community/embeddings/ollama';
import reader from './pdfReader.ts';

export default async function embedding() {
  const embeddings = new OllamaEmbeddings({
    model: 'llama3',
    baseUrl: 'http://localhost:11434', // default value
    requestOptions: {
      useMMap: true,
      numThread: 10,
      numGpu: 2,
    },
  });

  const documents = [];

  const data = await reader();

  data[0].docs.forEach((Document) => {
    documents.push(Document.pageContent);
  });

  // console.log(documents);

  const documentEmbeddings = await embeddings.embedDocuments(documents);

  console.log(documentEmbeddings);
}
