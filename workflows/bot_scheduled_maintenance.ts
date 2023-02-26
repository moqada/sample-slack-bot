import { DefineWorkflow } from "deno-slack-sdk/mod.ts";
import { configureBotFunctionDef } from "../functions/configure_bot.ts";

export const botScheduledMaintenanceWorkflow = DefineWorkflow({
  callback_id: "bot_scheduled_maintenance_workflow",
  title: "Bot scheduled maintenance workflow",
  input_parameters: {
    properties: {},
    required: [],
  },
});

botScheduledMaintenanceWorkflow.addStep(configureBotFunctionDef, {});
