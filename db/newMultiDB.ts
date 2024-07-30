import { ChromaClient } from 'chromadb';
import { ChromaVectorStore, Document } from 'llamaindex';
import fs from 'fs';

const client = new ChromaClient({});
const collectionName = 'test-small-nodes-all';
// client.deleteCollection({ name: collectionName });

const db = new ChromaVectorStore({ collectionName: collectionName });

const documents = [];

const fileArray = [];

fs.readdirSync('db-json-multi/').forEach((file) => {
  const data = fs.readFileSync(`db-json-multi/${file}`, 'utf8');
  // console.log(data);
  const jsonData = JSON.parse(data);
  fileArray.push(jsonData);
});

// console.log(fileArray[0].array[0].metadata.Title);

fileArray.forEach((file) => {
  // console.log(file);
  file.array.forEach((node) => {
    documents.push(
      new Document({
        text: node.text,
        metadata: {
          title: node.metadata.Title,
          subject: node.metadata.Subject,
          keywords: node.metadata.Keywords,
        },
        embedding: node.embedding,
        hash: node.hash,
        id_: node.id_,
      })
    );
  });
});

console.log(documents.length);
let i = 0;
// // console.log(documents);
for (const node of documents) {
  i++;
  console.log(i);
  await db.add([node]);
}
// await db.add(documents);
