import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import {
  getJoinedPublicNoSharedChannels,
  setupEventTriggers,
} from "../lib/slack_api.ts";
import botMentionTrigger from "../triggers/bot_mention.ts";
import botMessageTrigger from "../triggers/bot_message.ts";
import botReactionTrigger from "../triggers/bot_reaction.ts";

const TARGET_TRIGGERS = [
  botMentionTrigger,
  botMessageTrigger,
  botReactionTrigger,
];

export const deactivateBotInChannelFunctionDef = DefineFunction({
  callback_id: "deactivate_bot_in_channel",
  title: "Deactivate triggers for the bot in a channel",
  source_file: "functions/deactivate_bot_in_channel.ts",
  input_parameters: {
    properties: {
      channelId: { type: Schema.slack.types.channel_id },
      userId: { type: Schema.slack.types.user_id },
    },
    required: ["channelId", "userId"],
  },
  output_parameters: { properties: {}, required: [] },
});

export default SlackFunction(
  deactivateBotInChannelFunctionDef,
  async ({ inputs, client }) => {
    const resTest = await client.auth.test();
    if (!resTest.ok) {
      return {
        error: `client.auth.test failed: ${resTest?.error || "unknown"}`,
      };
    }
    if (resTest.user_id !== inputs.userId) {
      return { outputs: {} };
    }
    const botJoinedChannelIds =
      (await getJoinedPublicNoSharedChannels({ client })).map((c) => c.id);
    const channelIds = botJoinedChannelIds.filter((id) =>
      id !== inputs.channelId
    );
    await setupEventTriggers({
      channelIds,
      client,
      triggers: TARGET_TRIGGERS,
    });
    return { outputs: {} };
  },
);
