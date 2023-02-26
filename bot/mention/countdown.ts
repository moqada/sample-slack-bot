import { createBotMention } from "../utils.ts";

export const countdown = createBotMention({
  func: async ({ message, respond }) => {
    const num = Number.parseInt(message.match[1]);
    if (isNaN(num) || num < 1) {
      return { type: "message", text: "1秒以上を指定してや" };
    }
    await new Promise((resolve) => {
      const timer = (sec: number) => {
        respond({ type: "message", text: `${sec}` });
        setTimeout(() => {
          const next = sec - 1;
          if (next > 0) {
            timer(next);
          } else {
            resolve(0);
          }
        }, 1000);
      };
      timer(num);
    });
    return { type: "message", text: "finish!" };
  },
  help: ["countdown <seconds> - 指定の時間をカウントダウンします"],
  name: "countdown",
  pattern: /^countdown\s+(\d+)$/,
});
