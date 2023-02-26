import { assertEquals } from "std/testing/asserts.ts";
import { createBotTester } from "../tester.ts";
import { echo } from "./echo.ts";

const { createContext } = createBotTester(echo);

Deno.test("echo received text", () => {
  const context = createContext("echo foo bar buz");
  const res = echo.func(context);
  assertEquals(res, { type: "message", text: "foo bar buz" });
});
