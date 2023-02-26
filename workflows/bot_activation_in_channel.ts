import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { activateBotInChannelFunctionDef } from "../functions/activate_bot_in_channel.ts";

export const botActivationInChannelWorkflow = DefineWorkflow({
  callback_id: "bot_activation_in_channel_workflow",
  title: "Bot activation in a channel workflow",
  input_parameters: {
    properties: {
      channelId: { type: Schema.slack.types.channel_id },
      inviterId: { type: Schema.slack.types.user_id },
      userId: { type: Schema.slack.types.user_id },
      // for debug
      data: { type: Schema.types.object },
    },
    required: ["channelId", "inviterId", "userId"],
  },
  output_parameters: { properties: {}, required: [] },
});

botActivationInChannelWorkflow.addStep(
  activateBotInChannelFunctionDef,
  { ...botActivationInChannelWorkflow.inputs, isTriggeredByBotOnly: true },
);
