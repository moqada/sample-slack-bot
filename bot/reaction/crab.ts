import { createReactionCommand } from "gbas/mod.ts";

export const crab = createReactionCommand({
  name: "crab",
  examples: [":crab: - たしかに"],
  emojis: ["crab"],
  execute: (c) => {
    if (c.event.emoji === "crab") {
      return c.res.message("たし:crab:", { mentionUserIds: [c.event.userId] });
    }
    return c.res.none();
  },
});
