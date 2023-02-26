import { Trigger } from "deno-slack-api/types.ts";
import { botConfigRefreshmentWorkflow } from "../workflows/bot_config_refreshment.ts";

const botConfigRefreshmentTrigger: Trigger<
  typeof botConfigRefreshmentWorkflow.definition
> = {
  type: "event",
  name: "Bot config refreshment trigger",
  description: "refresh a bot config trigger for all channels",
  event: {
    event_type: "slack#/events/channel_created",
  },
  workflow:
    `#/workflows/${botConfigRefreshmentWorkflow.definition.callback_id}`,
  inputs: {
    channelId: { value: "{{data.channel_id}}" },
  },
};
export default botConfigRefreshmentTrigger;
