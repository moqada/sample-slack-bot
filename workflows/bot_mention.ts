import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { handleMentionToBotFunctionDef } from "../functions/handle_mention_to_bot.ts";
import { respondAsBotFunctionDef } from "../functions/respond_as_bot.ts";

export const botMentionWorkflow = DefineWorkflow({
  callback_id: "bot_mention_workflow",
  title: "Bot mention workflow",
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

const mentionStep = botMentionWorkflow.addStep(
  handleMentionToBotFunctionDef,
  { ...botMentionWorkflow.inputs, isQuickResponseEnabled: true },
);
botMentionWorkflow.addStep(respondAsBotFunctionDef, mentionStep.outputs);
