import {
  Document,
  OllamaEmbedding,
  TitleExtractor,
} from 'llamaindex';
import fs from 'fs';
import { dataset } from '../src/vector-embedding/site+metadata.ts';
import { IngestionPipeline } from 'llamaindex';
import { Stopwatch } from 'ts-stopwatch';

const timer = new Stopwatch();

timer.start();

const documents = [];

for (let i = 0; i < dataset.length; i++) {
  console.log(i);
  documents.push(
    new Document({
      text: dataset[i][0].text,
      metadata: dataset[i][0].metadata.pdf.info,
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

console.log(await pipeline);

const array = await pipeline;

array.forEach((node) => {
  console.log(timer.getTime());
  fs.writeFile(
    `db-json-single/${node.metadata.Title}-Embedding.json`,
    JSON.stringify({ node }),
    (err) => {}
  );
});

console.log('Done', timer.stop());

const getData = async () => {
  const embedArray = [];
  await fs.readdirSync('db-json-single/').forEach((file) => {
    // console.log(file);
    const data = JSON.parse(fs.readFileSync(`db-json-single/${file}`, 'utf8'));
    embedArray.push({
      data,
    });
  });
  return embedArray;
};

const arr = await getData();
