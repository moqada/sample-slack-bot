import { createRespondAsBotSlackFunction } from "gbas/mod.ts";

const { def: respondAsBotFunctionDef, func: respondAsBotFunction } =
  createRespondAsBotSlackFunction({
    sourceFile: "functions/respond_as_bot.ts",
  });
export { respondAsBotFunctionDef };
export default respondAsBotFunction;
