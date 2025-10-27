type Bubble = {
  role: "user" | "system" | "assistant";
  content:
    | string
    | { type: "text" | "image"; value: string | Buffer | unknown }[];
  prefix?: boolean;
};

type AIConfig = {
  initialPrompts?: Bubble[];
  expectedInputs?: { type: "text"; languages: ["en"] };
  expectedOutputs?: { type: "text"; languages: ["en"] };
};

type AIParams = {
  defaultTemperature?: number;
  maxTemperature?: number;
  defaultTopK?: number;
  maxTopK?: number;
};

// Mock interface for LanguageModel (replace with real implementation)
interface LanguageModel {
  promptStreaming(prompt: string): Promise<ReadableStream<any>>;
  append(bubble: Bubble[]): Promise<string>;
}

declare const LanguageModel: {
  create(config: AIConfig): Promise<LanguageModel>;
  availability(params: { language: string }): Promise<string>;
};

class Model {
  private session!: LanguageModel;
  private history: Bubble[] = [];
  private config: AIConfig = {
    initialPrompts: [
      { role: "system", content: "You are a helpful and chill AI tutor." },
    ],
    expectedInputs: { type: "text", languages: ["en"] },
    expectedOutputs: { type: "text", languages: ["en"] },
  };

  constructor(session?: LanguageModel, historyArray?: Bubble[]) {
    if (session) this.session = session;
    if (historyArray) this.history.push(...historyArray);
  }

  async init() {
    this.session = await LanguageModel.create(this.config);
  }

  async isAvailable(): Promise<string> {
    return await LanguageModel.availability({ language: "en" });
  }

  async generate(prompt: string, image?: Buffer): Promise<ReadableStream<any>> {
    if (!this.session) await this.init();
    return await this.session.promptStreaming(prompt);
  }

  async add(appendPrompts: Bubble[]): Promise<string> {
    if (!this.session) await this.init();
    return await this.session.append(appendPrompts);
  }
}
