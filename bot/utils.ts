import {
  BotMentionHandler,
  BotMessageHandler,
  BotReactionHandler,
} from "./types.ts";

export const createBotMention = (
  inputs: Omit<BotMentionHandler, "type">,
): BotMentionHandler => ({ ...inputs, type: "mention" });

export const createBotMessage = (
  inputs: Omit<BotMessageHandler, "type">,
): BotMessageHandler => ({ ...inputs, type: "message" });

export const createBotReaction = (
  inputs: Omit<BotReactionHandler, "type">,
): BotReactionHandler => ({ ...inputs, type: "reaction" });
