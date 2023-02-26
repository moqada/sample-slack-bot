import { assertEquals } from "std/testing/asserts.ts";
import * as mf from "mock_fetch/mod.ts";
import { createBotTester } from "../tester.ts";
import { googleImage } from "./google_image.ts";

const GOOGLE_CSE_ID = "DUMMY_GOOGLE_CSE_ID";
const GOOGLE_CSE_KEY = "DUMMY_GOOGLE_CSE_KEY";

mf.install();
const { createContext } = createBotTester(googleImage);

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
  const context = createContext("image とまんないんすよ", {
    env: { GOOGLE_CSE_ID, GOOGLE_CSE_KEY },
  });
  const res = await googleImage.func(context);
  assertEquals(res, { type: "message", text: "画像がないよ" });
});

Deno.test("image found", async () => {
  const imageUrl = "https://example.com/image.png";
  const { apiCalls } = setup({
    items: [{ link: imageUrl }],
  });
  const context = createContext("image とまんないんすよ ほんと", {
    env: { GOOGLE_CSE_ID, GOOGLE_CSE_KEY },
  });
  const res = await googleImage.func(context);
  assertEquals(res, { type: "message", text: imageUrl });
  assertEquals(apiCalls, [{
    cx: GOOGLE_CSE_ID,
    fields: "items(link)",
    key: GOOGLE_CSE_KEY,
    searchType: "image",
    q: "とまんないんすよ ほんと",
  }]);
});
