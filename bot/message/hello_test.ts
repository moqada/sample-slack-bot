import { createMessageCommandTester } from "gbas/mod.ts";
import { assert, assertEquals } from "std/testing/asserts.ts";
import { messageCommandDispatcher } from "../dispatchers.ts";
import { hello } from "./hello.ts";

const { createContext } = createMessageCommandTester(hello);

Deno.test("mention with hello", async () => {
  const ctx = createContext("hello");
  const res = await messageCommandDispatcher.dispatch(ctx);
  assert(res.type === "message", res.type);
  assertEquals(res.text, "<@USER> hello");
});
