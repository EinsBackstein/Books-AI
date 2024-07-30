import {
  Ollama,
  OllamaEmbedding,
  Settings,
  ChromaVectorStore,
  VectorStoreQueryMode,
  SummaryRetrieverMode,
  IngestionPipeline,
  TitleExtractor,
  Document,
  SimilarityType,
} from 'llamaindex';
import { newTextQaPrompt } from './llamaindex_settings.ts';
import { VectorStoreIndex } from 'llamaindex';
import chalk from 'chalk';
import { Stopwatch } from 'ts-stopwatch';
import OpenAI from 'openai';
let RAG;
import dotenv from 'dotenv';
import test from './site+metadata.ts';

dotenv.config();

export default RAG = async (llm: number, embedder: number, prompt: string) => {
  //* Settings

  const timer = new Stopwatch();
  timer.start();

  let model;
  if (llm === 1) {
    model = 'llama3';
  } else if (llm === 2) {
    model = 'gemma2';
  }

  let embedderModel;
  if (embedder === 1) {
    embedderModel = 'nomic-embed-text';
  } else if (embedder === 2) {
    embedderModel = 'llama3';
  }

  const ollama = new Ollama({
    model: model,
    config: {
      model: model,
    },
  });

  // Use Ollama LLM and Embed Model
  Settings.llm = ollama;
  Settings.embedModel = new OllamaEmbedding({ model: embedderModel });
  VectorStoreQueryMode.MMR;
  SummaryRetrieverMode.DEFAULT;
  SimilarityType.DOT_PRODUCT;

  const chromaVS = new ChromaVectorStore({
    collectionName: 'test-small-nodes-all',
  });
  //-small-nodes-all

  //* Cosmetic
  // const twirlTimer = (function () {
  //   const P = ['\\', '|', '/', '-'];
  //   let x = 0;
  //   return setInterval(function () {
  //     // process.stdout.write(chalk.magentaBright('\r' + P[x++]));
  //     process.stdout.write(
  //       chalk.magentaBright('Programm wird initialisiert', P[x++] ,'Ladezeit: ', timer.getTime() / 1000, 'Sekunden')
  //     );
  //     x &= 3;
  //     sleep(500).then(() => {
  //       readline.clearLine(process.stdout, 0);

  //       readline.cursorTo(process.stdout, 0);
  //       console.log('');
  //     });
  //   }, 250);
  // })();
  //Gibt es einen Umsetzungshinweis?

  //* Custom Prompt
  // const responseSynthesizer = new ResponseSynthesizer({
  //   responseBuilder: new CompactAndRefine(
  //     undefined,
  //     newTextQaPrompt,
  //     undefined
  //   ),
  // });

  // console.log('Dataset', timer.getTime());
  //* Dataset creation
  // const documents = [];

  // for (let i = 0; i < test.test.length; i++) {
  //   documents.push(
  //     new Document({
  //       text: test.test[i].pageContent,
  //       metadata: test.test[i].metadata.pdf.info,
  //     })
  //   );
  // }

  // const pipeline = new IngestionPipeline({
  //   transformations: [
  //     new TitleExtractor(),
  //     new OllamaEmbedding({
  //       model: 'nomic-embed-text',
  //     }),
  //   ],
  //   documents: [...documents],
  //   vectorStore: chromaVS,
  //   disableCache: true,
  // });

  // const nodes = await pipeline.run();

  // for (const node of nodes) {
  //   console.log(node.embedding);
  // }

  // const ctx = await serviceContextFromDefaults({
  //   chunkOverlap: 200,
  //   chunkSize: 2000,
  //   embedModel: embedderModel,
  //   llm: ollama,
  //   nodeParser: undefined,
  // });
  //* RAG-Process
  const index = await VectorStoreIndex.fromVectorStore(chromaVS).then(
    (index) => {
      // console.log('index', timer.getTime());
      return index;
    }
  );

  // const ret = new VectorIndexRetriever({ index: index, similarityTopK: 8 });

  // console.log(await ret.retrieve({ query: prompt }));

  const retriever = index.asRetriever({ similarityTopK: 8 });

  // console.log('queryengine', timer.getTime());
  const queryEngine = index.asQueryEngine({
    retriever: retriever,
    similarityTopK: 8,
  });
  queryEngine.updatePrompts({
    'responseSynthesizer:textQATemplate': newTextQaPrompt,
    'responseSynthesizer:refineTemplate': newTextQaPrompt,
  });
  // console.log(queryEngine.getPrompts());

  //Welche Ansprüche gegenüber Vermittlungsdiensteanbietern und Maßnahmen gegen Hass im Netz gibt es?
  //

  const context = await retriever.retrieve({ query: prompt });
  // console.log(context);
  const contextArray = [];
  context.forEach((element) => {
    contextArray.push(element.node.getContent(undefined));
  });

  // console.log(contextArray);
  // queryEngine.nodePostprocessors = [new SimilarityPostprocessor()];

  const openai = new OpenAI({
    baseURL: 'http://localhost:11434/v1/',
    apiKey: process.env.OLLAMA_API_KEY,
  });

  const stream = await openai.chat.completions.create({
    model: model,

    messages: [
      {
        role: 'user',
        content: `
        Context information is below.
        ---------------------
        ${contextArray}
        ---------------------
        Given the context information and not prior knowledge, answer the query. Do not use any external sources.
        Answer the query in german language!
        Du bist tätig in einem Unternehmen, welches mit Immobilien handelt. Du musst dich gut mit verschiedenen Rechtsgrundlagen auskennen. Dir werden oft Daten in der Form von Tabellen und Listen zur verfügung gestellt. Du musst diese Daten analysieren. Beschreibe ausführlich
        Query: ${prompt}
        Answer:`,
      },
    ],
    stream: true,
  });

  // clearInterval(twirlTimer);
  // function sleep(ms) {
  //   return new Promise((resolve) => setTimeout(resolve, ms));
  // }
  // console.log('');
  // sleep(2000);

  for await (const chunk of stream) {
    // response += chunk.choices[0]?.delta?.content || '';
    process.stdout.write(chalk.green(chunk.choices[0]?.delta?.content || ''));
  }

  console.log('');
  // console.log('Programmablauf beendet');

  //   const response = await queryEngine
  //     .query({
  //       query: prompt,
  //       stream: true,
  //     })
  //     .then((response) => {
  //       (async () => {
  //         for await (const chunk of response) {
  //           process.stdout.write(chalk.green(chunk.message.content));
  //         }
  //       })().then(() => {
  //         console.log('');
  //         console.log('Programmablauf beendet');
  //       });
  //     });

  // process.stdout.write(chalk.green(ollama.generate(response)));
  // console.log(response.sourceNodes);
  // console.log('response', timer.getTime() / 1000, 'Sekunden');

  // console.log(ollama);
  // ollama.ollama: (model: )

  //* Cosmetics + Result

  // console.log();
  // sleep(99).then(() => {
  //   console.log('');
  //   console.log('');
  //   console.log('End-Time', timer.stop() / 1000, 'Sekunden');
  // });
};
