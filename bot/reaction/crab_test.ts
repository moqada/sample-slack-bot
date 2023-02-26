import { assertEquals } from "std/testing/asserts.ts";
import { createBotTester } from "../tester.ts";
import { crab } from "./crab.ts";

const { createContext } = createBotTester(crab);

Deno.test("responds to :crab:", async () => {
  const resAnyEmoji = await crab.func(createContext("any_emoji"));
  assertEquals(resAnyEmoji, { type: "none" });
  const resCrab = await crab.func(createContext("crab"));
  assertEquals(resCrab, {
    mentionUserId: "DUMMY_USER_ID",
    text: "たし:crab:",
    type: "message",
  });
});
