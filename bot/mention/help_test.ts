import { createBotTester } from "../tester.ts";
import { assert, assertEquals } from "std/testing/asserts.ts";
import {
  createBotMention,
  createBotMessage,
  createBotReaction,
} from "../utils.ts";
import { help } from "./help.ts";

const { createContext } = createBotTester(help);

const dummyMessage = createBotMessage({
  name: "dummy message",
  help: ["<hello> - hello"],
  pattern: /hello/,
  func: () => {
    return { type: "none" };
  },
});
const dummyMention = createBotMention({
  name: "dummy mention",
  help: ["<dummy> - dummy de yansu", "<dmy> - dmy でもいけるでやんす"],
  pattern: /(dummy|dmy)/,
  func: () => {
    return { type: "none" };
  },
});
const dummyReaction = createBotReaction({
  name: "dummy sushi",
  help: [":sushi: - sushi"],
  emojis: ["sushi"],
  func: () => {
    return { type: "none" };
  },
});

Deno.test("respond help description", async () => {
  const ctx = createContext("help", {
    bot: {
      reactions: [dummyReaction],
      messages: [dummyMessage],
      mentions: [
        help,
        dummyMention,
      ],
    },
  });
  const res = await help.func(ctx);
  const helpMessage = `*MENTION*
\`\`\`
/(dummy|dmy)/
    <dummy> - dummy de yansu
    <dmy> - dmy でもいけるでやんす
/^help(\\s+(.+))?/
    help - ヘルプを表示する
    help <keyword> - 特定キーワードのヘルプを表示する
\`\`\`
*MESSAGE*
\`\`\`
/hello/
    <hello> - hello
\`\`\`
*REACTION*
\`\`\`
:sushi:
    :sushi: - sushi
\`\`\``;
  assert(res.type === "message");
  assertEquals(res.text, helpMessage);
});

Deno.test("respond filtered description", async () => {
  const ctx = createContext("help sushi", {
    bot: {
      reactions: [dummyReaction],
      messages: [dummyMessage],
      mentions: [
        help,
        dummyMention,
      ],
    },
  });
  const res = await help.func(ctx);
  const helpMessage = `*REACTION*
\`\`\`
:sushi:
    :sushi: - sushi
\`\`\``;
  assert(res.type === "message");
  assertEquals(res.text, helpMessage);
});

Deno.test("filtered description did not find", async () => {
  const ctx = createContext("help NANIMONAIYO", {
    bot: {
      reactions: [dummyReaction],
      messages: [dummyMessage],
      mentions: [
        help,
        dummyMention,
      ],
    },
  });
  const res = await help.func(ctx);
  assert(res.type === "message");
  assertEquals(res.text, '"NANIMONAIYO" に該当するコマンドがないよ');
});
