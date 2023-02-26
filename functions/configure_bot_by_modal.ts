import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import {
  getAllPublicNoSharedChannels,
  getJoinedPublicNoSharedChannels,
  setupScheduledTriggers,
} from "../lib/slack_api.ts";
import botScheduledMaintenanceTrigger from "../triggers/bot_scheduled_maintenance.ts";
import {
  setupActiveChannelTriggers,
  setupAllChannelTriggers,
  setupWorkspaceTriggers,
} from "./internals/bot_configuration.ts";

export const configureBotByModalFunctionDef = DefineFunction({
  callback_id: "configure_bot_by_modal",
  title: "Configure bot by modal",
  source_file: "functions/configure_bot_by_modal.ts",
  input_parameters: {
    properties: {
      interactivity: { type: Schema.slack.types.interactivity },
    },
    required: ["interactivity"],
  },
  output_parameters: { properties: {}, required: [] },
});

const BASE_MODAL_VIEW = {
  title: { type: "plain_text", text: "Sample Slack Bot" },
  close: { type: "plain_text", text: "Close" },
};

export default SlackFunction(
  configureBotByModalFunctionDef,
  async ({ inputs, client }) => {
    const botJoinedChannelIds =
      (await getJoinedPublicNoSharedChannels({ client })).map((c) => c.id);
    const res = await client.views.open({
      interactivity_pointer: inputs.interactivity.interactivity_pointer,
      view: {
        ...BASE_MODAL_VIEW,
        type: "modal",
        callback_id: "configure_active_channels",
        submit: { type: "plain_text", text: "Activate" },
        blocks: [
          {
            type: "input",
            block_id: "channels",
            element: {
              type: "multi_channels_select",
              initial_channels: botJoinedChannelIds,
              action_id: "action",
            },
            label: {
              type: "plain_text",
              text: "channels to activate the bot main workflows",
            },
          },
        ],
      },
    });
    if (!res.ok) {
      return {
        error: `client.views.open failed: ${
          res.error?.toString() || "unknown"
        }`,
      };
    }
    return { completed: false };
  },
).addViewSubmissionHandler(
  ["configure_active_channels"],
  async ({ client, view }) => {
    const channelIds = view.state.values.channels.action.selected_channels;
    await setupActiveChannelTriggers({ channelIds, client });
    return {
      response_action: "update",
      view: {
        ...BASE_MODAL_VIEW,
        type: "modal",
        callback_id: "configure_all_channels",
        submit: { type: "plain_text", text: "Activate" },
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text:
                "The bot main workflows are now available for the channels :white_check_mark:\n\nNext, activate the workspace level workflows.",
            },
          },
        ],
      },
    };
  },
).addViewSubmissionHandler(["configure_all_channels"], async ({ client }) => {
  const allChannelIds = (await getAllPublicNoSharedChannels({ client })).map(
    (c) => c.id,
  );
  await setupAllChannelTriggers({ channelIds: allChannelIds, client });
  await setupWorkspaceTriggers({ client });
  await setupScheduledTriggers({
    client,
    triggers: [botScheduledMaintenanceTrigger],
  });
  return {
    response_action: "update",
    view: {
      ...BASE_MODAL_VIEW,
      "type": "modal",
      "callback_id": "completion",
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text":
              "*Complete!*\n\nAll workflows are now available :white_check_mark:",
          },
        },
      ],
    },
  };
});
