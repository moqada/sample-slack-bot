import { createReactionCommandSlackWorkflow } from "gbas/mod.ts";
import { handleReactionToBotFunctionDef } from "../functions/handle_reaction_to_bot.ts";
import { respondAsBotFunctionDef } from "../functions/respond_as_bot.ts";

export const botReactionWorkflow = createReactionCommandSlackWorkflow({
  reactionCommandFuncDef: handleReactionToBotFunctionDef,
  respondAsBotFuncDef: respondAsBotFunctionDef,
  isQuickResponseEnabled: true,
});
