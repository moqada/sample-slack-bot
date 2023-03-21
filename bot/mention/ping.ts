import { createMentionCommand } from "gbas/mod.ts";

export const ping = createMentionCommand({
  name: "ping",
  examples: ["ping - PONGを返します"],
  pattern: /^ping$/i,
  execute: (c) => {
    return c.res.message("PONG", { mentionUserIds: [c.event.userId] });
  },
});
