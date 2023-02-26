import {
  DefineFunction,
  DefineType,
  Schema,
  SlackFunction,
} from "deno-slack-sdk/mod.ts";

export const BotResponseType = DefineType({
  name: "BotResponseType",
  type: Schema.types.string,
  enum: ["none", "message", "reaction"] as const,
});

export const respondAsBotFunctionDef = DefineFunction({
  callback_id: "respond_as_bot",
  title: "Respond as the bot",
  description: "Respond as the bot",
  source_file: "functions/respond_as_bot.ts",
  input_parameters: {
    properties: {
      type: { type: BotResponseType },
      messageTs: { type: Schema.types.string },
      threadTs: { type: Schema.types.string },
      channelId: { type: Schema.slack.types.channel_id },
      text: { type: Schema.types.string },
      mentionUserId: { type: Schema.types.string },
      emoji: { type: Schema.types.string },
    },
    required: ["type"],
  },
});

export default SlackFunction(
  respondAsBotFunctionDef,
  async ({ client, inputs }) => {
    switch (inputs.type) {
      case "none":
        // do nothing
        break;
      case "message": {
        if (!inputs.channelId || !inputs.text) {
          throw new Error("channel_id is required");
        }
        await client.chat.postMessage({
          channel: inputs.channelId,
          text: inputs.mentionUserId
            ? `<@${inputs.mentionUserId}> ${inputs.text}`
            : inputs.text,
          ...(inputs.threadTs ? { thread_ts: inputs.threadTs } : {}),
        });
        break;
      }
      case "reaction": {
        await client.reactions.add({
          channel: inputs.channelId,
          name: inputs.emoji,
          timestamp: inputs.messageTs,
        });
        break;
      }
      default:
        throw new Error(`{inputs.type} is not supported type`);
    }
    return { outputs: {} };
  },
);
