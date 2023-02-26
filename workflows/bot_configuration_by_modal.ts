import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { configureBotByModalFunctionDef } from "../functions/configure_bot_by_modal.ts";

export const botConfigurationByModalWorkflow = DefineWorkflow({
  callback_id: "bot_configuration_by_modal_workflow",
  title: "Bot configuration by modal workflow",
  input_parameters: {
    properties: { interactivity: { type: Schema.slack.types.interactivity } },
    required: ["interactivity"],
  },
});

botConfigurationByModalWorkflow.addStep(configureBotByModalFunctionDef, {
  interactivity: botConfigurationByModalWorkflow.inputs.interactivity,
});
