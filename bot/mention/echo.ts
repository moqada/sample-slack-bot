import { createMentionCommand } from "gbas/mod.ts";

export const echo = createMentionCommand({
  name: "echo",
  examples: ["echo <message> - 指定のメッセージを返します"],
  pattern: /^echo ([\s\S]*)/i,
  execute: (c) => {
    return c.res.message(c.match[1]);
  },
});
