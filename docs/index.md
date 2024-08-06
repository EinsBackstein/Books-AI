# Documentation

# Main-Program

## `npm start`

## Startpoint: index.ts

#### index.ts

In the index.ts, only the run()-function is called.
This run()-function handles the program sequence
The function is handled in `terminal/cmd.ts`

#### terminal/cmd.ts

As mentioned above, the program sequence is handled in this file

Firstly, there is some pure cosmetic code

```ts
await renderAscii();

console.log(
  chalk.red('Warnung: Dieses Programm befindet sich noch in der Beta')
);

console.log('');
```

Output:

```

'||''|.                   '||                    |     '||'
 ||   ||    ...     ...    ||  ..   ....        |||     ||
 ||'''|.  .|  '|. .|  '|.  || .'   ||. '       |  ||    ||
 ||    || ||   || ||   ||  ||'|.   . '|..     .''''|.   ||
.||...|'   '|..|'  '|..|' .||. ||. |'..|'    .|.  .||. .||.


Warnung: Dieses Programm befindet sich noch in der Beta

```

Then, the user has to make the first input, which chooses the task of the tool (e.g. RAG or just normal use like for example ChatGPT)

The function for this is called in `lib/helper.ts`, which outputs this:

```
? Bitte Verwendungszweck des Programmes auswählen: (Use arrow keys)
- Reader --- for testing only (disabled)
- Embedding --- for testing only (disabled)
❯ Fragen zu Sprengnetter Books
  Allgemeine Fragen
```

This input gets saved to .json in `json/selector.json`

```js
{ "usage_selection": 3 }
//1 - PDF-Reader, 2 - Embedding (show only), 3 - RAG, 4 - normal LLM use
```

The number for “usage_selection“ represents the task of the program for that run

### when - input = 1

If the user chooses the 1st option (which is only for testing and debugging purpose and normally disabled), the integrated PDF-Reader is called and outputs the text of the files stored in `pdfs/`. The reader is called once again in `lib/helper.ts`, but that is just for processing the output. The actual reader-function sits in `vector-embedding/pdfReader-ts`

### when - input = 2

If the user chooses the 2nd option (which is only for testing and debugging purpose and normally disabled), the integrated embedder is called, which is in `vector-embedding/embedding.ts`. These embeddings then get put out in the console.

### when - input = 3

If the user chooses the 3rd option, he has chosen to use the Retrieval Augmented Generation. So for this, there are some extra inputs the user needs to choose:

- The model, which will generate his answer.
  Currently available: llama3 (llama3-gradient), gemma2, mixtral:8x7b (Mixture of Experts), command-r
  This selection is easily expandable on the server by downloading new models via ollama
- (outdated) embedding model
  Right now there is already a reusable database implemented, so there are no new embeddings generated
- The message/query which the user wants to ask the system

The process is handled in `terminal/rag.ts` and the parameters are then saved to .json in `json/RAG.json`

```js
{
  "model_type": 1,
  // 1 - llama3, 2 - gemma2, 3 - mixtral:8x7b, 4 - command-r
  "embedder_type": 1,
  // 1 - nomic-embed-text, 2 - llama3
  "user_input": "<Some Question>?"
}
```

Then the actual RAG()-function is called at `vector-embedding/RAG-Call.ts
`
Since most of the inputs are stored as numbers, they have to get converted first. For this, every number has a string attached. This happens for both the llm-model and the embedder-model.

After that, a few settings need to be adjusted and the program connects to the chromaDB vector-database hosted somewhere.
An index is created from this vector store, where soon the context will be retrieved from.

Depending on the model, you can give it more or less nodes, which will change the amount of hallucinations but also the answer quality.

The context is stored in an array, which will soon be used alongside a predefined prompt for the llm

Then, the openAI-API, which is not necessary, but recommended for the generation, is defined and then the request already gets sent to the local ai models from ollama.

The answer from the model then gets processed and put out to the console. Then the program ends.

### when - input = 4

If the user chooses the 4th option, then there is no RAG involved. The user can just “chat“ with some Language model, but without the knowledge from Books. I don’t know honestly, if this feature is useful, but maybe someone wants to ask some general questions to the tool.

Similar to the extra RAG-inputs, the user also has to choose the model, which he wants to use. There are some local models again, but also some models from openAI.

The process is handled in `terminal/input.ts` and the parameters are then saved to .json in `json/input.json`

```js
{
  "model_type": 100,
  // 1 - llama3, 2 - gemma2, 100 - gpt-4o, 101 - gpt-3.5-turbo
  // local models are reserved for the space between 1 & 100
  // chatGPT models should be added with a value of 100 or above

  // models can be added under constants/models.ts

  "user_input": "<Any Prompt>"
}
```

After the user-input, the main()-function is called.
At first, it is checked if the user chose a local or a “cloud“/openAI model.

Depending of the output of this check, the call is either made to ollama or openAI.
The call itself is almost the same as with the RAG, except there is no additional prompt to tweak the outcome.
After the model generated an answer, it is printed out to the console and the program is finished.

# Database

## `npm build`

With `npm build` a new database can be created. For this, `db/newMultiDB.ts` is called.

It uses chromaDB to create a new vector-store from the .json-documents stored in db-json-multi.

Why “multi“?

At first I tried to create one embedding per PDF-file I had, but that didn’t work out at all, so i splitted every document in multiple vectors and saved them to a .json-File for each file.

That’s also the reason there are some weird forEach-methods used here.
The data in these .json-files are structured as an object which contains an array, which contains another array with objects that refer to each node with their metadatas and embeddings...so yeah. It’s a bit complex, but it works and it does it’s job.

In `db/newMultiDB.ts` there is also a counter included so you can see how many nodes need to be added to the vector-database and a counter how many nodes are already added, because this process of generating the DB can take minutes or even hours.

# Embeddings

## `npm generate`

You only need to use `npm generate` if there is no `db-json-multi/`-folder or if the folder is empty. It will generate the embeddings for all the PDFs
in `pdfs/`.

#### **_Attention: this can take multiple hours!_**

Explaining this process is a bit too complex and would probably take me another 3-400 words, which is...too much. Let’s just say “it just works“. The text from the files get split up in chunks of 512 tokens and added to an array which is then stored in the above mentioned .json-file.

Same with the naming scheme here, the “multi“ comes from the amounts of vectors in each file. There are also files `db/embedderSingelVector.ts` & `db/newSingleDB.ts`. The program will work with these two files and the created single-vector-embeddings, but you **==cannot==** expect **any** correct results when using RAG, since one single vector cannot store enough information for all the words and tokens in a file which has 100-200 pages. (One vector has about 770 values, so yeah)
