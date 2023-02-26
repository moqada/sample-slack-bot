import { createBotMessage } from "../utils.ts";

export const hello = createBotMessage({
  name: "hello",
  pattern: /^hello$/i,
  help: ["<hello> - helloにhelloをメンションする"],
  func: ({ message }) => {
    return { type: "message", text: "hello", mentionUserId: message.userId };
  },
});
