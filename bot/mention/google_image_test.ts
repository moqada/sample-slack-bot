import { createMentionCommandTester } from "gbas/mod.ts";
import { assert, assertEquals } from "std/testing/asserts.ts";
import * as mf from "mock_fetch/mod.ts";
import { googleImage } from "./google_image.ts";
import { mentionCommandDispatcher } from "../dispatchers.ts";

const GOOGLE_CSE_ID = "DUMMY_GOOGLE_CSE_ID";
const GOOGLE_CSE_KEY = "DUMMY_GOOGLE_CSE_KEY";

mf.install();
const { createContext } = createMentionCommandTester(googleImage);

const setup = ({ items }: { items: Array<{ link: string }> }) => {
  const apiCalls: Record<string, unknown>[] = [];
  mf.mock("GET@/customsearch/v1", (req) => {
    const url = new URL(req.url);
    const params: Record<string, unknown> = {};
    for (const [key, val] of url.searchParams.entries()) {
      params[key] = val;
    }
    apiCalls.push(params);
    return new Response(JSON.stringify({ items }));
  });
  return { apiCalls };
};

Deno.test("image did not find", async () => {
  setup({ items: [] });
  const context = createContext("<@BOT> image とまんないんすよ", {
    env: { GOOGLE_CSE_ID, GOOGLE_CSE_KEY },
  });
  const res = await mentionCommandDispatcher.dispatch(context);
  assert(res.type === "message", res.type);
  assertEquals(res.text, "画像がないよ");
});

Deno.test("image found", async () => {
  const imageUrl = "https://example.com/image.png";
  const { apiCalls } = setup({
    items: [{ link: imageUrl }],
  });
  const context = createContext("<@BOT> image とまんないんすよ ほんと", {
    env: { GOOGLE_CSE_ID, GOOGLE_CSE_KEY },
  });
  const res = await mentionCommandDispatcher.dispatch(context);
  assert(res.type === "message", res.type);
  assertEquals(res.text, imageUrl);
  assertEquals(apiCalls, [{
    cx: GOOGLE_CSE_ID,
    fields: "items(link)",
    key: GOOGLE_CSE_KEY,
    searchType: "image",
    q: "とまんないんすよ ほんと",
  }]);
});
