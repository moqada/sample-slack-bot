import { createMentionCommand } from "gbas/mod.ts";

const REACTIONS = ["ok", "no_good"];

export const judge = createMentionCommand({
  examples: ["judge <判定したいこと> - OK / NG を決める"],
  name: "judge",
  pattern: /^judge\s+.+$/,
  execute: (c) => {
    const emoji = REACTIONS[Math.floor(Math.random() * REACTIONS.length)];
    return c.res.reaction(emoji);
  },
});
