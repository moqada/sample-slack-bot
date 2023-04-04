import { createReactionCommandSlackFunction } from "gbas/mod.ts";
import { reactionCommandDispatcher } from "../bot/dispatchers.ts";

const {
  def: handleReactionToBotFunctionDef,
  func: handleReactionToBotFunction,
} = createReactionCommandSlackFunction({
  dispatcher: reactionCommandDispatcher,
  sourceFile: "functions/handle_reaction_to_bot.ts",
});
export { handleReactionToBotFunctionDef };
export default handleReactionToBotFunction;
