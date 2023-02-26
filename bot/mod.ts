import { Bot, BotResponse } from "./types.ts";
import * as mentions from "./mention/mod.ts";
import * as messages from "./message/mod.ts";
import * as reactions from "./reaction/mod.ts";
import { SlackAPIClient } from "deno-slack-sdk/types.ts";

export const bot: Bot = {
  mentions: Object.values(mentions),
  messages: Object.values(messages),
  reactions: Object.values(reactions),
};

export const createRespond = (
  { channelId, threadTs, client }: {
    channelId: string;
    client: SlackAPIClient;
    threadTs?: string;
  },
) => {
  return async (inputs: Exclude<BotResponse, { type: "none" }>) => {
    switch (inputs.type) {
      case "message": {
        await client.chat.postMessage({
          channel: channelId,
          text: inputs.mentionUserId
            ? `<@${inputs.mentionUserId}> ${inputs.text}`
            : inputs.text,
          ...(threadTs ? { thread_ts: threadTs } : {}),
        });
        break;
      }
      case "reaction": {
        await client.reactions.add({
          channel: channelId,
          name: inputs.emoji,
          timestamp: inputs.messageTs,
        });
        break;
      }
      default:
        throw new Error(`{inputs.type} is not supported type`);
    }
  };
};
