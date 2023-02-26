import { assertEquals } from "std/testing/asserts.ts";
import { SlackFunctionTester } from "deno-slack-sdk/mod.ts";
import * as mf from "mock_fetch/mod.ts";
import handleMessageToBotFunction, {
  handleMessageToBotFunctionDef,
} from "./handle_message_to_bot.ts";

mf.install();

const DEFAULT_AUTH_TEST_RESPONSE_BODY = {
  ok: true,
  url: "https://example.com/",
  team: "SampleWorkspace",
  user: "DUMMY_USER_NAME",
  team_id: "T12345678",
  user_id: "W12345678",
} as const;

type AuthTestResponse = {
  ok: true;
  url: string;
  team: string;
  user: string;
  team_id: string;
  user_id: string;
} | {
  ok: false;
  error: string;
};

const setup = (
  { resAuthTest }: { resAuthTest: { body: AuthTestResponse; status: number } },
) => {
  mf.mock("POST@/api/auth.test", () => {
    return new Response(JSON.stringify(resAuthTest.body), {
      status: resAuthTest.status,
    });
  });
};

const { createContext } = SlackFunctionTester(handleMessageToBotFunctionDef);

Deno.test(
  "it returns none output if matched handlers does not exist",
  async () => {
    const channelId = "DUMMYCHANNELID";
    const channelType = "DUMMYCHANNELTYPE";
    const userId = "DUMMYUSERID";
    setup({
      resAuthTest: {
        body: { ...DEFAULT_AUTH_TEST_RESPONSE_BODY },
        status: 200,
      },
    });
    const inputs = {
      channelId,
      channelType,
      userId,
      message: "DOES_NOT_EXIST_MESSAGE",
      messageTs: "1673778812501.0",
    };
    const res = await handleMessageToBotFunction(
      createContext({ inputs }),
    );
    assertEquals(res.outputs, { type: "none" });
  },
);

Deno.test(
  "it returns none output if message userId is bot userId",
  async () => {
    const channelId = "DUMMYCHANNELID";
    const channelType = "DUMMYCHANNELTYPE";
    const botUserId = "DUMMYUSERID";
    setup({
      resAuthTest: {
        body: { ...DEFAULT_AUTH_TEST_RESPONSE_BODY, user_id: botUserId },
        status: 200,
      },
    });
    const inputs = {
      channelId,
      channelType,
      userId: botUserId,
      message: "DOES_NOT_EXIST_MESSAGE",
      messageTs: "1673778812501.0",
    };
    const res = await handleMessageToBotFunction(
      createContext({ inputs }),
    );
    assertEquals(res.outputs, { type: "none" });
  },
);
