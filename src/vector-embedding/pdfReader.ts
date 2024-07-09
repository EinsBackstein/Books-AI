import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

export default async function reader() {
  const directoryLoader = new DirectoryLoader('docs/', {
    '.pdf': (path: string) => new PDFLoader(path),
  });
  const docs = await directoryLoader.load();

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 200,
  });
  const splitDocs = await textSplitter.splitDocuments(docs);

  return [{ docs }, { splitDocs }];
}

const callReader = () => {
  reader().then(([docs, splitDocs]) => {
    docs.docs.forEach((doc) => {
      console.log(doc.pageContent);
    });
  });
};

export { callReader };