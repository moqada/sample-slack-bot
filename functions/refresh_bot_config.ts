import { DefineFunction, SlackFunction } from "deno-slack-sdk/mod.ts";
import {
  getAllPublicNoSharedChannels,
  setupEventTriggers,
} from "../lib/slack_api.ts";
import botActivationInChannelTrigger from "../triggers/bot_activation_in_channel.ts";

export const refreshBotConfigDef = DefineFunction({
  callback_id: "refresh_bot_config",
  title: "Refresh bot config",
  source_file: "functions/refresh_bot_config.ts",
  input_parameters: {
    properties: {},
    required: [],
  },
  output_parameters: { properties: {}, required: [] },
});

export default SlackFunction(
  refreshBotConfigDef,
  async ({ client }) => {
    const channelIds = (await getAllPublicNoSharedChannels({ client })).map(
      (c) => c.id,
    );
    await setupEventTriggers({
      channelIds,
      client,
      triggers: [botActivationInChannelTrigger],
    });
    return { outputs: {} };
  },
);
