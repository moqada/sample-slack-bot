import { createMessageCommandSlackFunction } from "gbas/mod.ts";
import { messageCommandDispatcher } from "../bot/dispatchers.ts";

const { def: handleMessageToBotFunctionDef, func: handleMentionToBotFunction } =
  createMessageCommandSlackFunction({
    dispatcher: messageCommandDispatcher,
    sourceFile: "functions/handle_message_to_bot.ts",
  });
export { handleMessageToBotFunctionDef };
export default handleMentionToBotFunction;
