import {
  IngestionPipeline,
  Ollama,
  OllamaEmbedding,
  Settings,
  TitleExtractor,
  ChromaVectorStore,
  VectorStoreQueryMode,
} from 'llamaindex';
import { newTextQaPrompt } from './llamaindex_settings.ts';
import { Document, VectorStoreIndex } from 'llamaindex';
import * as readline from 'node:readline';
import test from './site+metadata.ts';
import chalk from 'chalk';

let RAG;

export default RAG = async (llm: number, embedder: number, prompt: string) => {
  //* Settings
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
  });

  // Use Ollama LLM and Embed Model
  Settings.llm = ollama;
  Settings.embedModel = new OllamaEmbedding({ model: embedderModel });
  VectorStoreQueryMode.HYBRID;

  const chromaVS = new ChromaVectorStore({ collectionName: 'test' });
  //* Cosmetic
  const twirlTimer = (function () {
    const P = ['\\', '|', '/', '-'];
    let x = 0;
    return setInterval(function () {
      process.stdout.write(chalk.magentaBright('\r' + P[x++]));
      x &= 3;
    }, 250);
  })();

  //* Custom Prompt
  // const responseSynthesizer = new ResponseSynthesizer({
  //   responseBuilder: new CompactAndRefine(
  //     undefined,
  //     newTextQaPrompt,
  //     undefined
  //   ),
  // });

  //* Dataset creation
  const documents = [];

  for (let i = 0; i < test.test.length; i++) {
    documents.push(
      new Document({
        text: test.test[i].pageContent,
        metadata: test.test[i].metadata.pdf.info,
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
    vectorStore: chromaVS,
    disableCache: true,
  });

  const nodes = await pipeline.run();

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
  const index = await VectorStoreIndex.fromVectorStore(chromaVS);

  // new VectorIndexRetriever({
  //   index: index,
  // });

  const queryEngine = index.asQueryEngine({ similarityTopK: 10 });

  queryEngine.updatePrompts({
    'responseSynthesizer:textQATemplate': newTextQaPrompt,
    'responseSynthesizer:refineTemplate': newTextQaPrompt,
  });
  // console.log(queryEngine.getPrompts());

  //Welche Ansprüche gegenüber Vermittlungsdiensteanbietern und Maßnahmen gegen Hass im Netz gibt es?
  //

  const response = await queryEngine.query({
    query:prompt,
  });
  // console.log(response.sourceNodes);

  //* Cosmetics + Result
  clearInterval(twirlTimer);
  readline.clearLine(process.stdout, 0);
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  console.log();
  sleep(99).then(() => {
    console.log('');
    console.log(chalk.green(response.message.content));
    console.log('');
  });
};
