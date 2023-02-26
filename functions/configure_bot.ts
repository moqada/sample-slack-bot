import { DefineFunction, SlackFunction } from "deno-slack-sdk/mod.ts";
import {
  getAllPublicNoSharedChannels,
  getJoinedPublicNoSharedChannels,
} from "../lib/slack_api.ts";
import {
  setupActiveChannelTriggers,
  setupAllChannelTriggers,
  setupWorkspaceTriggers,
} from "./internals/bot_configuration.ts";

export const configureBotFunctionDef = DefineFunction({
  callback_id: "configure_bot",
  title: "Configure triggers for the bot",
  source_file: "functions/configure_bot.ts",
  input_parameters: {
    properties: {},
    required: [],
  },
  output_parameters: { properties: {}, required: [] },
});

export default SlackFunction(
  configureBotFunctionDef,
  async ({ client }) => {
    const botJoinedChannelIds =
      (await getJoinedPublicNoSharedChannels({ client })).map((c) => c.id);
    await setupActiveChannelTriggers({
      channelIds: botJoinedChannelIds,
      client,
    });
    const allChannelIds = (await getAllPublicNoSharedChannels({ client })).map(
      (c) => c.id,
    );
    await setupAllChannelTriggers({ channelIds: allChannelIds, client });
    await setupWorkspaceTriggers({ client });
    return { outputs: {} };
  },
);
