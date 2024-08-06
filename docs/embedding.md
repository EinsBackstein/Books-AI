# Embeddings

## `npm generate`

## Startpoint: db/embedderMultiVector.ts

You only need to use `npm generate` if there is no `db-json-multi/`-folder or if the folder is empty. It will generate the embeddings for all the PDFs
in `pdfs/`.

#### **_Attention: this can take multiple hours!_**

Explaining this process is a bit too complex and would probably take me another 3-400 words, which is...too much. Let’s just say “it just works“. The text from the files get split up in chunks of 512 tokens and added to an array which is then stored in the above mentioned .json-file.

Same with the naming scheme here, the “multi“ comes from the amounts of vectors in each file. There are also files `db/embedderSingelVector.ts` & `db/newSingleDB.ts`. The program will work with these two files and the created single-vector-embeddings, but you **==cannot==** expect **any** correct results when using RAG, since one single vector cannot store enough information for all the words and tokens in a file which has 100-200 pages. (One vector has about 770 values, so yeah)
