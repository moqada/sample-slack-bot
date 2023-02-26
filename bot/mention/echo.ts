import { createBotMention } from "../utils.ts";

export const echo = createBotMention({
  name: "echo",
  help: ["echo <message> - 指定のメッセージを返します"],
  pattern: /^echo ([\s\S]*)/i,
  func: ({ message }) => {
    return { type: "message", text: message.match[1] };
  },
});
