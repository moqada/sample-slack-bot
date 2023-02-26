import { Trigger } from "deno-slack-api/types.ts";
import { botConfigurationByModalWorkflow } from "../workflows/bot_configuration_by_modal.ts";

const configureBotTrigger: Trigger<
  typeof botConfigurationByModalWorkflow.definition
> = {
  type: "shortcut",
  name: "Configure the Bot",
  description: "configure the bot triggers by the modal",
  workflow:
    `#/workflows/${botConfigurationByModalWorkflow.definition.callback_id}`,
  inputs: {
    interactivity: { value: "{{data.interactivity}}" },
  },
};
export default configureBotTrigger;
