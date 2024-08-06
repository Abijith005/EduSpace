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
    const msg = `The error message "We can't verify your address" typically occurs when the address entered does not match the format expected by PayPal or when there is an issue with the address verification service in the PayPal sandbox environment. Here are a few steps to help you troubleshoot and resolve this issue:`;
    // const chatCompletion = await client.chat.completions.create(params);
    // const responseContent = chatCompletion.choices[0].message.content;
    // res.status(200).json({ success: true,chatCompletion:responseContent });
    setTimeout(() => {
      res.json({ success: true, chatCompletion: msg });
    }, 2000);
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
