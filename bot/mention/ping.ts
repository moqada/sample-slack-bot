import { createBotMention } from "../utils.ts";

export const ping = createBotMention({
  name: "ping",
  help: ["ping - PONGを返します"],
  pattern: /^ping$/i,
  func: ({ message }) => {
    return { type: "message", text: "PONG", mentionUserId: message.userId };
  },
});
