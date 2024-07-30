import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import fs from 'fs';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import {
  Document,
  IngestionPipeline,
  OllamaEmbedding,
  TitleExtractor,
} from 'llamaindex';

import { Stopwatch } from 'ts-stopwatch';
const timer = new Stopwatch();

timer.start();

const docs = fs.readdirSync('pdfs/');

async function read(docNum) {
  const loader = new PDFLoader('pdfs/' + docs[docNum], {
    splitPages: false,
  });
  const documents = await loader.load();

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 512,
  });
  const splitDocs = await textSplitter.splitDocuments(documents);

  return [{ documents }, { splitDocs }];
}

async function callReader(docNum) {
  const arr = read(docNum).then(([documents, splitDocs]) => {
    const temp = [];
    splitDocs.splitDocs.forEach((doc) => {
      temp.push({ text: doc.pageContent, metadata: doc.metadata });
    });
    return temp;
  });
  return arr;
}

for (let i = 0; i < docs.length; i++) {
  const chunks = await callReader(i);

  const documents = [];

  for (let i = 0; i < chunks.length; i++) {
    documents.push(
      new Document({
        text: chunks[i].text,
        metadata: chunks[i].metadata.pdf.info,
      })
    );
  }

  const pipeline = new IngestionPipeline({
    transformations: [
      new TitleExtractor(),
      new OllamaEmbedding({
        model: 'nomic-embed-text',
      }),
    ],
    documents: [...documents],
  }).run();

  const array = await pipeline;
  console.log(array[0].metadata.Title);
  fs.writeFile(
    `db-json-multi/${array[0].metadata.Title}-Embedding.json`,
    JSON.stringify({ array }),
    (err) => {}
  );
}
