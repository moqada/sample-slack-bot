import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { deactivateBotInChannelFunctionDef } from "../functions/deactivate_bot_in_channel.ts";

export const botDeactivationInChannelWorkflow = DefineWorkflow({
  callback_id: "bot_deactivation_in_channel_workflow",
  title: "Bot deactivation in a channel workflow",
  input_parameters: {
    properties: {
      channelId: { type: Schema.slack.types.channel_id },
      userId: { type: Schema.slack.types.user_id },
      // for debug
      data: { type: Schema.types.object },
    },
    required: ["channelId", "userId"],
  },
  output_parameters: { properties: {}, required: [] },
});

botDeactivationInChannelWorkflow.addStep(
  deactivateBotInChannelFunctionDef,
  botDeactivationInChannelWorkflow.inputs,
);
