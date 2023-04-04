import { createReactionCommandSlackTrigger } from "gbas/mod.ts";
import { botReactionWorkflow } from "../workflows/bot_reaction.ts";

export default createReactionCommandSlackTrigger({
  channelIds: ["DUMMY_CHANNEL_ID"],
  workflow: botReactionWorkflow,
});
