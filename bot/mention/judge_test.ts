import { assert, assertMatch } from "std/testing/asserts.ts";
import { createBotTester } from "../tester.ts";
import { judge } from "./judge.ts";

const { createContext } = createBotTester(judge);

Deno.test("respond with emoji as the judge", async () => {
  const ctx = createContext("judge 今日はおやつを食べてよい?");
  const res = await judge.func(ctx);
  assert(res.type === "reaction");
  assertMatch(res.emoji, /^(ok|no_good)$/);
});
