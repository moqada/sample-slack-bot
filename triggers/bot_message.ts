import { createMessageCommandSlackTrigger } from "gbas/mod.ts";
import { botMessageWorkflow } from "../workflows/bot_message.ts";

export default createMessageCommandSlackTrigger({
  channelIds: ["DUMMY_CHANNEL_ID"],
  workflow: botMessageWorkflow,
});
