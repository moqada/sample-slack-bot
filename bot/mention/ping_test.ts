import { assertEquals } from "std/testing/asserts.ts";
import { createBotTester } from "../tester.ts";
import { ping } from "./ping.ts";

const { createContext } = createBotTester(ping);

Deno.test("respond with PONG", () => {
  const ctx = createContext("ping");
  const res = ping.func(ctx);
  assertEquals(res, {
    type: "message",
    text: "PONG",
    mentionUserId: "DUMMY_USER_ID",
  });
});
