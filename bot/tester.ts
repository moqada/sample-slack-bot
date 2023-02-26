import {
  BotHandlerFuncMessageContext,
  BotHandlerFuncReactionContext,
  BotMentionHandler,
  BotMessageHandler,
  BotReactionHandler,
  Message,
  Reaction,
  RespondFunction,
} from "./types.ts";

type MessageContextFactory = (
  command: string,
  overrides?: Partial<
    Omit<BotHandlerFuncMessageContext, "message"> & {
      message: Omit<Message, "match">;
    }
  >,
) => BotHandlerFuncMessageContext;
type ReactionContextFactory = (
  emoji: string,
  overrides?: Partial<
    Omit<BotHandlerFuncReactionContext, "reaction"> & {
      reaction: Omit<Reaction, "emoji">;
    }
  >,
) => BotHandlerFuncReactionContext;

const dummyRespond: RespondFunction = () => {
  // dummy function
};

export function createBotTester(
  handler: BotMentionHandler | BotMessageHandler,
): { createContext: MessageContextFactory };
export function createBotTester(
  handler: BotReactionHandler,
): { createContext: ReactionContextFactory };
export function createBotTester(
  handler: BotMentionHandler | BotMessageHandler | BotReactionHandler,
): {
  createContext: MessageContextFactory | ReactionContextFactory;
} {
  switch (handler.type) {
    case "mention":
    case "message":
      return {
        createContext: (
          ...[command, overrides]: Parameters<MessageContextFactory>
        ) => {
          const match = handler.pattern.exec(command);
          if (!match) {
            throw Error(`pattern did not match: ${command}`);
          }
          const { message, ...otherOverrides } = overrides || {};
          return {
            bot: { mentions: [], messages: [], reactions: [] },
            env: {},
            message: {
              channelId: "DUMMY_CHANNEL_ID",
              channelType: "public" as const,
              match,
              messageTs: "1674314104981.123",
              userId: "DUMMY_USER_ID",
              ...message,
            },
            respond: dummyRespond,
            ...otherOverrides,
          };
        },
      };
    case "reaction":
      return {
        createContext: (
          ...[emoji, overrides]: Parameters<ReactionContextFactory>
        ) => {
          const { reaction, ...otherOverrides } = overrides || {};
          return {
            bot: { mentions: [], messages: [], reactions: [] },
            env: {},
            reaction: {
              channelId: "DUMMY_CHANNEL_ID",
              messageTs: "1674314104981.123",
              emoji,
              userId: "DUMMY_USER_ID",
              ...reaction,
            },
            respond: dummyRespond,
            ...otherOverrides,
          };
        },
      };
    default:
      throw new Error("invalid handler type");
  }
}
