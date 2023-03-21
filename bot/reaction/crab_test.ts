import { createReactionCommandTester } from "gbas/mod.ts";
import { assert, assertEquals } from "std/testing/asserts.ts";
import { reactionCommandDispatcher } from "../dispatchers.ts";
import { crab } from "./crab.ts";

const { createContext } = createReactionCommandTester(crab);

Deno.test("responds to :crab:", async () => {
  const resAnyEmoji = await reactionCommandDispatcher.dispatch(
    createContext("any_emoji"),
  );
  assert(resAnyEmoji.type === "none", resAnyEmoji.type);
  const resCrab = await reactionCommandDispatcher.dispatch(
    createContext("crab"),
  );
  assert(resCrab.type === "message", resCrab.type);
  assertEquals(resCrab.text, "<@USER> たし:crab:");
});
