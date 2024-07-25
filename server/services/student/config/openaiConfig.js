import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;
const openaiClent = new OpenAI({
  apiKey: apiKey,
});

export default openaiClent;
