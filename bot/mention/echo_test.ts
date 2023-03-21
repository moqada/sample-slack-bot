import { createMentionCommandTester } from "gbas/mod.ts";
import { assert, assertEquals } from "std/testing/asserts.ts";
import { mentionCommandDispatcher } from "../dispatchers.ts";
import { echo } from "./echo.ts";

const { createContext } = createMentionCommandTester(echo);

Deno.test("echo received text", async () => {
  const context = createContext("<@BOT> echo foo bar baz");
  const res = await mentionCommandDispatcher.dispatch(context);
  assert(res.type === "message", res.type);
  assertEquals(res.text, "foo bar baz");
});
