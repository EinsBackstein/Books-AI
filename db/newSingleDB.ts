





//! -------------------------------------------------------------
//! This file builds a database from files with only 1 (one) embedded document per file. This leads to inaccurate results. Do not use if possible.
//! -------------------------------------------------------------







import { ChromaClient } from 'chromadb';
import { ChromaVectorStore, Document } from 'llamaindex';
import fs from 'fs';

const client = new ChromaClient({});
const collectionName = 'test123';

client.getOrCreateCollection({ name: collectionName });
const db = new ChromaVectorStore({ collectionName: collectionName });

const documents = [];

const dataArray = [];

fs.readdirSync('db-json-single/').forEach((file) => {
  const data = fs.readFileSync(`db-json-single/${file}`, 'utf8');
  const jsonData = JSON.parse(data);
  dataArray.push(jsonData);
});



dataArray.forEach((data) => {
  documents.push(
    new Document({
      text: data.node.text,
      metadata: {
        title: data.node.metadata.Title,
        subject: data.node.metadata.Subject,
        keywords: data.node.metadata.Keywords,
      },
      embedding: data.node.embedding,
      hash: data.node.hash,
      id_: data.node.id_,
    })
  );
});

await db.add(documents);

