export type BotResponse = {
  type: "none";
} | {
  type: "message";
  text: string;
  mentionUserId?: string;
} | {
  type: "reaction";
  emoji: string;
  messageTs: string;
};

type Env = Record<string, string>;

type CommandTrigger = string;
type CommandDescription = string;
type CommandParameter = string;

export type ChannelType = "public" | "private" | "im" | "mpim";

export type Message = {
  channelId: string;
  channelType: ChannelType;
  match: RegExpMatchArray;
  messageTs: string;
  threadTs?: string;
  userId: string;
};

export type Reaction = {
  channelId: string;
  emoji: string;
  messageTs: string;
  threadTs?: string;
  userId: string;
};

export type RespondFunction = (
  res: Exclude<BotResponse, { type: "none" }>,
) => void;

type BotHandlerFuncBaseContext = {
  bot: Bot;
  env: Env;
  respond: RespondFunction;
};
export type BotHandlerFuncMessageContext = BotHandlerFuncBaseContext & {
  message: Message;
};
export type BotHandlerFuncReactionContext = BotHandlerFuncBaseContext & {
  reaction: Reaction;
};

export type BotMentionHandler = {
  type: "mention";
  name: string;
  help: (
    | `${CommandTrigger} - ${CommandDescription}`
    | `${CommandTrigger} <${CommandParameter}> - ${CommandDescription}`
  )[];
  pattern: RegExp;
  func: (
    ctx: BotHandlerFuncMessageContext,
  ) => Promise<BotResponse> | BotResponse;
};

export type BotMessageHandler = {
  type: "message";
  name: string;
  help: `${CommandTrigger} - ${CommandDescription}`[];
  pattern: RegExp;
  func: (
    ctx: BotHandlerFuncMessageContext,
  ) => Promise<BotResponse> | BotResponse;
};

export type BotReactionHandler = {
  type: "reaction";
  name: string;
  help: `:${CommandTrigger}: - ${CommandDescription}`[];
  emojis: string[];
  func: (
    ctx: BotHandlerFuncReactionContext,
  ) => Promise<BotResponse> | BotResponse;
};

export type Bot = {
  mentions: BotMentionHandler[];
  messages: BotMessageHandler[];
  reactions: BotReactionHandler[];
};
