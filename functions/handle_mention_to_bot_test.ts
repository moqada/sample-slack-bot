import { assertEquals } from "std/testing/asserts.ts";
import { SlackFunctionTester } from "deno-slack-sdk/mod.ts";
import * as mf from "mock_fetch/mod.ts";
import handleMentionToBotFunction, {
  handleMentionToBotFunctionDef,
} from "./handle_mention_to_bot.ts";

mf.install();

type GetPermalinkResponse = {
  ok: true;
  permalink: string;
  channel: string;
} | {
  ok: false;
  error: string;
};

const BOT_USER_ID = "DUMMYBOTUSERID";

const setup = (
  { resGetPermalink }: { resGetPermalink: GetPermalinkResponse },
) => {
  mf.mock("POST@/api/chat.getPermalink", () => {
    return new Response(JSON.stringify(resGetPermalink), {
      status: 200,
    });
  });
  mf.mock("POST@/api/auth.test", () => {
    return new Response(
      JSON.stringify({ ok: true, user_id: BOT_USER_ID }),
      {
        status: 200,
      },
    );
  });
};

const { createContext } = SlackFunctionTester(handleMentionToBotFunctionDef);

Deno.test(
  "it returns message output if matched handlers exists",
  async () => {
    const channelId = "DUMMYCHANNELID";
    const channelType = "DUMMYCHANNELTYPE";
    const userId = "DUMMYUSERID";
    setup({
      resGetPermalink: {
        ok: true,
        channel: channelId,
        permalink:
          `https://example.com/archives/C1H9RESGL/p135854651700023?cid=C1H9RESGL`,
      },
    });
    const inputs = {
      channelId,
      channelType,
      userId,
      message: `<@${BOT_USER_ID}> ping`,
      messageTs: "1673778812501.0",
    };
    const res = await handleMentionToBotFunction(
      createContext({ inputs }),
    );
    assertEquals(res.outputs, {
      type: "message",
      channelId,
      mentionUserId: userId,
      threadTs: undefined,
      text: "PONG",
    });
  },
);

Deno.test(
  "it returns message output with threadTs if matched handlers exists and mentioned in the thread",
  async () => {
    const channelId = "DUMMYCHANNELID";
    const channelType = "DUMMYCHANNELTYPE";
    const threadTs = "1358546515.000008";
    const userId = "DUMMYUSERID";
    setup({
      resGetPermalink: {
        ok: true,
        channel: channelId,
        permalink:
          `https://example.com/archives/C1H9RESGL/p135854651700023?thread_ts=${threadTs}&cid=C1H9RESGL`,
      },
    });
    const inputs = {
      channelId,
      channelType,
      userId,
      message: `<@${BOT_USER_ID}> ping`,
      messageTs: "1673778812501.0",
    };
    const res = await handleMentionToBotFunction(
      createContext({ inputs }),
    );
    assertEquals(res.outputs, {
      type: "message",
      channelId,
      mentionUserId: userId,
      text: "PONG",
      threadTs,
    });
  },
);

Deno.test(
  "it returns none output if matched handlers does not exist",
  async () => {
    const channelId = "DUMMYCHANNELID";
    const channelType = "DUMMYCHANNELTYPE";
    const userId = "DUMMYUSERID";
    setup({
      resGetPermalink: {
        ok: true,
        channel: channelId,
        permalink:
          `https://example.com/archives/C1H9RESGL/p135854651700023?cid=C1H9RESGL`,
      },
    });
    const inputs = {
      channelId,
      channelType,
      userId,
      message: `<@${BOT_USER_ID}> DOES_NOT_EXIST_COMMAND`,
      messageTs: "1673778812501.0",
    };
    const res = await handleMentionToBotFunction(
      createContext({ inputs }),
    );
    assertEquals(res.outputs, {
      type: "message",
      channelId,
      text:
        "`DOES_NOT_EXIST_COMMAND` にマッチするコマンドがないで\n`@sample-slack-bot help` を実行してや",
      threadTs: undefined,
    });
  },
);
