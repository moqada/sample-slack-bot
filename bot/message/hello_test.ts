import { assertEquals } from "std/testing/asserts.ts";
import { createBotTester } from "../tester.ts";
import { hello } from "./hello.ts";

const { createContext } = createBotTester(hello);

Deno.test("mention with hello", () => {
  const ctx = createContext("hello");
  const res = hello.func(ctx);
  assertEquals(res, {
    type: "message",
    text: "hello",
    mentionUserId: "DUMMY_USER_ID",
  });
});
