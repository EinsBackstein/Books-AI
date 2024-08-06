# Sprengnetter Books AI Companion

The Books AI Companion is an easy-to-use AI-Toolkit with multiple integrated Large Language Models (LLMs). It is lightweight with minimal dependencies. The Books AI can help find information faster, summarize or explain Texts from Sprengnetter Books.
To achieve quick and accurate responses we use Retrieval Augmented Generation to support the local language models.

Currently still in beta

## Features

- Advanced content generation through AI
- User-friendly, appealing UI
- Written in Typescript (fully type-safe)
- Focused on efficiency and minimized waiting time
- Big selection between LLMs
- Integrated PDF-Reader & Embedding

## Installation

### Requirements

Since this is a Node.js based TypeScript project, you will need Node.js 16 or later

To check your node version, try following command:

```bash

node -v

v20.9.0

```

To install and run this project, follow these steps:

1. Clone this repository

```bash

git clone https://github.com/EinsBackstein/work.git

cd work

code .

```

2. Install all the packages

```bash

npm install

```

3. You will need to create a '.env'-file in order to make the large language models work

```ts

OPENAI_API_KEY = <sk-yourKeyHere>

OLLAMA_API_KEY = ollama

```

4. That's it, you're ready to go! - Start the program with:

```bash

npm start

```

## Roadmap

Future improvements & planned new features:

- Globally usable database
- Improved generation & answer quality
- Graphical UI
- Improved language support
- Authentication
- Expanded knowledge base
  - Sub-DBs
  - Single-File-DBs
- Automated Selector Updater (new models get automatically added to a list)
- Change of the RAG user-input (currently outdated)
- Specific predefined prompts for each model

### Documentation

[You can find the documentation of this project here.](https://einsbackstein.github.io/Books-AI/)