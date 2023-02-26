import { Trigger } from "deno-slack-api/types.ts";
import { botMentionWorkflow } from "../workflows/bot_mention.ts";

const botMentionTrigger: Trigger<
  typeof botMentionWorkflow.definition
> = {
  type: "event",
  name: "Bot mention trigger",
  description: "receive mentions to bot mention handlers",
  event: {
    // set valid channel_ids in runtime
    channel_ids: ["DUMMY_CHANNEL_ID"],
    event_type: "slack#/events/app_mentioned",
  },
  workflow: `#/workflows/${botMentionWorkflow.definition.callback_id}`,
  inputs: {
    channelId: { value: "{{data.channel_id}}" },
    channelType: { value: "{{data.channel_type}}" },
    message: { value: "{{data.text}}" },
    messageTs: { value: "{{data.message_ts}}" },
    // スレッド内のメンションにも data.message_ts のみしか連携されない
    // threadTs: { value: "{{data.thread_ts}}" },
    userId: { value: "{{data.user_id}}" },
    // for debug
    data: { value: "{{data}}" },
  },
};
export default botMentionTrigger;
