import OpenAI from "openai";
const openai = new OpenAI();

export default class OpenAIChat {
  async exec(message: string) {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 1,
      max_tokens: 30,
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });
    return completion
  }
}
