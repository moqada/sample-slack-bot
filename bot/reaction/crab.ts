import { createBotReaction } from "../utils.ts";

export const crab = createBotReaction({
  name: "crab",
  help: [":crab: - たしかに"],
  emojis: ["crab"],
  func: ({ reaction }) => {
    if (reaction.emoji === "crab") {
      return {
        type: "message",
        "text": "たし:crab:",
        mentionUserId: reaction.userId,
      };
    }
    return { type: "none" };
  },
});
