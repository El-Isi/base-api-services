import OpenAI from "openai";

let openaiClient: OpenAI | null = null;
const getClient = (): OpenAI => {
  if (!openaiClient) openaiClient = new OpenAI();
  return openaiClient;
};

interface OpenAIChatOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

const DEFAULTS: Required<OpenAIChatOptions> = {
  model: "gpt-4o-mini",
  temperature: 0.7,
  maxTokens: 500,
  systemPrompt: "You are a helpful assistant.",
};

export default class OpenAIChat {
  async exec(message: string, options: OpenAIChatOptions = {}) {
    const config = { ...DEFAULTS, ...this.cleanOptions(options) };

    const completion = await getClient().chat.completions.create({
      model: config.model,
      temperature: config.temperature,
      max_tokens: config.maxTokens,
      messages: [
        {
          role: "system",
          content: config.systemPrompt,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    return completion;
  }

  private cleanOptions(options: OpenAIChatOptions): Partial<Required<OpenAIChatOptions>> {
    const cleaned: any = {};
    if (options.model) cleaned.model = options.model;
    if (options.temperature !== undefined) cleaned.temperature = options.temperature;
    if (options.maxTokens !== undefined) cleaned.maxTokens = options.maxTokens;
    if (options.systemPrompt) cleaned.systemPrompt = options.systemPrompt;
    return cleaned;
  }
}
