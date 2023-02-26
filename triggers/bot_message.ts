import { Trigger } from "deno-slack-api/types.ts";
import { botMessageWorkflow } from "../workflows/bot_message.ts";

const botMessageTrigger: Trigger<
  typeof botMessageWorkflow.definition
> = {
  type: "event",
  name: "Bot message trigger",
  description: "receive messages to bot message handlers",
  event: {
    // set valid channel_ids in runtime
    channel_ids: ["DUMMY_CHANNEL_ID"],
    event_type: "slack#/events/message_posted",
    // workaround for listening to all messages (filter property is required, but it wants to pass through all).
    filter: {
      version: 1,
      root: { statement: "1 == 1" },
    },
  },
  workflow: `#/workflows/${botMessageWorkflow.definition.callback_id}`,
  inputs: {
    channelId: { value: "{{data.channel_id}}" },
    channelType: { value: "{{data.channel_type}}" },
    message: { value: "{{data.text}}" },
    messageTs: { value: "{{data.message_ts}}" },
    threadTs: { value: "{{data.thread_ts}}" },
    userId: { value: "{{data.user_id}}" },
    // for debug
    data: { value: "{{data}}" },
  },
};
export default botMessageTrigger;
