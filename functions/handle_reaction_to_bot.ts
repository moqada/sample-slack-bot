import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { bot, createRespond } from "../bot/mod.ts";
import { BotReactionHandler } from "../bot/types.ts";
import { getThreadTs } from "../lib/slack_api.ts";
import { BotResponseType } from "./respond_as_bot.ts";

export const handleReactionToBotFunctionDef = DefineFunction({
  callback_id: "handle_reaction_to_bot",
  title: "Handle a reaction to the bot",
  source_file: "functions/handle_reaction_to_bot.ts",
  description: "Handle a reaction to the bot",
  input_parameters: {
    properties: {
      channelId: { type: Schema.slack.types.channel_id },
      userId: { type: Schema.slack.types.user_id },
      reaction: { type: Schema.types.string },
      messageTs: { type: Schema.types.string },
      threadTs: { type: Schema.types.string },
      // for debug and workaround
      data: { type: Schema.types.object },
      isQuickResponseEnabled: { type: Schema.types.boolean },
    },
    required: ["channelId", "userId", "reaction", "messageTs"],
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
  handleReactionToBotFunctionDef,
  async ({ client, env, inputs }) => {
    const resTest = await client.auth.test();
    if (!resTest.ok) {
      throw new Error("failed to client.api.test()", { cause: resTest.error });
    }
    if (resTest.user_id === inputs.userId) {
      return { outputs: { type: "none" } };
    }
    const handler: BotReactionHandler | undefined = bot.reactions.find((h) =>
      h.emojis.includes(inputs.reaction)
    );
    if (!handler) {
      return { outputs: { type: "none" } };
    }
    const threadTs = inputs.threadTs ||
      await getThreadTs({
        client,
        channelId: inputs.channelId,
        messageTs: inputs.messageTs,
      });
    const respond = createRespond({
      client,
      channelId: inputs.channelId,
      threadTs: inputs.threadTs,
    });
    const res = await handler.func({
      bot,
      env,
      reaction: {
        channelId: inputs.channelId,
        emoji: inputs.reaction,
        userId: inputs.userId,
        messageTs: inputs.messageTs,
        threadTs,
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
        threadTs,
        ...res,
      },
    };
  },
);
