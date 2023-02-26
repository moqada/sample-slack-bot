import { Bot } from "../types.ts";
import { createBotMention } from "../utils.ts";

const createDescription = (
  handlers: Array<Bot["reactions" | "messages" | "mentions"][number]>,
  keyword?: string,
) => {
  let commands = [...handlers].sort((a, b) => a.name.localeCompare(b.name));
  if (keyword) {
    commands = commands.filter((command) => {
      return command.name.search(keyword) >= 0 ||
        command.help.some((text) => text.search(keyword) >= 0);
    });
  }
  if (commands.length === 0) {
    return "";
  }
  const description = commands.map(({ help, ...params }) => {
    return `${
      "emojis" in params
        ? params.emojis.map((e) => `:${e}:`).join(", ")
        : params.pattern
    }
    ${help.join("\n    ")}`;
  }).join("\n");
  return `\`\`\`
${description}
\`\`\``;
};

export const help = createBotMention({
  name: "help",
  help: [
    "help - ヘルプを表示する",
    "help <keyword> - 特定キーワードのヘルプを表示する",
  ],
  pattern: /^help(\s+(.+))?/,
  func: ({ bot, message }) => {
    const keyword = message.match[2];
    const descriptions: Array<{ label: string; body: string }> = [
      { label: "MENTION", body: createDescription(bot.mentions, keyword) },
      { label: "MESSAGE", body: createDescription(bot.messages, keyword) },
      { label: "REACTION", body: createDescription(bot.reactions, keyword) },
    ].filter((desc) => desc.body);
    if (descriptions.length === 0) {
      return {
        type: "message",
        text: `"${keyword}" に該当するコマンドがないよ`,
      };
    }
    return {
      type: "message",
      text: descriptions.map((desc) => {
        return `*${desc.label}*\n${desc.body}`;
      }).join("\n"),
    };
  },
});
