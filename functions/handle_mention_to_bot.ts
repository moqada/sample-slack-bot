import { createMentionCommandSlackFunction } from "gbas/mod.ts";
import { mentionCommandDispatcher } from "../bot/dispatchers.ts";

const { def: handleMentionToBotFunctionDef, func: handleMentionToBotFunction } =
  createMentionCommandSlackFunction({
    dispatcher: mentionCommandDispatcher,
    sourceFile: "functions/handle_mention_to_bot.ts",
    respondOnCommandNotFound: (c) => {
      return c.res.message(
        `\`${c.event.text}\` にマッチするコマンドがないで
    \`@sample-slack-bot help\` を実行してや`,
      );
    },
    respondOnError: (err, c) => {
      return c.res.message(
        `予期しないエラーが発生しました :sob:
\`\`\`
${err}
\`\`\``,
      );
    },
  });
export { handleMentionToBotFunctionDef };
export default handleMentionToBotFunction;
