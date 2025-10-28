//The class fetches history data from the db and checks if its within the acceptable context window
//If not create a new session or summarise the history to something within the context window
import { db } from "@/lib/store/db.ts";
export type Bubble = {
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

type ConstructorParams = {
  session?: LanguageModel;
  historyArray?: Bubble[];
  conversation_id?: string;
};
type AIParams = {
  defaultTemperature?: number;
  maxTemperature?: number;
  defaultTopK?: number;
  maxTopK?: number;
};

interface LanguageModel {
  promptStreaming(prompt: string): Promise<ReadableStream<any>>;
  append(bubble: Bubble[]): Promise<string>;
}

declare const LanguageModel: {
  create(config: AIConfig): Promise<LanguageModel>;
  availability(params: { language: string }): Promise<string>;
};

export class Model {
  private session!: LanguageModel;
  private history: Bubble[] = [];
  private conversation_id: string = "";
  private config: AIConfig = {
    initialPrompts: [
      { role: "system", content: "You are a helpful and chill AI tutor." },
      ...this.history,
    ],
    expectedInputs: { type: "text", languages: ["en"] },
    expectedOutputs: { type: "text", languages: ["en"] },
  };

  constructor({ session, historyArray, conversation_id }: ConstructorParams) {
    if (session) this.session = session;
    if (historyArray) this.history.push(...historyArray);
    if (conversation_id) this.conversation_id = conversation_id;
  }
  async loadHistory() {
    const fetched_history = await db.Conversations.where("conversation_id")
      .equals(this.conversation_id)
      .first();
    this.history = fetched_history?.conversation_content || [];
    this.config = {
      initialPrompts: [
        { role: "system", content: "You are a helpful and chill AI tutor." },
        ...this.history,
      ],
      expectedInputs: { type: "text", languages: ["en"] },
      expectedOutputs: { type: "text", languages: ["en"] },
    };
  }
  async init() {
    if (this.conversation_id) await this.loadHistory();
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
  async destroy() {
    this.session.destroy();
  }
  async clone() {
    return this.session.clone();
  }
}
