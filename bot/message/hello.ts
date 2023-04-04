import { createMessageCommand } from "gbas/mod.ts";

export const hello = createMessageCommand({
  name: "hello",
  pattern: /^hello$/i,
  examples: ["<hello> - helloにhelloをメンションする"],
  execute: (c) => {
    return c.res.message("hello", { mentionUserIds: [c.event.userId] });
  },
});
