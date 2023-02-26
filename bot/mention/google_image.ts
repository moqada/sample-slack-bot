import { createBotMention } from "../utils.ts";

export const googleImage = createBotMention({
  func: async ({ env, message }) => {
    const query = message.match[1];
    const imageUrl = await getImage({ env, query, type: "normal" });
    if (!imageUrl) {
      return { type: "message", text: "画像がないよ" };
    }
    return { type: "message", text: imageUrl };
  },
  help: ["image <query> - hog"],
  name: "google image",
  pattern: /^image\s+(.+)$/,
});

export const googleAnimatedImage = createBotMention({
  func: async ({ env, message }) => {
    const query = message.match[1];
    const imageUrl = await getImage({ env, query, type: "gif" });
    if (!imageUrl) {
      return { type: "message", text: "画像がないよ" };
    }
    return { type: "message", text: imageUrl };
  },
  help: ["animated <query> - hoge"],
  name: "google animated image",
  pattern: /^animate\s+(.+)$/,
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
