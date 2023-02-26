import { Trigger } from "deno-slack-api/types.ts";
import { botReactionWorkflow } from "../workflows/bot_reaction.ts";

const botReactionTrigger: Trigger<
  typeof botReactionWorkflow.definition
> = {
  type: "event",
  name: "Bot reaction trigger",
  description: "receive reactions to bot reaction handlers",
  event: {
    // set valid channel_ids in runtime
    channel_ids: ["DUMMY_CHANNEL_ID"],
    event_type: "slack#/events/reaction_added",
  },
  workflow: `#/workflows/${botReactionWorkflow.definition.callback_id}`,
  inputs: {
    channelId: { value: "{{data.channel_id}}" },
    reaction: { value: "{{data.reaction}}" },
    messageTs: { value: "{{data.message_ts}}" },
    threadTs: { value: "{{data.thread_ts}}" },
    userId: { value: "{{data.user_id}}" },
    // for debug
    data: { value: "{{data}}" },
  },
};
export default botReactionTrigger;
