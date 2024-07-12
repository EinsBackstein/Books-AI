import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

//function for reading all PDF files in a directory
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

  //Prototype[0].docs for docs | Prototype[1].splitDocs for splitDocs
  return [{ docs }, { splitDocs }];
}
