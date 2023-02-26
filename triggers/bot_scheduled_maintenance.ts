import { Trigger } from "deno-slack-api/types.ts";
import { botScheduledMaintenanceWorkflow } from "../workflows/bot_scheduled_maintenance.ts";
import * as datetime from "std/datetime/mod.ts";

const botScheduledMaintenanceTrigger: Trigger<
  typeof botScheduledMaintenanceWorkflow.definition
> = {
  type: "scheduled",
  name: "Bot scheduled maintenance trigger",
  workflow:
    `#/workflows/${botScheduledMaintenanceWorkflow.definition.callback_id}`,
  inputs: {},
  schedule: {
    start_time: datetime.format(
      // set 1 day after
      // timezone in platform is probably utc
      new Date(new Date().getTime() + datetime.HOUR * 9 + datetime.DAY),
      "yyyy-MM-ddT05:00:00",
    ),
    timezone: "Asia/Tokyo",
    frequency: { type: "daily" },
  },
};
export default botScheduledMaintenanceTrigger;
