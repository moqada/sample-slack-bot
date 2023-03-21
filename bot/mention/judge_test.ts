import { createMentionCommandTester } from "gbas/mod.ts";
import { assert, assertMatch } from "std/testing/asserts.ts";
import { mentionCommandDispatcher } from "../dispatchers.ts";
import { judge } from "./judge.ts";

const { createContext } = createMentionCommandTester(judge);

Deno.test("respond with emoji as the judge", async () => {
  const res = await mentionCommandDispatcher.dispatch(
    createContext("<@BOT> judge 今日はおやつを食べてよい?"),
  );
  assert(res.type === "reaction");
  assertMatch(res.emoji, /^(ok|no_good)$/);
});
