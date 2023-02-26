import { Trigger } from "deno-slack-api/types.ts";
import { botDeactivationInChannelWorkflow } from "../workflows/bot_deactivation_in_channel.ts";

const botDeactivationInChannelTrigger: Trigger<
  typeof botDeactivationInChannelWorkflow.definition
> = {
  type: "event",
  name: "Bot deactivation in a channel trigger",
  description: "deactivate a bot when left a channel",
  event: {
    // set valid channel_ids in runtime
    channel_ids: ["DUMMY_CHANNEL_ID"],
    event_type: "slack#/events/user_left_channel",
  },
  workflow:
    `#/workflows/${botDeactivationInChannelWorkflow.definition.callback_id}`,
  inputs: {
    channelId: { value: "{{data.channel_id}}" },
    userId: { value: "{{data.user_id}}" },
    // for debug
    data: { value: "{{data}}" },
  },
};
export default botDeactivationInChannelTrigger;
