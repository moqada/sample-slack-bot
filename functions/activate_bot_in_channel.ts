import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import {
  getJoinedPublicNoSharedChannels,
  setupEventTriggers,
} from "../lib/slack_api.ts";
import botDeactivationInChannelTrigger from "../triggers/bot_deactivation_in_channel.ts";
import botMentionTrigger from "../triggers/bot_mention.ts";
import botMessageTrigger from "../triggers/bot_message.ts";
import botReactionTrigger from "../triggers/bot_reaction.ts";

const TARGET_TRIGGERS = [
  botMentionTrigger,
  botMessageTrigger,
  botReactionTrigger,
  botDeactivationInChannelTrigger,
];

export const activateBotInChannelFunctionDef = DefineFunction({
  callback_id: "activate_bot_in_channel",
  title: "Activate triggers for the bot in a channel",
  source_file: "functions/activate_bot_in_channel.ts",
  input_parameters: {
    properties: {
      channelId: { type: Schema.slack.types.channel_id },
      userId: { type: Schema.slack.types.user_id },
      // Workaround: Remove this if user_id filter becomes available on trigger
      isTriggeredByBotOnly: { type: Schema.types.boolean },
    },
    required: ["channelId", "userId"],
  },
  output_parameters: { properties: {}, required: [] },
});

export default SlackFunction(
  activateBotInChannelFunctionDef,
  async ({ inputs, client }) => {
    // Workaround: Remove this if user_id filter becomes available on trigger
    if (inputs.isTriggeredByBotOnly) {
      const resTest = await client.auth.test();
      if (!resTest.ok) {
        return {
          error: `client.auth.test failed: ${
            resTest.error?.toString() || "unknown"
          }`,
        };
      }
      if (resTest.user_id !== inputs.userId) {
        return { outputs: {} };
      }
    }
    const botJoinedChannelIds =
      (await getJoinedPublicNoSharedChannels({ client }))
        .map((c) => c.id);
    const channelIds = [...new Set([...botJoinedChannelIds, inputs.channelId])];
    await setupEventTriggers({
      channelIds,
      client,
      triggers: TARGET_TRIGGERS,
    });
    return { outputs: {} };
  },
);
