import { Trigger } from "deno-slack-api/types.ts";
import { botActivationWithMessageWorkflow } from "../workflows/bot_activation_with_message.ts";

const activateBotTrigger: Trigger<
  typeof botActivationWithMessageWorkflow.definition
> = {
  type: "shortcut",
  name: "Activate the Bot",
  description: "activate the bot triggers for a channel by the modal",
  workflow:
    `#/workflows/${botActivationWithMessageWorkflow.definition.callback_id}`,
  inputs: {
    channelId: { value: "{{data.channel_id}}" },
    userId: { value: "{{data.user_id}}" },
  },
};
export default activateBotTrigger;
