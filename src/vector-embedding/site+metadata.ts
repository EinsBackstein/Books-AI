import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import fs from 'fs';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';

async function test1() {
  const directoryLoader = new DirectoryLoader('docs/', {
    '.pdf': (path: string) => new PDFLoader(path),
  });
  const docs = await directoryLoader.load();
  
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 2000,
    chunkOverlap: 200,
  });
  
  const test = await textSplitter.splitDocuments(docs);
  // console.log(test[0].metadata.pdf);
  return test;
}
const test = await test1();
export default { test };





// const docs = fs.readdirSync('docs/');

// async function read(docNum) {
//   const loader = new PDFLoader('docs/' + docs[docNum], {
//     splitPages: false,
//   });
//   const documents = await loader.load();

//   const textSplitter = new RecursiveCharacterTextSplitter({
//     chunkSize: 500,
//     chunkOverlap: 200,
//   });
//   const splitDocs = await textSplitter.splitDocuments(documents);

//   return [{ documents }, { splitDocs }];
// }

// async function callReader(docNum) {
//   const arr = read(docNum).then(([documents, splitDocs]) => {
//     const temp = [];
//     documents.documents.forEach((doc) => {
//       temp.push({ text: doc.pageContent, metadata: doc.metadata });
//     });
//     return temp;
//   });
//   return arr;
// }

// async function exportAll() {
//   const promiseArray = [];
//   for (let i = 0; i < docs.length; i++) {
//     const tmp = await callReader(i);
//     promiseArray.push(tmp);
//   }
//   const result = await Promise.all(promiseArray);
//   return result;
// }

// const dataset = await exportAll();

