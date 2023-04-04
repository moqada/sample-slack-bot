import { createMentionCommandTester } from "gbas/mod.ts";
import { assert, assertEquals } from "std/testing/asserts.ts";
import { mentionCommandDispatcher } from "../dispatchers.ts";
import { ping } from "./ping.ts";

const { createContext } = createMentionCommandTester(ping);

Deno.test("respond with PONG", async () => {
  const res = await mentionCommandDispatcher.dispatch(
    createContext("<@BOT> ping"),
  );
  assert(res.type === "message", res.type);
  assertEquals(res.text, "<@USER> PONG");
});
