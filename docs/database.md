# Database

## `npm build`

## Startpoint: db/newMultiDB.ts

With `npm build` a new database can be created. For this, `db/newMultiDB.ts` is called.

It uses chromaDB to create a new vector-store from the .json-documents stored in db-json-multi.

Why “multi“?

At first I tried to create one embedding per PDF-file I had, but that didn’t work out at all, so i splitted every document in multiple vectors and saved them to a .json-File for each file.

That’s also the reason there are some weird forEach-methods used here.
The data in these .json-files are structured as an object which contains an array, which contains another array with objects that refer to each node with their metadatas and embeddings...so yeah. It’s a bit complex, but it works and it does it’s job.

In `db/newMultiDB.ts` there is also a counter included so you can see how many nodes need to be added to the vector-database and a counter how many nodes are already added, because this process of generating the DB can take minutes or even hours.