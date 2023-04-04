import { createMentionCommandTester } from "gbas/mod.ts";
import { assertSpyCall, assertSpyCalls, spy } from "std/testing/mock.ts";
import { assert, assertEquals } from "std/testing/asserts.ts";
import { countdown } from "./countdown.ts";
import { mentionCommandDispatcher } from "../dispatchers.ts";

const { createContext } = createMentionCommandTester(countdown);

Deno.test("countdown 3 secs", async () => {
  const ctx = createContext("<@BOT> countdown 3");
  const spyPostMessage = spy(ctx.interrupt, "postMessage");
  const res = await mentionCommandDispatcher.dispatch(ctx);
  assert(res.type === "message", res.type);
  assertEquals(res.text, "finish!");
  assertSpyCalls(spyPostMessage, 3);
  assertSpyCall(spyPostMessage, 0, { args: ["3"] });
  assertSpyCall(spyPostMessage, 1, { args: ["2"] });
  assertSpyCall(spyPostMessage, 2, { args: ["1"] });
});

Deno.test("countdown 0 sec", async () => {
  const ctx = createContext("<@BOT> countdown 0");
  const spyPostMessage = spy(ctx.interrupt, "postMessage");
  const res = await mentionCommandDispatcher.dispatch(ctx);
  assert(res.type === "message", res.type);
  assertEquals(res.text, "1秒以上を指定してや");
  assertSpyCalls(spyPostMessage, 0);
});
