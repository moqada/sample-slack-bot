import { SlackAPIClient } from "deno-slack-sdk/types.ts";
import botMentionTrigger from "../../triggers/bot_mention.ts";
import botMessageTrigger from "../../triggers/bot_message.ts";
import botReactionTrigger from "../../triggers/bot_reaction.ts";
import botActivationInChannelTrigger from "../../triggers/bot_activation_in_channel.ts";
import botDeactivationInChannelTrigger from "../../triggers/bot_deactivation_in_channel.ts";
import botConfigRefreshmentTrigger from "../../triggers/bot_config_refreshment.ts";
import { setupEventTriggers } from "../../lib/slack_api.ts";

export const setupActiveChannelTriggers = async (
  { channelIds, client }: { channelIds: string[]; client: SlackAPIClient },
) => {
  await setupEventTriggers({
    channelIds,
    client,
    triggers: [
      botMentionTrigger,
      botMessageTrigger,
      botReactionTrigger,
      botDeactivationInChannelTrigger,
    ],
  });
};

export const setupAllChannelTriggers = async (
  { channelIds, client }: { channelIds: string[]; client: SlackAPIClient },
) => {
  await setupEventTriggers({
    channelIds,
    client,
    triggers: [botActivationInChannelTrigger],
  });
};

export const setupWorkspaceTriggers = async (
  { client }: { client: SlackAPIClient },
) => {
  await setupEventTriggers({
    client,
    triggers: [botConfigRefreshmentTrigger],
  });
};
