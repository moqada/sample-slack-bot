import { createMentionCommandSlackWorkflow } from "gbas/mod.ts";
import { handleMentionToBotFunctionDef } from "../functions/handle_mention_to_bot.ts";
import { respondAsBotFunctionDef } from "../functions/respond_as_bot.ts";

export const botMentionWorkflow = createMentionCommandSlackWorkflow({
  mentionCommandFuncDef: handleMentionToBotFunctionDef,
  respondAsBotFuncDef: respondAsBotFunctionDef,
  isQuickResponseEnabled: true,
});
