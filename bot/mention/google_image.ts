import { createMentionCommand } from "gbas/mod.ts";

export const googleImage = createMentionCommand({
  execute: async (c) => {
    const query = c.match[1];
    const imageUrl = await getImage({ env: c.env, query, type: "normal" });
    if (!imageUrl) {
      return c.res.message("画像がないよ");
    }
    return c.res.message(imageUrl);
  },
  examples: ["image <query> - hog"],
  name: "google image",
  pattern: /^image\s+(.+)$/,
  outgoingDomains: ["customsearch.googleapis.com"],
});

export const googleAnimatedImage = createMentionCommand({
  execute: async (c) => {
    const query = c.match[1];
    const imageUrl = await getImage({ env: c.env, query, type: "gif" });
    if (!imageUrl) {
      return c.res.message("画像がないよ");
    }
    return c.res.message(imageUrl);
  },
  examples: ["animated <query> - hoge"],
  name: "google animated image",
  pattern: /^animate\s+(.+)$/,
  outgoingDomains: ["customsearch.googleapis.com"],
});

const getImage = async (
  { env, query, type = "normal" }: {
    env: Record<string, string>;
    query: string;
    type?: "gif" | "normal";
  },
) => {
  const { GOOGLE_CSE_ID, GOOGLE_CSE_KEY } = env;
  const url = "https://customsearch.googleapis.com/customsearch/v1";
  const res = await fetch(`${url}?${new URLSearchParams({
    q: query,
    searchType: "image",
    fields: "items(link)",
    cx: GOOGLE_CSE_ID,
    key: GOOGLE_CSE_KEY,
    ...(type === "gif"
      ? {
        fileType: "gif",
        hq: "animated",
        tbs: "itp:animated",
      }
      : {}),
  })}`);
  const body = await res.json();
  if (body.items.length === 0) {
    return;
  }
  const img = body.items[Math.floor(Math.random() * body.items.length)];
  return img.link;
};
