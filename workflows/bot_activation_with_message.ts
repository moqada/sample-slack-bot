import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { activateBotInChannelFunctionDef } from "../functions/activate_bot_in_channel.ts";

export const botActivationWithMessageWorkflow = DefineWorkflow({
  callback_id: "bot_activation_with_message_workflow",
  title: "Bot activation with message workflow",
  input_parameters: {
    properties: {
      channelId: { type: Schema.slack.types.channel_id },
      userId: { type: Schema.slack.types.user_id },
    },
    required: ["channelId", "userId"],
  },
  output_parameters: { properties: {}, required: [] },
});

botActivationWithMessageWorkflow.addStep(
  activateBotInChannelFunctionDef,
  botActivationWithMessageWorkflow.inputs,
);
botActivationWithMessageWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: botActivationWithMessageWorkflow.inputs.channelId,
  message: "Bot Activation is completed :white_check_mark:",
});
