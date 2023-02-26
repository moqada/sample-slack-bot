import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { refreshBotConfigDef } from "../functions/refresh_bot_config.ts";

export const botConfigRefreshmentWorkflow = DefineWorkflow({
  callback_id: "bot_config_refreshment_workflow",
  title: "Bot config refreshment workflow",
  input_parameters: {
    properties: {
      channelId: { type: Schema.slack.types.channel_id },
    },
    required: ["channelId"],
  },
  output_parameters: { properties: {}, required: [] },
});

botConfigRefreshmentWorkflow.addStep(
  refreshBotConfigDef,
  botConfigRefreshmentWorkflow.inputs,
);
