import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { handleMessageToBotFunctionDef } from "../functions/handle_message_to_bot.ts";
import { respondAsBotFunctionDef } from "../functions/respond_as_bot.ts";

export const botMessageWorkflow = DefineWorkflow({
  callback_id: "bot_message_workflow",
  title: "Bot message workflow",
  input_parameters: {
    properties: {
      channelId: { type: Schema.slack.types.channel_id },
      channelType: { type: Schema.types.string },
      userId: { type: Schema.slack.types.user_id },
      message: { type: Schema.types.string },
      messageTs: { type: Schema.types.string },
      threadTs: { type: Schema.types.string },
      // for debug & workaround
      data: { type: Schema.types.object },
    },
    required: ["channelId", "channelType", "userId", "message", "messageTs"],
  },
});

const messageStep = botMessageWorkflow.addStep(
  handleMessageToBotFunctionDef,
  { ...botMessageWorkflow.inputs, isQuickResponseEnabled: true },
);
botMessageWorkflow.addStep(respondAsBotFunctionDef, messageStep.outputs);
