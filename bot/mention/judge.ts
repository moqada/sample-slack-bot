import { createBotMention } from "../utils.ts";

const REACTIONS = ["ok", "no_good"];

export const judge = createBotMention({
  help: ["judge <判定したいこと> - OK / NG を決める"],
  name: "judge",
  pattern: /^judge\s+.+$/,
  func: ({ message }) => {
    const emoji = REACTIONS[Math.floor(Math.random() * REACTIONS.length)];
    return {
      type: "reaction",
      emoji,
      messageTs: message.messageTs,
    } as const;
  },
});
