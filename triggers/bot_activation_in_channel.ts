import { Trigger } from "deno-slack-api/types.ts";
import { botActivationInChannelWorkflow } from "../workflows/bot_activation_in_channel.ts";

const botActivationInChannelTrigger: Trigger<
  typeof botActivationInChannelWorkflow.definition
> = {
  type: "event",
  name: "Bot activation in a channel trigger",
  description: "activate a bot when joined a channel",
  event: {
    // set valid channel_ids in runtime
    channel_ids: ["DUMMY_CHANNEL_ID"],
    event_type: "slack#/events/user_joined_channel",
  },
  workflow:
    `#/workflows/${botActivationInChannelWorkflow.definition.callback_id}`,
  inputs: {
    channelId: { value: "{{data.channel_id}}" },
    inviterId: { value: "{{data.inviter_id}}" },
    userId: { value: "{{data.user_id}}" },
    // for debug
    data: { value: "{{data}}" },
  },
};
export default botActivationInChannelTrigger;
