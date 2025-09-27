const OpenAI = require("openai");
const ai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
// const ai = new OpenAI({
//   baseURL: "https://api.deepseek.com",
//   apiKey: process.env.DEEPSK_API_KEY,
// });
async function summarizeText(text) {
  try {
    const completion = await ai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that provides concise and accurate summaries in the same language as the input text.",
        },
        {
          role: "user",
          content: `Please summarize the following text in the same language as it is written: ${text}`,
        },
      ],
      model: "gpt-5-nano",
      max_completion_tokens: 1000,
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error summarizing text:", error);
    throw new Error("Failed to summarize text");
  }
}

module.exports = { summarizeText };
