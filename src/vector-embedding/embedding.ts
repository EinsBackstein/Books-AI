import { OllamaEmbeddings } from '@langchain/community/embeddings/ollama';
import { dataset } from './site+metadata.ts';

export default async function embedding() {
  const embeddings = new OllamaEmbeddings({
    model: 'nomic-embed-text',
    baseUrl: 'http://localhost:11434', // default value
    requestOptions: {
      useMMap: true,
      numThread: 10,
      numGpu: 2,
    },
  });

  const documents = [];

  const data = dataset;

  data[0].forEach((Document) => {
    documents.push(Document.text);
  });

  // console.log(documents);

  const documentEmbeddings = await embeddings.embedDocuments(documents);

  console.log(documentEmbeddings);
}
