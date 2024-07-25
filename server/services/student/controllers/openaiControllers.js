import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getChatCompletion = async (req, res) => {
  try {
    console.log("hererer");
    const { prompt } = req.body;
    console.log(prompt);

    const params = {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
      temperature: 1.0,
      top_p: 0.9,
      frequency_penalty: 0.5,
      presence_penalty: 0.6,
    };

    const chatCompletion = await client.chat.completions.create(params);
    const responseContent = chatCompletion.choices[0].message.content;
    res.json({ success: responseContent });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};
