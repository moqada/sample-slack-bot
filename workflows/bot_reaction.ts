import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { handleReactionToBotFunctionDef } from "../functions/handle_reaction_to_bot.ts";
import { respondAsBotFunctionDef } from "../functions/respond_as_bot.ts";

export const botReactionWorkflow = DefineWorkflow({
  callback_id: "bot_reaction_workflow",
  title: "Bot reaction workflow",
  input_parameters: {
    properties: {
      channelId: { type: Schema.slack.types.channel_id },
      userId: { type: Schema.slack.types.user_id },
      reaction: { type: Schema.types.string },
      messageTs: { type: Schema.types.string },
      threadTs: { type: Schema.types.string },
      // for debug & workaround
      data: { type: Schema.types.object },
    },
    required: ["channelId", "userId", "reaction", "messageTs"],
  },
});

const reactionStep = botReactionWorkflow.addStep(
  handleReactionToBotFunctionDef,
  { ...botReactionWorkflow.inputs, isQuickResponseEnabled: true },
);
botReactionWorkflow.addStep(
  respondAsBotFunctionDef,
  reactionStep.outputs,
);
