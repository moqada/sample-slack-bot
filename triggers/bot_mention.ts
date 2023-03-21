import { createMentionCommandSlackTrigger } from "gbas/mod.ts";
import { botMentionWorkflow } from "../workflows/bot_mention.ts";

export default createMentionCommandSlackTrigger({
  channelIds: ["DUMMY_CHANNEL_ID"],
  workflow: botMentionWorkflow,
});
