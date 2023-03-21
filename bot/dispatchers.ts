import {
  createHelpMentionCommand,
  MentionCommandDispatcher,
  MessageCommandDispatcher,
  ReactionCommandDispatcher,
} from "gbas/mod.ts";
import * as mentionCommands from "./mention/mod.ts";
import * as messageCommands from "./message/mod.ts";
import * as reactionCommands from "./reaction/mod.ts";

export const mentionCommandDispatcher = new MentionCommandDispatcher(
  Object.values(mentionCommands),
);
export const messageCommandDispatcher = new MessageCommandDispatcher(
  Object.values(messageCommands),
);
export const reactionCommandDispatcher = new ReactionCommandDispatcher(
  Object.values(reactionCommands),
);
mentionCommandDispatcher.register(
  createHelpMentionCommand({
    commands: { mention: mentionCommandDispatcher.commands },
    examples: [
      "help - ヘルプを表示する",
      "help <keyword> - 特定キーワードのヘルプを表示する",
    ],
    respondOnCommandNotFound: (keyword, c) =>
      c.res.message(`"${keyword}" に該当するコマンドがないよ`),
  }),
);
