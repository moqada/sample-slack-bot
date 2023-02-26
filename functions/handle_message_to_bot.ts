import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { bot, createRespond } from "../bot/mod.ts";
import { ChannelType } from "../bot/types.ts";
import { BotResponseType } from "./respond_as_bot.ts";

export const handleMessageToBotFunctionDef = DefineFunction({
  callback_id: "handle_message_to_bot",
  title: "Handle a message to the bot",
  source_file: "functions/handle_message_to_bot.ts",
  description: "Handle a message to the bot",
  input_parameters: {
    properties: {
      channelId: { type: Schema.slack.types.channel_id },
      channelType: { type: Schema.types.string },
      userId: { type: Schema.slack.types.user_id },
      message: { type: Schema.types.string },
      messageTs: { type: Schema.types.string },
      threadTs: { type: Schema.types.string },
      // for debug and workaround
      data: { type: Schema.types.object },
      isQuickResponseEnabled: { type: Schema.types.boolean },
    },
    required: ["channelId", "channelType", "userId", "message", "messageTs"],
  },
  output_parameters: {
    properties: {
      type: { type: BotResponseType },
      channelId: { type: Schema.slack.types.channel_id },
      text: { type: Schema.types.string },
      mentionUserId: { type: Schema.types.string },
      emoji: { type: Schema.types.string },
      threadTs: { type: Schema.types.string },
    },
    required: ["type"],
  },
});

export default SlackFunction(
  handleMessageToBotFunctionDef,
  async ({ client, env, inputs }) => {
    const resTest = await client.auth.test();
    if (!resTest.ok) {
      throw new Error("client.api.test failed", { cause: resTest.error });
    }
    if (resTest.user_id === inputs.userId) {
      return { outputs: { type: "none" } };
    }
    const handler = bot.messages.find((h) => h.pattern.test(inputs.message));
    if (!handler) {
      return { outputs: { type: "none" } };
    }
    const match = handler.pattern.exec(inputs.message);
    if (!match) {
      return { outputs: { type: "none" } };
    }
    const respond = createRespond({
      client,
      channelId: inputs.channelId,
      threadTs: inputs.threadTs,
    });
    const res = await handler.func({
      bot,
      env,
      message: {
        match,
        channelId: inputs.channelId,
        channelType: inputs.channelType as ChannelType,
        userId: inputs.userId,
        messageTs: inputs.messageTs,
        threadTs: inputs.threadTs,
      },
      respond,
    });
    if (inputs.isQuickResponseEnabled && res.type !== "none") {
      await respond(res);
      return { outputs: { type: "none" } };
    }
    return {
      outputs: {
        channelId: inputs.channelId,
        threadTs: inputs.threadTs,
        ...res,
      },
    };
  },
);
