import { createMentionCommand } from "gbas/mod.ts";

export const countdown = createMentionCommand({
  execute: async (c) => {
    const num = Number.parseInt(c.match[1]);
    if (isNaN(num) || num < 1) {
      return c.res.message("1秒以上を指定してや");
    }
    await new Promise((resolve) => {
      const timer = (sec: number) => {
        c.interrupt.postMessage(`${sec}`);
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
    return c.res.message("finish!");
  },
  examples: ["countdown <seconds> - 指定の時間をカウントダウンします"],
  name: "countdown",
  pattern: /^countdown\s+(\d+)$/,
});
