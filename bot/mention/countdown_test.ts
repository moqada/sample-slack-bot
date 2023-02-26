import { assertSpyCall, assertSpyCalls, spy } from "std/testing/mock.ts";
import { assertEquals } from "std/testing/asserts.ts";
import { createBotTester } from "../tester.ts";
import { countdown } from "./countdown.ts";

const { createContext } = createBotTester(countdown);
Deno.test("countdown 3 secs", async () => {
  const ctx = createContext("countdown 3");
  const spyRespond = spy(ctx, "respond");
  const res = await countdown.func(ctx);
  assertEquals(res, { type: "message", text: "finish!" });
  assertSpyCalls(spyRespond, 3);
  assertSpyCall(spyRespond, 0, { args: [{ type: "message", text: "3" }] });
  assertSpyCall(spyRespond, 1, { args: [{ type: "message", text: "2" }] });
  assertSpyCall(spyRespond, 2, { args: [{ type: "message", text: "1" }] });
});

Deno.test("countdown 0 sec", async () => {
  const ctx = createContext("countdown 0");
  const spyRespond = spy(ctx, "respond");
  const res = await countdown.func(ctx);
  assertEquals(res, { type: "message", text: "1秒以上を指定してや" });
  assertSpyCalls(spyRespond, 0);
});
