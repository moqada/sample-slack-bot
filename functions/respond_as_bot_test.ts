import { assertEquals } from "std/testing/asserts.ts";
import { SlackFunctionTester } from "deno-slack-sdk/mod.ts";
import * as mf from "mock_fetch/mod.ts";
import respondAsBotFunction, {
  respondAsBotFunctionDef,
} from "./respond_as_bot.ts";

mf.install();

const setup = () => {
  const chatPostMessageCalls: Record<string, unknown>[] = [];
  const reactionsAddCalls: Record<string, unknown>[] = [];
  mf.mock("POST@/api/chat.postMessage", async (req) => {
    const params: Record<string, unknown> = {};
    const formData = await req.formData();
    for (const [key, val] of formData.entries()) {
      params[key] = val;
    }
    chatPostMessageCalls.push(params);
    return new Response(JSON.stringify({}), { status: 200 });
  });
  mf.mock("POST@/api/reactions.add", async (req) => {
    const params: Record<string, unknown> = {};
    const formData = await req.formData();
    for (const [key, val] of formData.entries()) {
      params[key] = val;
    }
    reactionsAddCalls.push(params);
    return new Response(JSON.stringify({}), { status: 200 });
  });
  return { chatPostMessageCalls, reactionsAddCalls };
};

const { createContext } = SlackFunctionTester(respondAsBotFunctionDef);

Deno.test(
  "it does nothing if type: none inputs",
  async () => {
    const { chatPostMessageCalls, reactionsAddCalls } = setup();
    const inputs = { type: "none" };
    await respondAsBotFunction(
      createContext({ inputs }),
    );
    assertEquals(chatPostMessageCalls, []);
    assertEquals(reactionsAddCalls, []);
  },
);

Deno.test(
  "it calls chat.postMessage if type: message inputs",
  async () => {
    const channelId = "DUMMYCHANNELID";
    const text = "DUMMY_TEXT";
    const { chatPostMessageCalls, reactionsAddCalls } = setup();
    const inputs = { type: "message", channelId, text };
    await respondAsBotFunction(
      createContext({ inputs }),
    );
    assertEquals(chatPostMessageCalls, [{ channel: channelId, text }]);
    assertEquals(reactionsAddCalls, []);
  },
);

Deno.test(
  "it calls reactions.add if type: reaction inputs",
  async () => {
    const channelId = "DUMMYCHANNELID";
    const emoji = "DUMMY_EMOJI";
    const messageTs = "1234";
    const { chatPostMessageCalls, reactionsAddCalls } = setup();
    const inputs = {
      type: "reaction",
      channelId,
      emoji,
      messageTs,
    };
    await respondAsBotFunction(
      createContext({ inputs }),
    );
    assertEquals(chatPostMessageCalls, []);
    assertEquals(reactionsAddCalls, [{
      channel: channelId,
      name: emoji,
      timestamp: messageTs,
    }]);
  },
);
