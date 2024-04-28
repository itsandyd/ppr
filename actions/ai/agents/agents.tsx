import { createAI, createStreamableValue } from 'ai/rsc';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';

// import { OpenAi } from 'openai';
import { config } from './config';

// const openai = new OpenAi({
//   baseURL: config.nonOllamaBaseURL,
//   apiKey: config.inferenceAPIKey
// });

const embeddings = new OpenAIEmbeddings({
  modelName: config.embeddingsModel
});

async function myAction() {
  "use server";
  const streamable = createStreamableValue({});
}

const initialAIState: {
  role: 'user' | 'assistant' | 'system' | 'function';
  content: string;
  id?: string;
  name?: string;
}[] = [];
const initialUIState: {
  id: number;
  display: React.ReactNode;
}[] = [];

export const AI = createAI({
    actions: {
      myAction
    },
    initialUIState,
    initialAIState,
  });