import { Manifest } from "deno-slack-sdk/mod.ts";
import { botActivationInChannelWorkflow } from "./workflows/bot_activation_in_channel.ts";
import { botActivationWithMessageWorkflow } from "./workflows/bot_activation_with_message.ts";
import { botConfigRefreshmentWorkflow } from "./workflows/bot_config_refreshment.ts";
import { botConfigurationByModalWorkflow } from "./workflows/bot_configuration_by_modal.ts";
import { botDeactivationInChannelWorkflow } from "./workflows/bot_deactivation_in_channel.ts";
import { botMentionWorkflow } from "./workflows/bot_mention.ts";
import { botMessageWorkflow } from "./workflows/bot_message.ts";
import { botReactionWorkflow } from "./workflows/bot_reaction.ts";
import { botScheduledMaintenanceWorkflow } from "./workflows/bot_scheduled_maintenance.ts";
import {
  mentionCommandDispatcher,
  messageCommandDispatcher,
  reactionCommandDispatcher,
} from "./bot/dispatchers.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/future/manifest
 */
export default Manifest({
  name: "sample-slack-bot",
  description: "A Sample Slack Bot",
  icon: "assets/default_new_app_icon.png",
  functions: [],
  workflows: [
    botMentionWorkflow,
    botMessageWorkflow,
    botReactionWorkflow,
    botScheduledMaintenanceWorkflow,
    botConfigurationByModalWorkflow,
    botConfigRefreshmentWorkflow,
    botActivationInChannelWorkflow,
    botActivationWithMessageWorkflow,
    botDeactivationInChannelWorkflow,
  ],
  outgoingDomains: [
    ...new Set([
      ...mentionCommandDispatcher.outgoingDomains,
      ...messageCommandDispatcher.outgoingDomains,
      ...reactionCommandDispatcher.outgoingDomains,
    ]),
  ],
  botScopes: [
    "app_mentions:read",
    "channels:history",
    "channels:join",
    "channels:read",
    "chat:write",
    "chat:write.customize",
    "chat:write.public",
    "commands",
    "reactions:read",
    "reactions:write",
    "triggers:read",
    "triggers:write",
  ],
});
