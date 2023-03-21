import { createMessageCommandSlackWorkflow } from "gbas/mod.ts";
import { handleMessageToBotFunctionDef } from "../functions/handle_message_to_bot.ts";
import { respondAsBotFunctionDef } from "../functions/respond_as_bot.ts";

export const botMessageWorkflow = createMessageCommandSlackWorkflow({
  messageCommandFuncDef: handleMessageToBotFunctionDef,
  respondAsBotFuncDef: respondAsBotFunctionDef,
  isQuickResponseEnabled: true,
});
